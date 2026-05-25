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

  async getMe(currentUser: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        email: true,
        displayName: true,
        gender: true,
        birthDate: true,
        avatarUrl: true,
        lastSeen: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return {
      success: true,
      profile: user,
    };
  }

  async updateMe(
    currentUser: JwtPayload,
    organizationId: string | undefined,
    dto: UpdateProfileDto,
  ) {

    this.assertTenantContext(organizationId);

    await this.assertMembership(currentUser.id, organizationId!);

    const updatedUser = await this.prisma.user.update({
      where: { id: currentUser.id },
      data: {
        ...(dto.displayName !== undefined ? { displayName: dto.displayName } : {}),
        ...(dto.avatarUrl !== undefined ? { avatarUrl: dto.avatarUrl } : {}),
        ...(dto.gender !== undefined ? { gender: dto.gender } : {}),
        ...(dto.birthDate !== undefined ? { birthDate: new Date(dto.birthDate) } : {}),
        lastSeen: new Date(),
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        gender: true,
        birthDate: true,
        avatarUrl: true,
        lastSeen: true,
      },
    });

    return {
      success: true,
      profile: updatedUser,
    };
  }

  async touchOnline(currentUser: JwtPayload, organizationId: string | undefined) {

    this.assertTenantContext(organizationId);

    await this.assertMembership(currentUser.id, organizationId!);

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
