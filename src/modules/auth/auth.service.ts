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
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { VerifyEmailCodeDto } from './dto/verify-email-code.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifySignupEmailDto } from './dto/verify-signup-email.dto';

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
        emailVerified: true,
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

    if (!user.emailVerified) {
      await this.sendVerificationEmail(user);
      return {
        success: true,
        requireEmailVerification: true,
        email: user.email,
        message: 'Confirme o email para continuar',
      };
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
          emailVerified: true,
        },
      });
    } else if (!user.emailVerified) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
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
        emailVerified: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException('Email não verificado');
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

  async registerWithEmail(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('Email já existe');
    }

    const passwordHash = await hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        displayName: dto.displayName,
        passwordHash,
        gender: dto.gender,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        avatarUrl: dto.avatarUrl,
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        gender: true,
        birthDate: true,
        avatarUrl: true,
        emailVerified: true,
      },
    });

    await this.sendVerificationEmail(user);

    return {
      success: true,
      requireEmailVerification: true,
      email: user.email,
      message: 'Confirme o email para activar a conta',
    };
  }

  async verifySignupEmail(dto: VerifySignupEmailDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Código inválido ou expirado');
    }

    if (user.emailVerified) {
      return { success: true, message: 'Email já confirmado' };
    }

    const verification = await this.prisma.emailVerificationCode.findFirst({
      where: {
        userId: user.id,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!verification) {
      throw new UnauthorizedException('Código inválido ou expirado');
    }

    const isValid = await compare(dto.code, verification.codeHash);
    if (!isValid) {
      throw new UnauthorizedException('Código inválido ou expirado');
    }

    await this.prisma.$transaction([
      this.prisma.emailVerificationCode.update({
        where: { id: verification.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      }),
    ]);

    return { success: true, message: 'Email confirmado com sucesso' };
  }

  private generateEmailCode() {
    return randomInt(0, 1_000_000).toString().padStart(6, '0');
  }

  private async sendLoginEmailCode(user: UserPayload) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not defined');
    }

    const lastCode = await this.prisma.emailLoginCode.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (lastCode) {
      const elapsedMs = Date.now() - lastCode.createdAt.getTime();
      const cooldownMs = 5 * 60 * 1000;
      if (elapsedMs < cooldownMs) {
        const waitSeconds = Math.ceil((cooldownMs - elapsedMs) / 1000);
        throw new BadRequestException({
          message: `Aguarde ${waitSeconds}s para reenviar o codigo`,
          waitSeconds,
          statusCode: 400,
          error: 'Bad Request',
        });
      }
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

  private async sendVerificationEmail(user: UserPayload) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not defined');
    }

    const lastCode = await this.prisma.emailVerificationCode.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (lastCode) {
      const elapsedMs = Date.now() - lastCode.createdAt.getTime();
      const cooldownMs = 5 * 60 * 1000;
      if (elapsedMs < cooldownMs) {
        const waitSeconds = Math.ceil((cooldownMs - elapsedMs) / 1000);
        throw new BadRequestException({
          message: `Aguarde ${waitSeconds}s para reenviar o código`,
          waitSeconds,
          statusCode: 400,
          error: 'Bad Request',
        });
      }
    }

    const code = this.generateEmailCode();
    const codeHash = await hash(code, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.prisma.emailVerificationCode.deleteMany({
      where: { userId: user.id },
    });

    await this.prisma.emailVerificationCode.create({
      data: {
        userId: user.id,
        codeHash,
        expiresAt,
      },
    });

    await this.resend.emails.send({
      from: this.resendFrom,
      to: user.email,
      subject: 'Confirme o seu email',
      html: this.buildVerificationEmailHtml(user.displayName, code),
    });
  }

  private buildVerificationEmailHtml(displayName: string, code: string) {
    const safeName = displayName?.trim() || 'ola';

    return `
      <div style="background:#f5f6f8;padding:24px 12px;">
        <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;padding:24px 24px 20px;box-shadow:0 6px 18px rgba(20,20,20,0.06);font-family:Arial, sans-serif;">
          <div style="margin-bottom:16px;">
            <div style="font-size:14px;color:#6b7280;">Claris</div>
            <div style="font-size:20px;font-weight:700;color:#111827;margin-top:6px;">Confirmar email</div>
          </div>
          <div style="font-size:14px;color:#374151;margin-bottom:16px;">Ola ${safeName}, confirme o seu email usando o codigo abaixo.</div>
          <div style="background:#f9fafb;border:1px dashed #d1d5db;border-radius:10px;padding:14px;text-align:center;margin-bottom:16px;">
            <div style="font-size:24px;letter-spacing:6px;font-weight:700;color:#111827;">${code}</div>
          </div>
          <div style="font-size:12px;color:#6b7280;">Este codigo expira em 5 minutos. Se nao foi voce, ignore este email.</div>
        </div>
      </div>
    `;
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
