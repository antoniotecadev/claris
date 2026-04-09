import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async getToken() {
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
