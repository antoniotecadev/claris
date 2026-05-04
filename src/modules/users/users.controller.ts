import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ListMembersQueryDto } from './dto/list-members-query.dto';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMyProfile(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
  ) {
    return this.usersService.getMe(user, organizationId);
  }

  @Patch('me')
  updateMyProfile(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateMe(user, organizationId, dto);
  }

  @Patch('me/online')
  touchOnline(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
  ) {
    return this.usersService.touchOnline(user, organizationId);
  }

  @Get('members')
  listMembers(
    @Param('organizationId') organizationId: string,
    @Query() query: ListMembersQueryDto,
  ) {
    return this.usersService.listMembers(organizationId, query);
  }

  @Get('members/:memberId')
  getMemberById(
    @Param('organizationId') organizationId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.usersService.getMemberById(organizationId, memberId);
  }
}
