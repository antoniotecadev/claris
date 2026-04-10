import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

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

  // No AuthService (escrito pelo Membro B)
  async validateUser(email: string, pass: string): Promise<any> {
    // 1. O B procura o user no Prisma (usando o teu PrismaService)
    // 2. O B valida a senha com bcrypt
    // 3. O B precisa de saber em qual igreja o user está a entrar.
    // Ele busca o primeiro membership encontrado.
    // 4. ELE MONTA O OBJETO QUE TE PASSA:

    return this.login({
      sub: '', // ID do usuário (sub é um campo padrão em JWT para identificar o sujeito)
      email: '',
      organizationId: '',
      role: '',
    });
  }

  private async login(user: JwtPayload) {
    return {
      access_token: this.jwtService.sign(user),
    };
  }

  // Usar apenas para validar o token fora do controle de autenticação, como em um guard
  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded; // Retorna os dados decodificados do token, como userId, email, etc.
    } catch (error) {
      return null; // Retorna null se o token for inválido ou expirado
    }
  }
}
