import { Injectable } from '@nestjs/common';

@Injectable()
export class OrganizationsService {
  getStats(req: any) {
    return {
      message: 'Dados da igreja acessados!',
      organizationId: req.organizationId,
      user: req.user,
    };
  }
}
