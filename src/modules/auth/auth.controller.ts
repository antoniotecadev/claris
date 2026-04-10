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

@Controller('auth') // Define a rota base para este controlador, ou seja, todas as rotas aqui serão prefixadas com /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: any) {
    // O método login recebe as credenciais do usuário (email e senha) no corpo da requisição, chama o AuthService para validar as credenciais e gerar um token JWT, e retorna a resposta com o token e as informações do usuário.
    const user = await this.authService.loginWithEmailAndPassword(loginDto);

    // Se as credenciais forem inválidas, retornar um erro (401 Unauthorized)
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Gerar o token JWT usando o AuthService
    const token = await this.authService.login(user);

    // Se token for inválido, retornar um erro (500 Internal Server Error)
    if (!token) {
      return res.status(500).json({ message: 'Could not generate token' });
    }

    return res.json({
      success: true,
      user: {
        ...user,
        token: {
          ...token,
          expiresIn: 24 * 60 * 60,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      },
    });
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
      const user = await this.authService.loginWithGoogle(req.user);

      // Se as credenciais forem inválidas, retornar um erro (401 Unauthorized)
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Gerar o token JWT usando o AuthService
      const token = await this.authService.login(user);

      // Redireciona para o frontend com token (ou retorna JSON se for API pura)
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?token=${token.access_token}&displayName=${encodeURIComponent(user.displayName)}&email=${encodeURIComponent(user.email)}`,
      );
    } catch (error) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=failed`);
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req: any) {
    // Token validado automaticamente pelo guard
    return req.user;
  }
}
