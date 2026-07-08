import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '@/common/decorator/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatHistoryQueryDto } from './dto/chat-history-query.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@UseGuards(JwtAuthGuard)
@Controller('organizations/:organizationId/chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Get('friends')
  listFriends(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
  ) {
    return this.chatService.listFriends(user, organizationId);
  }

  @Post('friends/:friendId')
  addFriend(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
    @Param('friendId') friendId: string,
  ) {
    return this.chatService.addFriend(user, organizationId, friendId);
  }

  @Delete('friends/:friendId')
  removeFriend(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
    @Param('friendId') friendId: string,
  ) {
    return this.chatService.removeFriend(user, organizationId, friendId);
  }

  @Get('messages/:friendId')
  getMessages(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
    @Param('friendId') friendId: string,
    @Query() query: ChatHistoryQueryDto,
  ) {
    return this.chatService.getMessages(
      user,
      organizationId,
      friendId,
      query.limit,
    );
  }

  @Post('messages/:friendId')
  async sendMessage(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
    @Param('friendId') friendId: string,
    @Body() dto: SendMessageDto,
  ) {
    const result = await this.chatService.sendMessage(
      user,
      organizationId,
      friendId,
      dto,
    );

    this.chatGateway.emitMessage(result.message);

    return result;
  }
}
