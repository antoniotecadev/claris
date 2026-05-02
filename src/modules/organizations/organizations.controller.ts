import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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

  @Get('current')
  getCurrentOrganization(@Req() req: any) {
    return this.organizationService.getCurrentOrganization(req.organizationId);
  }

  @Get('my')
  listMyOrganizations(@CurrentUser() user: JwtPayload) {
    return this.organizationService.listMyOrganizations(user.id);
  }

  @Get('stats')
  getStats(@Req() req: any) {
    return this.organizationService.getStats(req.organizationId);
  }

  @Post('switch/:organizationId')
  switchOrganization(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
  ) {
    return this.organizationService.switchOrganization(user, organizationId);
  }
}
