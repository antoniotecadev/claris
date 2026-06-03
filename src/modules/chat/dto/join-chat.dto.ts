import { IsNotEmpty, IsString } from 'class-validator';

export class JoinChatDto {
  @IsString()
  @IsNotEmpty()
  organizationId: string;
}
