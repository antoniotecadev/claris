import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController 
{
	constructor(private readonly authService: AuthService)
	{}

	@Post('register')
	async register(@Body() registerDto: RegisterDto)
	{
		return this.authService.registerWithEmail(registerDto);
	}

	@Post('login')
	async login(@Body() loginDto: LoginDto)
	{
		return this.authService.loginWithEmailAndPassword(loginDto);
	}

	@Get('google')
	@UseGuards(AuthGuard('google'))
	async googleLogin()
	{}

	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	async googleLoginCallback(@Req() req: any)
	{
		return await this.authService.loginWithGoogle(req.user);
	}
}
