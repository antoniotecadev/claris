import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from './api-key.guard';
import { RateLimitGuard } from './rate-limit.guard';
import { UsersService } from './users.service';

@Controller('public')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('organizations')
    @UseGuards(ApiKeyGuard, RateLimitGuard)  // Primeiro autentica, depois rate limit
    @ApiOperation({ 
        summary: 'Listar organizações públicas',
        description: 'Retorna lista de igrejas/organizações'
    })
    @ApiSecurity('api_key')  // Mostra no Swagger que precisa de chave
    async getOrganizations() {
        return this.usersService.findAllOrganizations();
    }
}