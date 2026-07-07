import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class SocketSendMessageDto {
  @IsString()
  @IsNotEmpty()
  organizationId: string;

  @IsString()
  @IsNotEmpty()
  recipientId: string;

  @IsString()
  @IsNotEmpty({ message: 'Mensagem é obrigatória' })
  @MinLength(1)
  @MaxLength(2000)
  content: string;
}
