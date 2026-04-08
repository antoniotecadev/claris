// src/common/middleware/tenant.middleware.ts

// Middleware: é uma função que tem acesso ao objecto de solicitação (req),
// resposta (res) e à próxima função de middleware no ciclo de solicitação-resposta da aplicação.
// O TenantMiddleware é responsável por extrair o organizationId do token JWT (injetado em req.user pelo JwtStrategy) e adicioná-lo a req.organizationId para que os controladores possam usar essa informação para filtrar dados por organização.
// Se a rota for protegida (ex: /dashboard) e o token não contiver o organizationId, ele lança uma ForbiddenException.

import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = req['user'] as { organizationId?: string } | undefined; // Injetado pelo Passport/JWT Strategy

    // Se a rota for protegida e o user não tiver o organizationId no token
    if (user && user.organizationId) {
      req['organizationId'] = user.organizationId;
    } else if (req.path.includes('/dashboard')) {
      throw new ForbiddenException(
        'Acesso negado: Nenhuma igreja selecionada.',
      );
    }

    next(); // Continua para o próximo middleware ou controlador
  }
}
