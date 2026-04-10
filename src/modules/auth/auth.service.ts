import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // No AuthService (escrito pelo Membro B)
  async loginWithEmailAndPassword(
    loginDto: LoginDto,
  ): Promise<JwtPayload | null> {
    const { email, password } = loginDto;
    // 1. O B procura o user no Prisma (usando o teu PrismaService)
    // 2. O B valida a senha com bcrypt
    // 3. O B precisa de saber em qual igreja o user está a entrar.
    // Ele busca o primeiro membership encontrado.
    // 4. ELE MONTA O OBJETO QUE TE PASSA:

    return {
      sub: '123', // ID do usuário (sub é um campo padrão em JWT para identificar o sujeito)
      displayName: 'John Doe', // Nome do usuário para exibir no frontend
      email: 'john.doe@example.com',
      organizationId: 'org-123',
      role: 'PASTOR',
    };
  }

  // auth.service.ts

  async loginWithGoogle(googleUser: any): Promise<JwtPayload | null> {
    // Verifica se o usuário já existe no banco de dados usando o email do Google
    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    // Se o usuário não existir, cria um novo registro no banco de dados
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          displayName: googleUser.displayName,
          avatarUrl: googleUser.avatarUrl,
          googleId: googleUser.googleId,
        },
      });
    }

    // Busca a associação do usuário com uma organização (membership)
    const membership = await this.prisma.membership.findFirst({
      where: { userId: user.id },
    });

    if (!membership) {
      return null; // Retorna null se o usuário não tiver uma associação com uma organização
    }

    return {
      sub: user.id,
      displayName: user.displayName,
      email: user.email,
      organizationId: membership.organizationId,
      role: membership.role,
    };
  }

  async login(user: JwtPayload) {
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
