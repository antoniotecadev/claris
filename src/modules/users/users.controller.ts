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
  getMyProfile(@CurrentUser() user: JwtPayload, @Req() req: any) {
    return this.usersService.getMe(user, req.organizationId);
  }

  @Patch('me')
  updateMyProfile(
    @CurrentUser() user: JwtPayload,
    @Req() req: any,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateMe(user, req.organizationId, dto);
  }

  @Patch('me/online')
  touchOnline(@CurrentUser() user: JwtPayload, @Req() req: any) {
    return this.usersService.touchOnline(user, req.organizationId);
  }

  @Get('members')
  listMembers(@Req() req: any, @Query() query: ListMembersQueryDto) {
    return this.usersService.listMembers(req.organizationId, query);
  }

  @Get('members/:memberId')
  getMemberById(@Req() req: any, @Param('memberId') memberId: string) {
    return this.usersService.getMemberById(req.organizationId, memberId);
  }
}
