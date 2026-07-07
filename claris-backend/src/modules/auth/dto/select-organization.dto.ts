// src/modules/auth/dto/select-organization.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class SelectOrganizationDto {
  @IsString()
  @IsNotEmpty()
  selectionToken: string;

  @IsString()
  @IsNotEmpty()
  organizationId: string;
}
