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
		const code = this.
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