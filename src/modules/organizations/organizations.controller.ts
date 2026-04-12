import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganizationsService } from './organizations.service';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createOrganization(
    @Body() dto: CreateOrganizationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.organizationService.createOrganization(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('current')
  getCurrentOrganization(@Req() req: any) {
    return this.organizationService.getCurrentOrganization(req.organizationId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats(@Req() req: any) {
    return this.organizationService.getStats(req.organizationId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('switch/:organizationId')
  switchOrganization(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
  ) {
    return this.organizationService.switchOrganization(user, organizationId);
  }
}
