// src/common/middleware/tenant.middleware.ts

// Middleware: é uma função que tem acesso ao objecto de solicitação (req),
// resposta (res) e à próxima função de middleware no ciclo de solicitação-resposta da aplicação.
// O TenantMiddleware extrai o organizationId do JWT e deixa esse contexto disponível para o resto da request.

import { JwtService } from '@nestjs/jwt';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'src/modules/auth/interfaces/jwt-payload.interface';

@Injectable()
export class TenantMiddleware implements NestMiddleware {

  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers.authorization;

    console.log('--- MIDDLEWARE ACIONADO ---');
    console.log('Caminho da rota:', req.path);
    console.log('Método HTTP:', req.method);
    console.log('TenantMiddleware: Authorization Header:', authorizationHeader);

    if (authorizationHeader?.startsWith('Bearer ')) {
      // Extrai o token JWT do header Authorization
      const token = authorizationHeader.slice(7).trim();

      try {
        const payload = this.jwtService.verify<JwtPayload>(token);

        if (payload.organizationId) {
          (req as any).organizationId = payload.organizationId;
        }

      } catch {
        // Token inválido ou expirado: o guard da rota protegida vai tratar isso.
      }
    }

    next();
  }
}
