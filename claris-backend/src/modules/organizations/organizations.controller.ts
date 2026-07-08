import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrganizationsService } from './organizations.service';
import { CurrentUser } from '@/common/decorator/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CreateOrganizationDto } from './dto/create-organization.dto';

import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationService: OrganizationsService) {}

  @Get()
  listAllOrganizations() {
    return this.organizationService.listAllOrganizations();
  }

  @Post()
  @UseInterceptors(FileInterceptor('logoUrl'))
  createOrganization(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateOrganizationDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.organizationService.createOrganization(dto, file, user);
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
