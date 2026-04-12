import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ListMembersQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
