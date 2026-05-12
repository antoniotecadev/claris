import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { compare, hash } from 'bcrypt'

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
	){}

	private async generateToken(userId: string, email: string)
	{
		const payload = { sub: userId, email: email };
		return {
			access_token: this.jwtService.sign(payload),
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
}

