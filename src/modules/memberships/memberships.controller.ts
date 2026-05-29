import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MembershipsService } from './memberships.service';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';

@Controller('organizations/:organizationId/memberships')
@UseGuards(JwtAuthGuard)
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Get()
  listMembers(@Param('organizationId') organizationId: string) {
    return this.membershipsService.listMembers(organizationId);
  }

  @Patch(':memberId/role')
  updateMemberRole(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.membershipsService.updateMemberRole(
      user,
      organizationId,
      memberId,
      dto,
    );
  }

  @Delete(':memberId')
  removeMember(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.membershipsService.removeMember(user, organizationId, memberId);
  }
}
