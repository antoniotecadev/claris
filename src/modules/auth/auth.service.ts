import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto'
import { JwtPayload } from './interfaces/jwt-payload.interface'
import { UserPayload } from './interfaces/user-payload.interface';
import { compare, hash } from 'bcrypt'
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';
import { randomInt } from 'node:crypto';


@Injectable()
export class AuthService {
	private readonly resend = new Resend(process.env.RESEND_API_KEY ?? '');
	private readonly resendFrom = process.env.RESEND_FROM ?? 'claris@resend.dev'
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private configService: ConfigService,
	){}

	async registerWithEmail(registerDto: RegisterDto) : Promise<any | null>
	{
		const exist = await this.prisma.user.findUnique({
			where: { email: registerDto.email },
			select: {id : true},
		});

		if (exist)
			throw new ConflictException('Este email já existe');
		
		const passwordHash = await hash(registerDto.password!, 10);

		const user = await this.prisma.user.create({
			data: {
				email: registerDto.email!,
				displayName: registerDto.displayName!,
				passwordHash,
				gender: registerDto.gender,
				birthDate: registerDto.BirthDate,
				avatarUrl: registerDto.avatarUrl,
			},
			select: {
				id: true,
				email: true,
				displayName: true,
				gender: true,
				birthDate: true,
				avatarUrl: true,
			},
		});

		return this.generateFinalLoginResponse(user);
	}

	private async generateFinalLoginResponse(user: UserPayload)
	{
		const loginPayload: JwtPayload = {
			id: user.id,
			email: user.email!,
		};

		const token = await this.sign(loginPayload);
		
		return {
			sucess: true,
			user: {
				...{
					id: user.id,
					email: user.email,
					diplayName: user.displayName,
					avatarUrl: user.avatarUrl,
					gender: user.gender,
					birthDate: user.birthDate,
				},
				token: {
					...token,
					expiresIn: 24 * 60 * 60,
					expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
				},
			},
		};
	}

	private async sign(user: JwtPayload)
	{
		const token = this.jwtService.sign(user);
		return{
			access_token: token,
		};
	}

	async loginWithEmailAndPassword(loginDto: LoginDto) : Promise<any | null>
	{
		const { email, password } = loginDto;

		const user = await this.prisma.user.findUnique({
			where: {email},
			select: {
				id: true,
				email: true,
				displayName: true,
				passwordHash: true,
			},
		});
		
		if (!user || !user.passwordHash)
			throw new UnauthorizedException('Credenciais inválidas');
		
		const isvalidPW = await compare(password!, user.passwordHash);

		if (!isvalidPW)
			throw new UnauthorizedException('Credenciais inválidas');

		return{
			success: true,
			email: user.email,
		};
	}

	private generateEmailCode(){
		return randomInt(0, 1_000_000).toString().padStart(6, '0');
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

	private async sendLoginEmailCode(user: UserPayload)
	{
		const RESEND_API_KEY = this.configService.get<string>('RESEND_API_KEY')

		if (!RESEND_API_KEY)
			throw new Error('RESEND_API_KEY is not defined');
		
		const lastcode = await this.prisma.emailLoginCode.findFirst({
			where: {userId: user.id},
			orderBy: {createdAt: 'desc'}
		});

		if (lastcode){
			const elapsedMs = Date.now() - lastcode.createdAt.getTime();
			const cooldownMs = 5 * 60 * 1000;

			if (elapsedMs < cooldownMs){
				const waitSeconds = Math.ceil((cooldownMs - elapsedMs) / 1000);
				throw new BadRequestException({
					message: `Aguarde ${waitSeconds}s par reenviar o código`,
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
			where: {userId: user.id},
		});
		
		await this.prisma.emailLoginCode.create({
			data: {
				userId: user.id!,
				codeHash,
				expiresAt,
			},
		});

		await this.resend.emails.send({
			from: this.resendFrom,
			to: user.email!,
			subject: 'Access code',
			html: this.buildLoginEmailHtml(user.displayName!, code),
		});
	}

	async loginWithGoogle(googleUser: any): Promise<any | null>
	{
		let user = await this.prisma.user.findUnique({
			where: { email: googleUser.email },
		});

		if (!user)
		{
			user = await this.prisma.user.create({
				data: {
					email: googleUser.email,
					displayName: googleUser.displayName,
					avatarUrl: googleUser.avatarUrl,
					googleId: googleUser.googleId,
				},
			});
		}
		return await this.generateFinalLoginResponse(user)
	}
}