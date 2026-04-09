import { Controller, Get } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Controller('auth') // Define a rota base para este controlador, ou seja, todas as rotas aqui serão prefixadas com /auth
export class AuthController {
  constructor(private jwtService: JwtService) {}

  @Get('mock-login')
  async mockLogin() {
    // Pega o ID da org que foi criada no seed!
    const payload = {
      sub: 'cmnrm4bdf0002nryvm273qi39', // ID do usuário (sub é um campo padrão em JWT para identificar o sujeito)
      email: 'admin@teste.com',
      organizationId: 'cmnrm4bck0000nryv30yiqrn2',
      role: 'PASTOR',
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
