import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MembershipsService } from './memberships.service';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@Controller('memberships')
@UseGuards(JwtAuthGuard)
export class MembershipsController {
	constructor(private readonly membershipsService: MembershipsService) {}

    // Rota para listar os membros da organização activa
	@Get()
	listMembers(@Req() req: any) {
		return this.membershipsService.listMembers(req.organizationId);
	}

    // Rota para convidar um novo membro para a organização activa
	@Post('invite')
	inviteMember(
		@CurrentUser() user: JwtPayload,
		@Req() req: any,
		@Body() dto: InviteMemberDto,
	) {
		return this.membershipsService.inviteMember(user, req.organizationId, dto);
	}

    // Rota para atualizar o cargo de um membro da organização activa
	@Patch(':memberId/role')
	updateMemberRole(
		@CurrentUser() user: JwtPayload,
		@Req() req: any,
		@Param('memberId') memberId: string,
		@Body() dto: UpdateMemberRoleDto,
	) {
		return this.membershipsService.updateMemberRole(
			user,
			req.organizationId,
			memberId,
			dto,
		);
	}

    // Rota para remover um membro da organização activa
	@Delete(':memberId')
	removeMember(
		@CurrentUser() user: JwtPayload,
		@Req() req: any,
		@Param('memberId') memberId: string,
	) {
		return this.membershipsService.removeMember(
			user,
			req.organizationId,
			memberId,
		);
	}
}
