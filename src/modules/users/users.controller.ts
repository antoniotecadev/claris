import { Controller } from '@nestjs/common';
import { Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UsersController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req: any) {
    // Token validado automaticamente pelo guard
    return req.user;
  }
}
