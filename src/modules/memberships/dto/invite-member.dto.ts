import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { Role } from 'generated/prisma/enums';

export class InviteMemberDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Role inválida' })
  role?: Role = Role.MEMBER;
}