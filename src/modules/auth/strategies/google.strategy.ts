// src/modules/auth/strategies/google.strategy.ts

// GoogleStrategy: implementa a estratégia de autenticação usando o Passport com o provedor Google OAuth 2.0.
// Ele extrai as informações do perfil do usuário do Google e as retorna para serem usadas em req.user.
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') || '',
      scope: ['email', 'profile'],
    } as any);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, id } = profile;

    const user = {
      googleId: id,
      email: emails[0].value,
      displayName: `${name.givenName} ${name.familyName}`.trim(),
      avatarUrl: photos?.[0]?.value,
      provider: 'google',
      accessToken,
    };
    
    done(null, user); // Passa o objecto do usuário para o Passport, que o injeta em req.user
  }
}
