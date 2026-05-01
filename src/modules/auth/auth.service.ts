import { randomInt } from 'crypto';
import { Resend } from 'resend';
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
import { compare, hash } from 'bcrypt';
import { VerifyEmailCodeDto } from './dto/verify-email-code.dto';

@Injectable()
export class AuthService {
  private readonly resend = new Resend(process.env.RESEND_API_KEY ?? '');

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async loginWithEmailAndPassword(loginDto: LoginDto): Promise<any | null> {
    const { email, password } = loginDto;

    console.log(
      'AuthService initialized with Resend API Key:',
      process.env.RESEND_API_KEY,
    );

    console.log('AuthService initialized with Resend FROM:', process.env.RESEND_FROM);

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        displayName: true,
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

    await this.sendLoginEmailCode(user);

    return {
      success: true,
      requireEmailCode: true,
      email: user.email,
      message: 'Codigo de verificacao enviado por email',
    };
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

  private async sign(user: JwtPayload) {
    const token = this.jwtService.sign(user);
    return {
      access_token: token,
    };
  }

  async verifyEmailCodeAndLogin(dto: VerifyEmailCodeDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        displayName: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const emailCode = await this.prisma.emailLoginCode.findFirst({
      where: {
        userId: user.id,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!emailCode) {
      throw new UnauthorizedException('Código inválido ou expirado');
    }

    const isValid = await compare(dto.code, emailCode.codeHash);
    if (!isValid) {
      throw new UnauthorizedException('Código inválido ou expirado');
    }

    await this.prisma.emailLoginCode.update({
      where: { id: emailCode.id },
      data: { usedAt: new Date() },
    });

    return await this.buildLoginResponse(user);
  }

  private generateEmailCode() {
    return randomInt(0, 1_000_000).toString().padStart(6, '0');
  }

  private async sendLoginEmailCode(user: UserPayload) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not defined');
    }

    const code = this.generateEmailCode();
    const codeHash = await hash(code, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.emailLoginCode.deleteMany({
      where: { userId: user.id },
    });

    await this.prisma.emailLoginCode.create({
      data: {
        userId: user.id,
        codeHash,
        expiresAt,
      },
    });

    await this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'antoniojosebuaioteca@gmail.com',
      subject: 'Seu codigo de acesso',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <p>Seu codigo de acesso e:</p>
          <h2 style="letter-spacing: 2px;">${code}</h2>
          <p>Este codigo expira em 5 minutos.</p>
        </div>
      `,
    });
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
