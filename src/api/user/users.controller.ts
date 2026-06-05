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
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { ApiKeyGuard } from '../api-key.guard';
import { RateLimitGuard } from '../rate-limit.guard';
import { ApiSecurity } from '@nestjs/swagger';

@Controller('public/user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  @UseGuards(ApiKeyGuard, RateLimitGuard)
  @ApiSecurity('api_key')
  async register(@Body() dto: UserDto) {
    return await this.usersService.registerWithEmail(dto);
  }

  @Get('me/:userId')
  @UseGuards(ApiKeyGuard, RateLimitGuard)
  @ApiSecurity('api_key')
  getMyProfile(@Param('userId') userId: string) {
    return this.usersService.getMe(userId);
  }

  @Patch('me/:userId')
  @UseGuards(ApiKeyGuard, RateLimitGuard)
  @ApiSecurity('api_key')
  updateMyProfile(
    @Param('userId') userId: string,
    @Body() dto: UserDto,
  ) {
    return this.usersService.updateMe(dto, userId);
  }

  @Delete('me/:userId')
  @UseGuards(ApiKeyGuard, RateLimitGuard)
  @ApiSecurity('api_key')
  deleteMyAccount(@Param('userId') userId: string) {
    return this.usersService.deleteMyAccount(userId);
  }
}
