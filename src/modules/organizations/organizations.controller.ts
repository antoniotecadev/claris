import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationsService) {}

  @UseGuards(JwtAuthGuard) // Isso faz o Passport ler o Token
  @Get('stats')
  getStats(@Req() req: any) {
    return this.organizationService.getStats(req);
  }
}
