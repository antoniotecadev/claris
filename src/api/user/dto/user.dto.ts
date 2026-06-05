import { IsEmail, IsNotEmpty, IsString,  MaxLength, MinLength } from 'class-validator';

export class UserDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(2)
  @MaxLength(80)
  displayName: string;
}