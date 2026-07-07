import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty({ message: 'Mensagem é obrigatória' })
  @MinLength(1)
  @MaxLength(2000)
  content: string;
}
