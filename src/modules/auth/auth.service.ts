import { randomInt } from 'crypto';
import { Resend } from 'resend';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserPayload } from './interfaces/user-payload.interface';
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
  private readonly resendFrom = process.env.RESEND_FROM ?? 'claris@resend.dev';

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
      from: this.resendFrom,
      to: user.email,
      subject: 'Seu código de acesso',
      html: this.buildLoginEmailHtml(user.displayName, code),
    });
  }

  private buildLoginEmailHtml(displayName: string, code: string) {
    const safeName = displayName?.trim() || 'olá';

    return `
      <div style="background:#f5f6f8;padding:24px 12px;">
        <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px 24px 20px;box-shadow:0 6px 18px rgba(20,20,20,0.06);font-family:Arial, sans-serif;">
          <div style="margin-bottom:16px;">
            <div style="font-size:14px;color:#6b7280;">Claris</div>
            <div style="font-size:20px;font-weight:700;color:#111827;margin-top:6px;">Código de acesso</div>
          </div>
          <div style="font-size:14px;color:#374151;margin-bottom:16px;">Olá ${safeName}, use o código abaixo para entrar na sua conta.</div>
          <div style="background:#f9fafb;border:1px dashed #d1d5db;border-radius:10px;padding:14px;text-align:center;margin-bottom:16px;">
            <div style="font-size:24px;letter-spacing:6px;font-weight:700;color:#111827;">${code}</div>
          </div>
          <div style="font-size:12px;color:#6b7280;">Este código expira em 5 minutos. Se não foi você, ignore este email.</div>
        </div>
      </div>
    `;
  }

  private async buildLoginResponse(user: UserPayload) {
    return this.generateFinalLoginResponse(user);
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
