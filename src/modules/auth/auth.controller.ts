import { Controller, Get, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth') // Define a rota base para este controlador, ou seja, todas as rotas aqui serão prefixadas com /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('token')
  async getToken() {
    return this.authService.getToken();
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: any) {
    // Validar credenciais do usuário usando o AuthService
    const user = await this.authService.validateUser(loginDto);

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

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req: any) {
    // Token validado automaticamente pelo guard
    return req.user;
  }
}
