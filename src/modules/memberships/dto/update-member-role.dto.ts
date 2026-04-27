import { IsEnum } from 'class-validator';
import { Role } from 'generated/prisma/enums';

export class UpdateMemberRoleDto {
  @IsEnum(Role, { message: 'Role inválida' })
  role: Role;
}