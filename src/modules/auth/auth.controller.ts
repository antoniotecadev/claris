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
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Enable2FADto } from './dto/2fa.dto';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';

@Controller('auth') // Define a rota base para este controlador, ou seja, todas as rotas aqui serão prefixadas com /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    // O método login recebe as credenciais do usuário (email e senha) no corpo da requisição.
    return await this.authService.loginWithEmailAndPassword(loginDto);
  }

  // Inicia o login com Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Este método não precisa de corpo, o Passport redireciona automaticamente para a página de login do Google
  }

  // Callback do Google
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any) {
    // O Passport coloca as informações do usuário autenticado no req.user
    return await this.authService.loginWithGoogle(req.user);
  }

  // Gerar QR Code para activar 2FA
  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  async enable2FA(@CurrentUser() user: JwtPayload) {
    return await this.authService.generate2FASecret(user.id, user.email);
  }

  // Confirmar e activar o 2FA
  @Post('2fa/confirm')
  @UseGuards(JwtAuthGuard)
  async confirm2FA(@CurrentUser() user: JwtPayload, @Body() dto: Enable2FADto) {
    return await this.authService.enable2FA(user.id, dto.code);
  }

  // Desactivar 2FA
  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard)
  async disable2FA(
    @CurrentUser() user: JwtPayload,
    @Body() dto: { code: string },
  ) {
    return await this.authService.disable2FA(user.id, dto.code);
  }

  // Verificar código 2FA durante o login
  @Post('2fa/verify')
  async verify2FALogin(@Body() body: { tempToken: string; code: string }) {
    return await this.authService.verify2FACodeAndLogin(body.tempToken, body.code);
  }
}
