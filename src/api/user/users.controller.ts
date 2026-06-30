import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/user.dto';
import { ApiKeyGuard } from '../api-key.guard';
import { RateLimitGuard } from '../rate-limit.guard';
import { ApiOperation, ApiSecurity } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('public')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('user/')
  @UseGuards(ApiKeyGuard, RateLimitGuard)
  @ApiOperation({
    summary: 'Registar um novo utilizador',
    description: 'Cria uma nova conta de utilizador utilizando o e-mail e os dados fornecidos.'
  })
  @ApiSecurity('api_key') // Mostra no Swagger que precisa de chave
  async register(@Body() dto: CreateUserDto) {
    return await this.usersService.registerWithEmail(dto);
  }

  @Get('user/me/:userId')
  @UseGuards(ApiKeyGuard, RateLimitGuard)
  @ApiOperation({
    summary: 'Obter perfil do utilizador',
    description: 'Retorna os dados do perfil do utilizador identificado pelo ID informado.'
  })
  @ApiSecurity('api_key')
  getMyProfile(@Param('userId') userId: string) {
    return this.usersService.getMe(userId);
  }

  @Patch('user/me/:userId')
  @UseGuards(ApiKeyGuard, RateLimitGuard)
  @ApiOperation({
    summary: 'Atualizar perfil do utilizador',
    description: 'Atualiza as informações do perfil do utilizador identificado pelo ID informado.'
  })
  @ApiSecurity('api_key')
  updateMyProfile(
    @Param('userId') userId: string,
    @Body() dto: CreateUserDto,
  ) {
    return this.usersService.updateMe(dto, userId);
  }

  @Delete('user/me/:userId')
  @UseGuards(ApiKeyGuard, RateLimitGuard)
  @ApiOperation({
    summary: 'Eliminar conta do utilizador',
    description: 'Remove permanentemente a conta do utilizador identificado pelo ID informado.'
  })
  @ApiSecurity('api_key')
  deleteMyAccount(@Param('userId') userId: string) {
    return this.usersService.deleteMyAccount(userId);
  }
}