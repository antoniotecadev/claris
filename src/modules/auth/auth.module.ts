import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    PassportModule, // Importa o módulo Passport para usar estratégias de autenticação
    // Configura o módulo JWT com a chave secreta e opções de expiração
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importa o ConfigModule para acessar as variáveis de ambiente
      inject: [ConfigService], // Injeta o ConfigService para acessar as variáveis de ambiente
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }, // Define a expiração do token para 1 dia
      }),
    }),
    PrismaModule, // Importa o módulo Prisma para acessar o banco de dados
  ],
  controllers: [AuthController], // Controlador que lida com as rotas de autenticação (login, registro, etc.)
  providers: [JwtStrategy, GoogleStrategy, AuthService], // Registra a estratégia JWT para autenticação
  exports: [JwtModule], // Exportas para que outros módulos usem o JWT
})
export class AuthModule {}
