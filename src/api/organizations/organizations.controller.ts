import { ApiKeyGuard } from '../api-key.guard';
import { RateLimitGuard } from '../rate-limit.guard';
import { OrganizationsService } from './organizations.service'
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiSecurity, ApiOkResponse } from '@nestjs/swagger';
import { ListOrganizationsResponseDto } from './dto/list-organizations-response.dto';

@ApiTags('Organizations')
@Controller('public')
export class OrganizationsController {
    constructor(private organizationsService: OrganizationsService) { }

    @Get('organizations')
    @UseGuards(ApiKeyGuard, RateLimitGuard)
    @ApiOperation({
        summary: 'Listar organizações públicas',
        description: 'Retorna lista de igrejas/organizações com contagem de membros'
    })
    @ApiSecurity('api_key')
    @ApiOkResponse({
        description: 'Lista de organizações recuperada com sucesso.',
        type: ListOrganizationsResponseDto
    })
    async getOrganizations() {
        return this.organizationsService.listAllOrganizations();
    }
}