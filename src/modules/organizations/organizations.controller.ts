import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganizationsService } from './organizations.service';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationsService) {}

  @Post()
  createOrganization(
    @Body() dto: CreateOrganizationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.organizationService.createOrganization(dto, user);
  }

  @Get('my')
  listMyOrganizations(@CurrentUser() user: JwtPayload) {
    return this.organizationService.listMyOrganizations(user.id);
  }

  @Post('switch/:organizationId')
  switchOrganization(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
  ) {
    return this.organizationService.switchOrganization(user, organizationId);
  }

  @Get('current')
  getCurrentOrganization(@Param('organizationId') organizationId: string) {
    return this.organizationService.getCurrentOrganization(organizationId);
  }

  @Get('stats')
  getStats(@Param('organizationId') organizationId: string) {
    return this.organizationService.getStats(organizationId);
  }
}
