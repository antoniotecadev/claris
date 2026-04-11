// src/modules/auth/dto/2fa.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class Enable2FADto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class Verify2FADto {
  @IsString()
  @IsNotEmpty()
  code: string;
}