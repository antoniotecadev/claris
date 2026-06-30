import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from '../api-key.guard';
import { RateLimitGuard } from '../rate-limit.guard';
import { OrganizationsService } from './organizations.service'

@Controller('public')
export class OrganizationsController {
    constructor(private OrganizationsService: OrganizationsService) { }

    @Get('organizations')
    @UseGuards(ApiKeyGuard, RateLimitGuard)  // Primeiro autentica, depois rate limit
    @ApiOperation({
        summary: 'Listar organizações públicas',
        description: 'Retorna lista de igrejas/organizações'
    })
    @ApiSecurity('api_key')  // Mostra no Swagger que precisa de chave
    async getOrganizations() {
        return this.OrganizationsService.listAllOrganizations();
    }
}