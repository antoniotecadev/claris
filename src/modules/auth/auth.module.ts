import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { GoogleStrategy } from './google.strategy';

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
				signOptions: { expiresIn: '1d' }, 
			}),
		}),
		PrismaModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtModule, ConfigService, GoogleStrategy],
	exports: [JwtModule]
})
export class AuthModule {}