// src/modules/auth/dto/selection-token.dto.ts

import { IsNotEmpty, IsString } from 'class-validator';

export class SelectionTokenDto {
  @IsString()
  @IsNotEmpty()
  selectionToken: string;
}
