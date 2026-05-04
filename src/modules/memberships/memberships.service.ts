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
                throw new BadRequestException('Já existe um convite pendente para este usuário');
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
				user: {
					select: {
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
