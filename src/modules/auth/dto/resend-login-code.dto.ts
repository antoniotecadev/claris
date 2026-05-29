import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendLoginCodeDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;
}
