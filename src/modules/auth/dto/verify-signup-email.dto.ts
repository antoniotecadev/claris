import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifySignupEmailDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}
