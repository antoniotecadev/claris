import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from 'generated/prisma/enums';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { Resend } from 'resend';

@Injectable()
export class MembershipsService {
  constructor(private readonly prisma: PrismaService) {}

  async listMembers(organizationId: string | undefined) {
    this.assertOrganizationId(organizationId);

    const memberships = await this.prisma.membership.findMany({
      where: { organizationId },
      orderBy: { joinedAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            avatarUrl: true,
            lastSeen: true,
            createdAt: true,
          },
        },
      },
    });

    return {
      success: true,
      total: memberships.length,
      members: memberships.map((membership) => ({
        id: membership.id,
        role: membership.role,
        joinedAt: membership.joinedAt,
        user: membership.user,
      })),
    };
  }

  async updateMemberRole(
    currentUser: JwtPayload,
    organizationId: string | undefined,
    memberId: string,
    dto: UpdateMemberRoleDto,
  ) {
    await this.assertCanManageMembers(currentUser.id, organizationId);

    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: memberId,
          organizationId: organizationId!,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('Membro não encontrado');
    }

    const updatedMembership = await this.prisma.membership.update({
      where: {
        userId_organizationId: {
          userId: memberId,
          organizationId: organizationId!,
        },
      },
      data: {
        role: dto.role,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return {
      success: true,
      member: updatedMembership,
    };
  }

  async joinOrganization(
    currentUser: JwtPayload,
    organizationId: string,
  ) {
    if (!organizationId) {
      throw new BadRequestException('ID da organização é obrigatório');
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organização não encontrada');
    }

    const existingMembership = await this.prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: currentUser.id,
          organizationId,
        },
      },
    });

    if (existingMembership) {
      throw new BadRequestException('Utilizador já é membro desta organização');
    }

    const membership = await this.prisma.membership.create({
      data: {
        userId: currentUser.id,
        organizationId,
        role: Role.MEMBER,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return {
      success: true,
      member: membership,
    };
  }

  async removeMember(
    organizationId: string | undefined,
    memberId: string,
  ) {

    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: memberId,
          organizationId: organizationId!,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('Membro não encontrado');
    }

    await this.prisma.membership.delete({
      where: {
        userId_organizationId: {
          userId: memberId,
          organizationId: organizationId!,
        },
      },
    });

    return {
      success: true,
      message: 'Membro removido com sucesso',
    };
  }

  private async assertCanManageMembers(
    userId: string,
    organizationId: string | undefined,
  ) {
    this.assertOrganizationId(organizationId);

    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId: organizationId!,
        },
      },
      select: {
        role: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Membro não pertence à organização activa');
    }

    const allowedRoles: Role[] = [Role.ADMIN];

    if (!allowedRoles.includes(membership.role)) {
      throw new ForbiddenException('Sem permissão para gerir membros');
    }
  }

  private assertOrganizationId(organizationId: string | undefined) {
    if (!organizationId) {
      throw new ForbiddenException('Contexto da organização não encontrado');
    }
  }
}
