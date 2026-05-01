// src/modules/auth/auth.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { VerifyEmailCodeDto } from './dto/verify-email-code.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.loginWithEmailAndPassword(loginDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Este método não precisa de corpo, o Passport redireciona automaticamente para a página de login do Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any) {
    return await this.authService.loginWithGoogle(req.user);
  }

  @Post('email/verify')
  async verifyEmailLogin(@Body() dto: VerifyEmailCodeDto) {
    return await this.authService.verifyEmailCodeAndLogin(dto);
  }
}
