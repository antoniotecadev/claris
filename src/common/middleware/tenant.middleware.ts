// src/common/middleware/tenant.middleware.ts

// Middleware: é uma função que tem acesso ao objecto de solicitação (req), 
// resposta (res) e à próxima função de middleware no ciclo de solicitação-resposta da aplicação. 
// O TenantMiddleware é responsável por extrair o ID da organização do header da requisição e garantir que ele esteja presente para rotas específicas, como as relacionadas ao dashboard.

import {
  Injectable,
  NestMiddleware,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // O ID da organização deve vir no Header para chamadas de API
    // ou ser extraído do JWT pelo Membro B mais tarde
    const organizationId = req.headers['x-organization-id'];

    if (!organizationId && req.path.includes('/dashboard')) {
      throw new BadRequestException(
        'Organization ID is required for this route',
      );
    }

    // Injetamos o ID no objecto da request para que os controllers o usem
    req['organizationId'] = organizationId;
    next();
  }
}
