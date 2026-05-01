import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserPayload } from './interfaces/user-payload.interface';
import { MembershipStatus } from 'generated/prisma/enums';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async loginWithEmailAndPassword(loginDto: LoginDto): Promise<any | null> {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        displayName: true,
        twofa_enabled: true,
        passwordHash: true,
      },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await compare(password, user.passwordHash!);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (user?.twofa_enabled) {
      const tempToken = await this.getTempToken(user.id); // Gerar um token temporário para 2FA
      return {
        success: true,
        require2FA: true,
        tempToken,
        message: 'Código de verificação de dois factores necessário',
      };
    }

    return await this.buildLoginResponse(user);
  }

  async loginWithGoogle(googleUser: any): Promise<any | null> {
    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

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

    return await this.buildLoginResponse(user);
  }

  async generate2FASecret(userId: string, email: string) {
    const secret = speakeasy.generateSecret({
      name: `ChurchSaas (${email})`, // vai aparecer no app autenticador
      length: 20, // comprimento do segredo ex: 20 caracteres, o padrão é 32, mas 20 é suficiente para segurança e mais fácil de armazenar
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { twofa_secret: secret.base32 },
    });

    // 3. Gera QR Code com a URL otpauth (que é usada pelos apps autenticadores como Google Authenticator ou Authy)
    // otpauth_url é a URL que os apps autenticadores usam para configurar a conta
    // ! indica que estamos certos de que otpauth_url não é undefined
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

    return {
      secret: secret.base32,
      qrCodeUrl, // URL do QR Code para o frontend exibir e o usuário escanear com o app autenticador
    };
  }

  async enable2FA(userId: string, code: string) {
    // 1. Busca o usuário no banco de dados para obter o segredo 2FA armazenado
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    // 2. Se o usuário não tiver um segredo 2FA gerado, retorna erro indicando que o segredo deve ser gerado primeiro
    if (!user?.twofa_secret) {
      throw new BadRequestException('Primeiro gere o segredo 2FA');
    }

    // 3. Verifica o código TOTP usando o segredo armazenado
    const isValid = speakeasy.totp.verify({
      secret: user.twofa_secret,
      encoding: 'base32',
      token: code, // código fornecido pelo usuário para verificação
      window: 2, // permite uma janela de tempo para compensar possíveis atrasos (2 passos de 30s = 1 minuto)
    });

    // 4. Se o código for inválido, retorna erro indicando que o código é inválido
    if (!isValid) {
      throw new BadRequestException('Código inválido');
    }

    // 5. Se o código for válido, actualiza o usuário no banco de dados para marcar o 2FA como activado
    await this.prisma.user.update({
      where: { id: userId },
      data: { twofa_enabled: true },
    });

    return { success: true, message: '2FA activado com sucesso' };
  }

  async verify2FACodeAndLogin(tempToken: string, code: string) {
    // 1. Verifica o token temporário para garantir que é válido e extrair o userId
    const payload = this.jwtService.verify(tempToken);

    // 2. Verifica se o token é do tipo correto (2fa_pending)
    if (payload.type !== '2fa_pending') {
      throw new UnauthorizedException('Token inválido');
    }

    // 3. Busca o usuário no banco de dados usando o userId do payload
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });

    // 4. Se o usuário não existir, retorna erro de usuário não encontrado
    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    // 5. Valida o código 2FA
    await this.verify2FACode(user.id, code);

    return this.buildLoginResponse(user);
  }

  private async verify2FACode(userId: string, code: string) {
    // 1. Busca o usuário no banco de dados para obter o segredo 2FA e verificar se o 2FA está activado
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    // 2. Se o usuário não tiver 2FA activado ou não tiver segredo, retorna erro indicando que o 2FA não está activado
    if (!user?.twofa_enabled || !user.twofa_secret) {
      throw new BadRequestException('2FA não está activado');
    }

    // 3. Verifica o código TOTP usando o segredo armazenado
    const isValid = speakeasy.totp.verify({
      secret: user.twofa_secret,
      encoding: 'base32',
      token: code,
      window: 2, // permite 2 códigos antes e depois (tolerância de tempo)
    });

    // 4. Se o código for inválido, retorna erro indicando que o código é inválido
    if (!isValid) {
      throw new UnauthorizedException('Código 2FA inválido');
    }

    return true;
  }

  async disable2FA(userId: string, code: string, password?: string) {
    // 1. Busca o usuário no banco de dados para obter o segredo 2FA, verificar se o 2FA está activado e obter a senha hash para validação opcional da senha
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        twofa_enabled: true,
        twofa_secret: true,
        passwordHash: true,
      },
    });

    // 2. Se o usuário não tiver 2FA activado ou não tiver segredo, retorna erro indicando que o 2FA não está activado
    if (!user?.twofa_enabled) {
      throw new BadRequestException('2FA não está activado');
    }

    // 3. Verifica o código TOTP usando o segredo armazenado
    const isCodeValid = speakeasy.totp.verify({
      secret: user.twofa_secret!,
      encoding: 'base32',
      token: code,
      window: 2,
    });

    // 4. Se o código for inválido, retorna erro indicando que o código é inválido
    if (!isCodeValid) {
      throw new UnauthorizedException('Código 2FA inválido');
    }

    // 5. Se o usuário tiver uma senha (login com email/senha), valida a senha fornecida para confirmar a identidade do usuário antes de desactivar o 2FA
    if (password) {
      const isPasswordValid = await compare(password, user.passwordHash!);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Senha incorreta');
      }
    }

    // 6. Se o código (e opcionalmente a senha) forem válidos, actualiza o usuário no banco de dados para desactivar o 2FA e remover o segredo
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twofa_enabled: false,
        twofa_secret: null,
      },
    });

    // 7. Retorna uma resposta indicando que o 2FA foi desactivado com sucesso
    return { success: true, message: '2FA desativado com sucesso' };
  }

  private async sign(user: JwtPayload) {
    const token = this.jwtService.sign(user);
    return {
      access_token: token,
    };
  }

  private async getTempToken(userId: string) {
    const tempToken = this.jwtService.sign(
      { userId, type: '2fa_pending' },
      { expiresIn: '10m' }, // Token temporário dura 10 minutos
    );
    return tempToken;
  }

  private async buildLoginResponse(user: UserPayload) {
    const memberships = await this.prisma.membership.findMany({
      where: {
        userId: user.id,
        status: { in: [MembershipStatus.NORMAL, MembershipStatus.ACCEPTED] },
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    if (!memberships.length) {
      throw new BadRequestException(
        'Usuário não está associado a nenhuma organização',
      );
    }

    const baseResponse = await this.generateFinalLoginResponse(user);

    return {
      ...baseResponse,
      organizations: memberships.map((membership) => ({
        organizationId: membership.organization.id,
        name: membership.organization.name,
        slug: membership.organization.slug,
        logoUrl: membership.organization.logoUrl,
        role: membership.role,
      })),
    };
  }

  private async generateFinalLoginResponse(user: UserPayload) {
    const loginPayload: JwtPayload = {
      id: user.id,
      email: user.email,
    };

    const token = await this.sign(loginPayload);

    return {
      success: true,
      user: {
        ...{
          id: user.id,
          email: user.email,
          displayName: user.displayName,
        },
        token: {
          ...token,
          expiresIn: 24 * 60 * 60, // 24 horas em segundos
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      },
    };
  }
}
