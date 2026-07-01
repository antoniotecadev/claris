// JwtAuthGuard: é um guardião de autenticação que utiliza a estratégia JWT definida no JwtStrategy. 
// Ele protege as rotas, garantindo que apenas usuários autenticados com um token JWT válido possam acessá-las.
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}