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
import type { UserPayload } from '../auth/interfaces/user-payload.interface';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createOrganization(
    dto: CreateOrganizationDto,
    user: JwtPayload,
  ) {
    const slug = this.buildSlug(dto.slug ?? dto.name);

    if (!slug) {
      throw new BadRequestException('Nome ou slug inválido');
    }

    const existingOrganization = await this.prisma.organization.findUnique({
      where: { slug },
    });

    if (existingOrganization) {
      throw new ConflictException('Já existe uma organização com este slug');
    }

    // Transação para garantir que a organização e a associação do usuário sejam criadas atomicaamente
    return this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: dto.name,
          slug,
          logoUrl: dto.logoUrl,
        },
      });

      await tx.membership.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: Role.SUPER_ADMIN,
        },
      });

      // Criamos um novo token JWT com o organizationId do tenant recém-criado
      // satisdfies: é uma forma de garantir que o objecto criado corresponde à interface JwtPayload, ajudando o TypeScript a inferir os tipos corretamente.
      const activeTenant = {
        id: user.id,
        email: user.email,
        organizationId: organization.id,
        role: Role.SUPER_ADMIN,
      } satisfies JwtPayload;

      return {
        success: true,
        organization,
        user: {
          ...activeTenant,
          token: this.createToken(activeTenant),
        },
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
    });

    if (!membership) {
      throw new ForbiddenException('Usuário não pertence a esta organização');
    }

    const activeTenant = {
      id: user.id,
      email: user.email,
      organizationId,
      role: membership.role,
    } satisfies JwtPayload;

    return {
      success: true,
      user: {
        ...activeTenant,
        token: this.createToken(activeTenant),
      },
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
            name: true,
            slug: true,
            logoUrl: true,
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
        name: membership.organization.name,
        slug: membership.organization.slug,
        logoUrl: membership.organization.logoUrl,
        role: membership.role,
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
