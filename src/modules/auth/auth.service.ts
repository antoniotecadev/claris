// src/modules/auth/auth.service.ts

import * as qrcode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
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

    // 1. procura o user no Prisma (usando o teu PrismaService)
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

    // 2. Se o user não existir ou não tiver senha (ex: login só com Google), retorna erro de credenciais inválidas
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    // 3. valida a senha com bcrypt
    const isPasswordValid = await compare(password, user.passwordHash!);

    // 4. Se a senha for inválida, retorna erro de credenciais inválidas
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // 5. Se o usuário tem 2FA activado
    if (user?.twofa_enabled) {
      const tempToken = await this.getTempToken(user.id); // Gerar um token temporário para 2FA
      return {
        success: true,
        require2FA: true,
        tempToken,
        message: 'Código de verificação de dois factores necessário',
      };
    }

    // 6. Se a senha for válida e 2FA não estiver activado, devolve as igrejas para seleção no frontend.
    return this.buildOrganizationSelectionResponse({
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
    });
  }

  // Método auxiliar - Gera a resposta final de login
  private async generateFinalLoginResponse(user: JwtPayload) {
    const token = await this.sign(user);

    return {
      success: true,
      user: {
        ...user,
        token: {
          ...token,
          expiresIn: 24 * 60 * 60,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      },
    };
  }

  async loginWithGoogle(googleUser: any): Promise<any | null> {
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

    // Login Google segue o mesmo fluxo do login por senha:
    // primeiro seleciona a organização, depois emite o JWT final.
    return this.buildOrganizationSelectionResponse({
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
    });
  }

  async generate2FASecret(userId: string, email: string) {
    // 1. Gera um segredo 2FA usando speakeasy
    const secret = speakeasy.generateSecret({
      name: `ChurchSaas (${email})`, // vai aparecer no app autenticador
      length: 20, // comprimento do segredo ex: 20 caracteres, o padrão é 32, mas 20 é suficiente para segurança e mais fácil de armazenar
    });

    // 2. Guarda o segredo no banco de dados (Prisma) associado ao usuário
    // base32 é o formato mais comum para armazenar o segredo
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

    return this.buildOrganizationSelectionResponse({
      userId: user.id,
      email: user.email,
      displayName: user.displayName,
    });
  }

  async selectOrganizationAndLogin(
    selectionToken: string,
    organizationId: string,
  ) {

    // 1. Verifica o token de seleção para garantir que é válido e extrair o userId
    const payload = this.jwtService.verify(selectionToken);

    // 2. Verifica se o token é do tipo correto (organization_selection_pending)
    if (payload.type !== 'organization_selection_pending') {
      throw new UnauthorizedException('Token de seleção inválido');
    }

    // 3. Busca o usuário no banco de dados usando o userId do payload
    const membership = await this.prisma.membership.findFirst({
      where: {
        userId: payload.userId,
        organizationId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
      },
    });

    // 4. Se não encontrar uma associação válida entre o usuário e a organização, retorna erro de acesso negado
    if (!membership) {
      throw new UnauthorizedException(
        'Usuário não pertence a esta organização',
      );
    }

    // 5. Se a associação for válida, gera um token JWT final com o organizationId e retorna os dados do usuário e da organização para o frontend.
    return this.generateFinalLoginResponse({
      userId: membership.user.id,
      displayName: membership.user.displayName,
      email: membership.user.email,
      organizationId: membership.organizationId,
      role: membership.role,
    });
  }

  async getOrganizationOptions(selectionToken: string) {

    // 1. Verifica o token de seleção para garantir que é válido e extrair o userId
    const payload = this.jwtService.verify(selectionToken);

    // 2. Verifica se o token é do tipo correto (organization_selection_pending)
    if (payload.type !== 'organization_selection_pending') {
      throw new UnauthorizedException('Token de seleção inválido');
    }

    // 3. Busca o usuário no banco de dados usando o userId do payload
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        displayName: true,
      },
    });

    // 4. Se o usuário não existir, retorna erro de usuário não encontrado
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // 5. Retorna as opções de organizações associadas ao usuário para o frontend exibir na tela de seleção de organização.
    return this.buildOrganizationSelectionResponse({
      userId: user.id,
      displayName: user.displayName,
      email: user.email,
    });
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
    // Gera um token JWT temporário para 2FA, com um tipo (2fa_pending) específico e curta duração
    const tempToken = this.jwtService.sign(
      { userId, type: '2fa_pending' },
      { expiresIn: '10m' }, // Token temporário dura 10 minutos
    );
    return tempToken;
  }

  private async getOrganizationSelectionToken(userId: string) {

    // Gera um token JWT para a seleção de organização, com um tipo específico (organization_selection_pending) e curta duração
    return this.jwtService.sign(
      {
        userId,
        type: 'organization_selection_pending',
      },
      { expiresIn: '30m' },
    );
  }

  private async buildOrganizationSelectionResponse(user: {
    userId: string;
    email: string;
    displayName: string;
  }) {

    // 1. Busca as organizações associadas ao usuário para que o frontend possa exibir as opções de seleção de organização
    const memberships = await this.prisma.membership.findMany({
      where: { userId: user.userId },
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

    // 2. Se o usuário não estiver associado a nenhuma organização, retorna um erro indicando que o usuário precisa ser associado a pelo menos uma organização para fazer login
    if (!memberships.length) {
      throw new BadRequestException(
        'Usuário não está associado a nenhuma organização',
      );
    }

    // 3. Se o usuário tiver associações com organizações, gera um token de seleção de organização e retorna os dados do usuário e as opções de organizações para o frontend exibir na tela de seleção de organização.
    const selectionToken = await this.getOrganizationSelectionToken(user.userId);

    // 4. O frontend vai usar esse token para fazer a chamada de seleção de organização depois que o usuário escolher a organização na tela de seleção. O token de seleção é necessário para garantir que apenas usuários autenticados possam acessar a rota de seleção de organização e para identificar qual usuário está fazendo a seleção. O token de seleção tem um tipo específico (organization_selection_pending) para que o backend possa validar que é um token válido para essa etapa do processo de login.
    return {
      success: true,
      requireOrganizationSelection: true, // indica ao frontend que é necessário mostrar a tela de seleção de organização ex: frontend pode usar isso para decidir se redireciona para a tela de seleção de organização ou para a tela principal da aplicação
      selectionToken,
      user,
      organizations: memberships.map((membership) => ({
        organizationId: membership.organization.id,
        name: membership.organization.name,
        slug: membership.organization.slug,
        logoUrl: membership.organization.logoUrl,
        role: membership.role, // opcional: pode ser útil para o frontend saber o papel do usuário em cada organização para exibir opções diferentes ou destacar a organização atual, etc.
      })),
    };
  }

  // Usar apenas para validar o token fora do controle de autenticação, como em um guard
  private async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return decoded; // Retorna os dados decodificados do token, como userId, email, etc.
    } catch (error) {
      return null; // Retorna null se o token for inválido ou expirado
    }
  }
}
