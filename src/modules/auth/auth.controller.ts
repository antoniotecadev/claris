import {
  Controller,
  Get,
  Post,
  Body,
  Res,
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
  async login(@Body() loginDto: LoginDto, @Res() res: any) {
    // O método login recebe as credenciais do usuário (email e senha) no corpo da requisição.
    const result = await this.authService.loginWithEmailAndPassword(loginDto);
    return res.status(200).json({ result });
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
  async googleCallback(@Req() req: any, @Res() res: any) {
    try {
      // O Passport coloca as informações do usuário autenticado no req.user
      const token = await this.authService.loginWithGoogle(req.user);

      // Redireciona para o frontend com token (ou retorna JSON se for API pura)
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?token=${token.access_token}`,
      );
    } catch (error: any) {
      console.error('Erro no callback do Google:', error);
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/login?error=failed&message=${encodeURIComponent(error.message)}`,
      );
    }
  }

  // Gerar QR Code para activar 2FA
  @Post('2fa/enable')
  @UseGuards(JwtAuthGuard)
  async enable2FA(@CurrentUser() user: JwtPayload) {
    return this.authService.generate2FASecret(user.userId, user.email);
  }

  // Confirmar e activar o 2FA
  @Post('2fa/confirm')
  @UseGuards(JwtAuthGuard)
  async confirm2FA(@CurrentUser() user: JwtPayload, @Body() dto: Enable2FADto) {
    return this.authService.enable2FA(user.userId, dto.code);
  }

  // Desactivar 2FA
  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard)
  async disable2FA(
    @CurrentUser() user: JwtPayload,
    @Body() dto: { code: string },
  ) {
    return this.authService.disable2FA(user.userId, dto.code);
  }

  // Verificar código 2FA durante o login
  @Post('2fa/verify')
  async verify2FALogin(@Body() body: { tempToken: string; code: string }) {
    return this.authService.verify2FACodeAndLogin(body.tempToken, body.code);
  }
}
