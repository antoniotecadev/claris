import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // Define a rota base para este controlador, ou seja, todas as rotas aqui serão prefixadas com /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('token')
  async getToken() {
    return this.authService.getToken();
  }
}
