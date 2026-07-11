import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { VerifyEmailCodeDto } from './dto/verify-email-code.dto';
import { RegisterDto } from './dto/register.dto';
import { ResendLoginCodeDto } from './dto/resend-login-code.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) { }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.authService.registerWithEmail(dto);
  }

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
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const loginResponse = await this.authService.loginWithGoogle(req.user);
    const accessToken = loginResponse?.user?.token?.access_token as string | undefined;

    const redirectBase = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );

    res.setHeader('Content-Type', 'text/html');

    // Se falhar, avisa a janela principal e fecha
    if (!accessToken) {
      return res.send(`
        <!DOCTYPE html>
          <html>
            <head><title>Autenticando...</title></head>
            <body>
              <script>
                if (window.opener) {
                  window.opener.postMessage({ type: 'GOOGLE_AUTH_ERROR' }, '${redirectBase}');
                }
                window.close();
              </script>
            </body>
          </html>
      `);
    }

    // Se tiver sucesso, envia o token via postMessage para o seu frontend e fecha o popup
    return res.send(`
      <!DOCTYPE html>
        <html>
          <head><title>Autenticando...</title></head>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', token: '${accessToken}' }, '${redirectBase}');
              }
              window.close();
            </script>
           </body>
        </html>
      `);
  }

  @Post('email/verify-login')
  async verifyEmailLogin(@Body() dto: VerifyEmailCodeDto) {
    return await this.authService.verifyEmailCodeAndLogin(dto);
  }

  @Post('email/resend-login')
  async resendLoginCode(@Body() dto: ResendLoginCodeDto) {
    return await this.authService.resendLoginEmailCode(dto);
  }
}
