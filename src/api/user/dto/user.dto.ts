import {
  ApiProperty,
  ApiPropertyOptional
} from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsDateString,
  IsUrl
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'costa@email.com',
    description: 'Email do utilizador',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Password do utilizador',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  @ApiProperty({
    example: 'Ana Paula',
    description: 'Nome do utilizador',
    minLength: 2,
    maxLength: 80,
  })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres' })
  @MaxLength(80, { message: 'O nome deve ter no máximo 80 caracteres' })
  displayName: string;

  @ApiPropertyOptional({
    example: 'Feminino',
    description: 'Género do utilizador',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10, { message: 'O género deve ter no máximo 10 caracteres' })
  gender?: string;

  @ApiPropertyOptional({
    example: '1995-12-30',
    description: 'Data de nascimento no formato ISO (AAAA-MM-DD)',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento inválida (use o formato YYYY-MM-DD)' })
  birthDate?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: 'URL do avatar/foto de perfil do utilizador',
  })
  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'O avatarUrl deve ser uma URL válida' })
  avatarUrl?: string;
}