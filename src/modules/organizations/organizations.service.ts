import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MembershipStatus, Role } from 'generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async listAllOrganizations() {
    const organizations = await this.prisma.organization.findMany({
      select: {
        id: true,
        churchId: true,
        name: true,
        slug: true,
        address: true,
        description: true,
        logoUrl: true,
        createdAt: true,
        church: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: { memberships: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      organizationLength: organizations.length,
      organizations: organizations.map((org) => ({
        id: org.id,
        churchId: org.churchId,
        name: org.name,
        slug: org.slug,
        address: org.address,
        description: org.description,
        logoUrl: org.logoUrl,
        createdAt: org.createdAt,
        church: org.church,
        memberCount: org._count.memberships,
      })),
    };
  }

  async createOrganization(
    dto: CreateOrganizationDto,
    file: Express.Multer.File,
    user: JwtPayload,
  ) {
    const slug = this.buildSlug(dto.slug ?? dto.name);

    if (!slug) {
      throw new BadRequestException('Nome ou slug inválido');
    }

    const church = await this.prisma.church.findUnique({
      where: { id: dto.churchId },
      select: { id: true },
    });

    if (!church) {
      throw new BadRequestException('Igreja não encontrada');
    }

    const existingOrganization = await this.prisma.organization.findUnique({
      where: { slug },
    });

    if (existingOrganization) {
      throw new ConflictException('Já existe uma organização com este slug');
    }

    let logoUrl: string | null = null;

    if (file) {
      const uploaded: any = await this.cloudinaryService.uploadFile(file);

      logoUrl = uploaded.secure_url;
    }

    return this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          churchId: dto.churchId,
          name: dto.name,
          slug,
          address: dto.address,
          description: dto.description,
          logoUrl,
        },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: Role.SUPER_ADMIN,
        },
      });

      return {
        success: true,
        organization,
      };
    });
  }

  async switchOrganization(user: JwtPayload, organizationId: string) {
    this.assertOrganizationId(organizationId);

    const membership = await this.prisma.membership.findFirst({
      where: {
        userId: user.id,
        organizationId,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            createdAt: true,
          },
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('Usuário não pertence a esta organização');
    }

    return {
      success: true,
      organization: membership.organization,
    };
  }

  async getCurrentOrganization(organizationId: string) {
    this.assertOrganizationId(organizationId);

    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        createdAt: true,
      },
    });

    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }

    return {
      success: true,
      organization,
    };
  }

  async listMyOrganizations(userId: string) {
    const memberships = await this.prisma.membership.findMany({
      where: {
        userId,
        status: { in: [MembershipStatus.NORMAL, MembershipStatus.ACCEPTED] },
      },
      include: {
        organization: {
          select: {
            id: true,
            churchId: true,
            name: true,
            slug: true,
            address: true,
            description: true,
            logoUrl: true,
            createdAt: true,
            church: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    return {
      success: true,
      organizationLength: memberships.length,
      organizations: memberships.map((membership) => ({
        organizationId: membership.organization.id,
        churchId: membership.organization.churchId,
        name: membership.organization.name,
        slug: membership.organization.slug,
        address: membership.organization.address,
        description: membership.organization.description,
        logoUrl: membership.organization.logoUrl,
        role: membership.role,
        church: membership.organization.church,
        createdAt: membership.organization.createdAt,
      })),
    };
  }

  async getStats(organizationId: string) {
    this.assertOrganizationId(organizationId);

    const [memberships, events, messages] = await Promise.all([
      this.prisma.membership.count({ where: { organizationId } }),
      this.prisma.event.count({ where: { organizationId } }),
      this.prisma.message.count({ where: { organizationId } }),
    ]);

    return {
      success: true,
      organizationId,
      stats: {
        members: memberships,
        events,
        messages,
      },
    };
  }

  private assertOrganizationId(organizationId: string) {
    if (!organizationId) {
      throw new ForbiddenException('Contexto da organização não encontrado');
    }
  }

  private buildSlug(value: string) {
    return value
      .normalize('NFD') // Normaliza a string para decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres não alfanuméricos por hífens
      .replace(/^-+|-+$/g, ''); // Remove hífens extras no início ou fim
  }

  private createToken(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      expiresIn: 24 * 60 * 60,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
  }
}
