// src/modules/auth/strategies/jwt.strategy.ts

// JwtStrategy: implementa a estratégia de autenticação JWT usando Passport.
// Ele extrai o token do header da requisição, verifica sua validade e retorna as informações do usuário (ID, email, organização e papel) para serem usadas em req.user.
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrai o token do header Authorization como Bearer token
      ignoreExpiration: false, // Não ignora a expiração do token
      secretOrKey: jwtSecret, // Chave secreta para verificar a assinatura do token
    });
  }

  // O método validate é chamado automaticamente pelo Passport após verificar o token. 
  // Ele recebe o payload do token e deve retornar as informações do usuário que serão injetadas em req.user.
  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      email: payload.email,
      organizationId: payload.organizationId,
      role: payload.role,
    };
  }
}
