import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import type { Server, Socket } from 'socket.io';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { ChatService } from './chat.service';
import { JoinChatDto } from './dto/join-chat.dto';
import { SocketSendMessageDto } from './dto/socket-send-message.dto';

type ChatSocket = Socket & {
  data: {
    user?: JwtPayload;
    organizationIds?: Set<string>;
  };
};

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
  ) {}

  async handleConnection(client: ChatSocket) {
    try {
      const token = this.extractToken(client);

      if (!token) {
        throw new WsException('Token não informado');
      }

      const payload = this.jwtService.verify<JwtPayload>(token);

      client.data.user = {
        id: payload.id,
        email: payload.email,
        organizationId: payload.organizationId,
        role: payload.role,
      };
      client.data.organizationIds = new Set<string>();
      await this.chatService.touchLastSeen(payload.id);

      client.emit('chat:connected', {
        success: true,
        userId: payload.id,
      });
    } catch {
      client.emit('chat:error', {
        message: 'Não foi possível autenticar o socket',
      });
      client.disconnect(true);
    }
  }

  async handleDisconnect(client: ChatSocket) {
    const user = client.data.user;

    if (!user) {
      return;
    }

    await this.chatService.touchLastSeen(user.id);

    for (const organizationId of client.data.organizationIds ?? []) {
      client
        .to(this.organizationRoom(organizationId))
        .emit('presence:offline', {
          userId: user.id,
          organizationId,
          lastSeen: new Date(),
        });
    }
  }

  @SubscribeMessage('chat:join')
  async joinChat(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() payload: JoinChatDto,
  ) {
    const user = this.requireSocketUser(client);

    await this.chatService.assertOrganizationMember(
      user.id,
      payload.organizationId,
    );

    client.join(this.organizationRoom(payload.organizationId));
    client.join(this.userRoom(payload.organizationId, user.id));
    client.data.organizationIds?.add(payload.organizationId);

    client
      .to(this.organizationRoom(payload.organizationId))
      .emit('presence:online', {
        userId: user.id,
        organizationId: payload.organizationId,
      });

    return {
      success: true,
      organizationId: payload.organizationId,
    };
  }

  @SubscribeMessage('message:send')
  async sendMessage(
    @ConnectedSocket() client: ChatSocket,
    @MessageBody() payload: SocketSendMessageDto,
  ) {
    const user = this.requireSocketUser(client);
    const result = await this.chatService.sendMessage(
      user,
      payload.organizationId,
      payload.recipientId,
      { content: payload.content },
    );

    this.emitMessage(result.message);

    return result;
  }

  emitMessage(message: {
    organizationId: string;
    senderId: string;
    recipientId: string | null;
  }) {
    if (!message.recipientId) {
      return;
    }

    this.server
      .to(this.userRoom(message.organizationId, message.senderId))
      .to(this.userRoom(message.organizationId, message.recipientId))
      .emit('message:new', message);
  }

  private extractToken(client: Socket) {
    const authToken = client.handshake.auth?.token;

    if (typeof authToken === 'string') {
      return authToken.replace(/^Bearer\s+/i, '');
    }

    const authorization = client.handshake.headers.authorization;

    if (authorization?.startsWith('Bearer ')) {
      return authorization.slice(7).trim();
    }

    return undefined;
  }

  private requireSocketUser(client: ChatSocket) {
    if (!client.data.user) {
      throw new WsException('Socket não autenticado');
    }

    return client.data.user;
  }

  private organizationRoom(organizationId: string) {
    return `organization:${organizationId}`;
  }

  private userRoom(organizationId: string, userId: string) {
    return `organization:${organizationId}:user:${userId}`;
  }
}
