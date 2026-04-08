// src/modules/auth/auth.module.ts

// AuthModule: é o módulo principal de autenticação que agrupa o serviço de autenticação (AuthService) e o controlador de autenticação (AuthController).
// Ele é responsável por lidar com a lógica de autenticação, como login, registro e geração de tokens JWT.
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule, // Importa o módulo Passport para usar estratégias de autenticação
    JwtModule.register({
      // Configura o módulo JWT com a chave secreta e opções de expiração
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }, // 1 dia de validade
    }),
  ],
  providers: [JwtStrategy], // Registra a estratégia JWT para autenticação
  exports: [JwtModule], // Exportas para que outros módulos usem o JWT
})
export class AuthModule {}
