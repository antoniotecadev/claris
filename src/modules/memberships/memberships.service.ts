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

        // 1. Listar os membros da organização activa, ordenados por data de entrada (joinedAt)
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

        // 2. Retornar a lista de membros com suas informações e o total de membros
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

	async inviteMember(
		currentUser: JwtPayload,
		organizationId: string | undefined,
		dto: InviteMemberDto,
	) {
        // 1. Verificar se o usuário tem permissão para gerir membros na organização activa
		await this.assertCanManageMembers(currentUser.userId, organizationId);

        // 2. Verificar se o email do membro a ser convidado corresponde a um usuário existente
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email },
			select: { id: true, email: true, displayName: true },
		});

        // 3. Se o usuário não existir, retornamos um erro
		if (!user) {
			throw new NotFoundException('Usuário não encontrado');
		}

        // 4. Verificar se o usuário já é membro da organização activa
		const existingMembership = await this.prisma.membership.findUnique({
			where: {
				userId_organizationId: {
					userId: user.id,
					organizationId: organizationId!,
				},
			},
		});

        // 5. Se o usuário já for membro, ou se já existir um convite pendente, retornamos um erro para evitar convites duplicados ou múltiplos convites para o mesmo usuário
        if (existingMembership) {
            if (existingMembership.status === MembershipStatus.ACCEPTED) {
                throw new BadRequestException('Usuário já pertence a esta organização');
            }
            
            if (existingMembership.status === MembershipStatus.PENDING) {
                throw new BadRequestException('Já existe um convite pendente para este usuário');
            }
        }

        // 6. Criar a associação do novo membro com a organização activa, atribuindo o cargo especificado ou o cargo padrão de MEMBER
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

        // 7. Retornar os detalhes do membro convidado, incluindo seu cargo e informações do usuário
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
        // 1. Verificar se o usuário tem permissão para gerir membros na organização activa
		await this.assertCanManageMembers(currentUser.userId, organizationId);

        // 2. Verificar se o membro cuja função será actualizada pertence à organização activa
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

        // 3. Se o membro não for encontrado, retornamos um erro de não encontrado
		if (!membership) {
			throw new NotFoundException('Membro não encontrado');
		}

        // 4. Actualizar o cargo do membro para o novo cargo especificado
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

        // 5. Retornar os detalhes do membro com o cargo actualizado, incluindo informações do usuário
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
        // 1. Verificar se o usuário tem permissão para gerir membros na organização activa
		await this.assertCanManageMembers(currentUser.userId, organizationId);


        // 2. Verificar se o membro a ser removido é o próprio usuário, e se for, retornamos um erro de bad request para evitar que um usuário remova a si mesmo
		if (currentUser.userId === memberId) {
			throw new BadRequestException('Não é permitido remover o próprio membro');
		}

        // 3. Verificar se o membro a ser removido pertence à organização activa
		const membership = await this.prisma.membership.findUnique({
			where: {
				userId_organizationId: {
					userId: memberId,
					organizationId: organizationId!,
				},
			},
		});

        // 4. Se o membro não for encontrado, retornamos um erro de não encontrado
		if (!membership) {
			throw new NotFoundException('Membro não encontrado');
		}

        // 5. Remover a associação do membro com a organização activa
		await this.prisma.membership.delete({
			where: {
				userId_organizationId: {
					userId: memberId,
					organizationId: organizationId!,
				},
			},
		});

        // 6. Retornar uma mensagem de sucesso indicando que o membro foi removido com sucesso
		return {
			success: true,
			message: 'Membro removido com sucesso',
		};
	}

	private async assertCanManageMembers(
		userId: string,
		organizationId: string | undefined,
	) {
        // 1. Garantir que estamos no contexto de uma organização (tenant)
		this.assertOrganizationId(organizationId);

        // 2. Verificar se o usuário é membro da organização activa e obter seu cargo
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

        // 3. Se o usuário não for membro, ou se seu cargo não for SUPER_ADMIN ou PASTOR, retornamos um erro de permissão
		if (!membership) {
			throw new ForbiddenException('Usuário não pertence à organização activa');
		}

        // 4. Definimos os cargos permitidos para gerir membros (SUPER_ADMIN e PASTOR)
		const allowedRoles: Role[] = [Role.SUPER_ADMIN, Role.PASTOR];

        // 5. Se o cargo do membro não estiver entre os cargos permitidos, retornamos um erro de permissão
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
