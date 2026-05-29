import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEventCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'Comentário é obrigatório' })
  @MinLength(1)
  @MaxLength(1000)
  content: string;
}
