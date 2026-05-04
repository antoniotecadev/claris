import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role, MembershipStatus } from 'generated/prisma/enums';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { Resend } from 'resend';

@Injectable()
export class MembershipsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly resend = new Resend(process.env.RESEND_API_KEY ?? '');
  private readonly resendFrom = process.env.RESEND_FROM ?? 'claris@resend.dev';

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
        status: membership.status,
        joinedAt: membership.joinedAt,
        user: membership.user,
      })),
    };
  }

  async inviteMember(
    currentUser: JwtPayload,
    organizationId: string | undefined,
    dto: InviteMemberDto,
  ) {
    await this.assertCanManageMembers(currentUser.id, organizationId);

    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true, email: true, displayName: true },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const existingMembership = await this.prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: user.id,
          organizationId: organizationId!,
        },
      },
    });

    if (existingMembership) {
      if (existingMembership.status === MembershipStatus.ACCEPTED) {
        throw new BadRequestException('Usuário já pertence a esta organização');
      }

      if (existingMembership.status === MembershipStatus.PENDING) {
        throw new BadRequestException(
          'Já existe um convite pendente para este usuário',
        );
      }
    }

    const membership = await this.prisma.membership.create({
      data: {
        userId: user.id,
        organizationId: organizationId!,
        role: dto.role ?? Role.MEMBER,
        status: MembershipStatus.PENDING,
      },
      include: {
        organization: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            email: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    await this.resend.emails.send({
      from: this.resendFrom,
      to: user.email,
      subject: `Convite para ${membership.organization.name}`,
      html: `
			<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
				<div style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
					<h1 style="color: #1f2937; font-size: 24px; margin-bottom: 20px; text-align: center;">Bem-vindo!</h1>
					
					<p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Olá <strong>${user.displayName}</strong>,</p>
					
					<p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Você foi convidado para se juntar à organização <strong style="color: #2563eb;">${membership.organization.name}</strong> com a função de <strong style="color: #2563eb;">${membership.role}</strong>.</p>
					
					<div style="text-align: center; margin: 40px 0;">
						<a href="${process.env.FRONTEND_URL}/accept-invite?orgId=${membership.organizationId}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; transition: background-color 0.3s;">Aceitar Convite</a>
					</div>
					
					<p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">Se você não esperava este convite, pode ignorar este email.</p>
					
					<p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 20px;">Atenciosamente,<br/><strong>Equipe Claris</strong></p>
				</div>
			</div>
		`,
    });

    return {
      success: true,
      member: membership,
    };
  }

  async acceptInvite(
    currentUser: JwtPayload,
    organizationId: string | undefined,
    memberId: string,
    toEmail: string,
  ) {
    this.assertOrganizationId(organizationId);

    if (currentUser.id !== memberId) {
      throw new ForbiddenException(
        'Você só pode aceitar convites para sua própria conta',
      );
    }

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
      throw new NotFoundException('Convite não encontrado');
    }

    if (membership.status === MembershipStatus.ACCEPTED) {
      throw new BadRequestException('Este convite já foi aceito');
    }

    const updatedMembership = await this.prisma.membership.update({
      where: {
        userId_organizationId: {
          userId: memberId,
          organizationId: organizationId!,
        },
      },
      data: {
        status: MembershipStatus.ACCEPTED,
      },
      include: {
        organization: {
          select: {
            name: true,
          },
        },
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

    await this.resend.emails.send({
      from: this.resendFrom,
      to: toEmail,
      subject: `Convite Aceite - ${updatedMembership.organization.name}`,
      html: `
		<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
			<div style="background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
				<h1 style="color: #1f2937; font-size: 24px; margin-bottom: 20px; text-align: center;">Convite Aceito!</h1>
				
				<p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Olá <strong>${updatedMembership.user.displayName}</strong>,</p>
				
				<p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">O convite para se juntar à organização <strong style="color: #2563eb;">${updatedMembership.organization.name}</strong> foi aceite.</p>
				
				<p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Você pode agora acessar a organização e começar a colaborar com sua equipe.</p>
				
				<div style="text-align: center; margin: 40px 0;">
					<a href="${process.env.FRONTEND_URL}/organizations/${updatedMembership.organizationId}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; transition: background-color 0.3s;">Acessar Organização</a>
				</div>
				
				<p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">Se você não esperava este convite, pode ignorar este email.</p>
				
				<p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-top: 20px;">Atenciosamente,<br/><strong>Equipe Claris</strong></p>
			</div>
		</div>
	  `,
    });

    return {
      success: true,
      member: updatedMembership,
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

  async removeMember(
    currentUser: JwtPayload,
    organizationId: string | undefined,
    memberId: string,
  ) {
    await this.assertCanManageMembers(currentUser.id, organizationId);

    if (currentUser.id === memberId) {
      throw new BadRequestException('Não é permitido remover o próprio membro');
    }

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
      throw new ForbiddenException('Usuário não pertence à organização activa');
    }

    const allowedRoles: Role[] = [Role.SUPER_ADMIN, Role.PASTOR];

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
