import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { MembershipStatus } from 'generated/prisma/browser';
import { ListMembersQueryDto } from './dto/list-members-query.dto';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMe(currentUser: JwtPayload, organizationId?: string) {

    // 1. Garantimos que estamos no contexto de uma organização (tenant)
    this.assertTenantContext(organizationId);

    // 2. Verificamos se o usuário é membro da organização activa e buscamos seu perfil
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId: currentUser.id,
        organizationId,
        status: { in: [MembershipStatus.NORMAL, MembershipStatus.ACCEPTED] },
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
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

    // 3. Se não for membro, retornamos um erro de acesso negado
    if (!membership) {
      throw new ForbiddenException('Usuário não pertence à organização activa');
    }

    // 4. Retornamos o perfil do usuário junto com seu papel e informações da organização
    return {
      success: true,
      profile: {
        ...membership.user,
        role: membership.role,
        organization: membership.organization,
      },
    };
  }

  async updateMe(
    currentUser: JwtPayload,
    organizationId: string | undefined,
    dto: UpdateProfileDto,
  ) {

    // 1. Garantimos que estamos no contexto de uma organização (tenant)
    this.assertTenantContext(organizationId);

    // 2. Verificamos se o usuário é membro da organização activa
    await this.assertMembership(currentUser.id, organizationId!);

    // 3. Actualizamos o perfil do usuário com os dados fornecidos, se existirem
    const updatedUser = await this.prisma.user.update({
      where: { id: currentUser.id },
      data: {
        ...(dto.displayName !== undefined ? { displayName: dto.displayName } : {}),
        ...(dto.avatarUrl !== undefined ? { avatarUrl: dto.avatarUrl } : {}),
        lastSeen: new Date(),
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        lastSeen: true,
      },
    });

    return {
      success: true,
      profile: updatedUser,
    };
  }

  async listMembers(organizationId: string | undefined, query: ListMembersQueryDto) {

    // 1. Garantimos que estamos no contexto de uma organização (tenant)
    this.assertTenantContext(organizationId);

    // 2. Construímos a cláusula WHERE para filtrar membros da organização, e opcionalmente por nome/email
    const whereClause = {
      organizationId,
      status: { in: [MembershipStatus.NORMAL, MembershipStatus.ACCEPTED] },
      ...(query.q
        ? {
            user: {
              OR: [
                { displayName: { contains: query.q, mode: 'insensitive' as const } },
                { email: { contains: query.q, mode: 'insensitive' as const } },
              ],
            },
          }
        : {}),
    };

    // 3. Buscamos os membros da organização com paginação e ordenação, incluindo informações do usuário
    const members = await this.prisma.membership.findMany({
      where: whereClause,
      take: query.limit ?? 20, // Limite de resultados por página (default 20)
      orderBy: { joinedAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
            avatarUrl: true,
            lastSeen: true,
          },
        },
      },
    });

    // 4. Retornamos a lista de membros com seus papéis, data de entrada e informações do usuário
    return {
      success: true,
      organizationId,
      total: members.length,
      members: members.map((membership) => ({
        role: membership.role,
        joinedAt: membership.joinedAt,
        user: membership.user,
      })),
    };
  }

  async getMemberById(organizationId: string | undefined, memberId: string) {

    // 1. Garantimos que estamos no contexto de uma organização (tenant)
    this.assertTenantContext(organizationId);

    // 2. Buscamos a associação do membro específico na organização, incluindo informações do usuário
    const membership = await this.prisma.membership.findFirst({
      where: {
        organizationId,
        userId: memberId,
        status: { in: [MembershipStatus.NORMAL, MembershipStatus.ACCEPTED] },
      },
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

    // 3. Se o membro não for encontrado, retornamos um erro de não encontrado
    if (!membership) {
      throw new NotFoundException('Membro não encontrado nessa organização');
    }

    // 4. Retornamos os detalhes do membro, incluindo seu papel, data de entrada e informações do usuário
    return {
      success: true,
      member: {
        role: membership.role,
        joinedAt: membership.joinedAt,
        user: membership.user,
      },
    };
  }

  async touchOnline(currentUser: JwtPayload, organizationId: string | undefined) {

    // 1. Garantimos que estamos no contexto de uma organização (tenant)
    this.assertTenantContext(organizationId);

    // 2. Verificamos se o usuário é membro da organização activa
    await this.assertMembership(currentUser.id, organizationId!);

    // 3. Actualizamos o campo lastSeen do usuário para a data/hora atual
    await this.prisma.user.update({
      where: { id: currentUser.id },
      data: { lastSeen: new Date() },
    });

    return {
      success: true,
      lastSeen: new Date(),
    };
  }

  private async assertMembership(userId: string, organizationId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId, organizationId, status: { in: [MembershipStatus.NORMAL, MembershipStatus.ACCEPTED] } },
      select: { id: true },
    });

    if (!membership) {
      throw new ForbiddenException('Usuário não pertence à organização activa');
    }
  }

  private assertTenantContext(organizationId?: string) {
    if (!organizationId) {
      throw new ForbiddenException('Contexto da organização não encontrado');
    }
  }
}
