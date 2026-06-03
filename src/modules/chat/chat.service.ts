import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async listFriends(
    currentUser: JwtPayload,
    organizationId: string | undefined,
  ) {
    await this.assertOrganizationMember(currentUser.id, organizationId);

    const friendships = await this.prisma.friendship.findMany({
      where: {
        organizationId,
        OR: [{ userAId: currentUser.id }, { userBId: currentUser.id }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        userA: { select: this.memberSelect() },
        userB: { select: this.memberSelect() },
      },
    });

    const friends = await Promise.all(
      friendships.map(async (friendship) => {
        const friend =
          friendship.userAId === currentUser.id
            ? friendship.userB
            : friendship.userA;

        const unreadCount = await this.prisma.message.count({
          where: {
            organizationId,
            senderId: friend.id,
            recipientId: currentUser.id,
            readAt: null,
          },
        });

        return {
          friendshipId: friendship.id,
          createdAt: friendship.createdAt,
          unreadCount,
          friend,
        };
      }),
    );

    return {
      success: true,
      total: friends.length,
      friends,
    };
  }

  async addFriend(
    currentUser: JwtPayload,
    organizationId: string | undefined,
    friendId: string,
  ) {
    this.assertNotSelf(currentUser.id, friendId);
    await this.assertOrganizationMember(currentUser.id, organizationId);
    await this.assertOrganizationMember(friendId, organizationId);

    const [userAId, userBId] = this.normalizeFriendshipPair(
      currentUser.id,
      friendId,
    );

    const friendship = await this.prisma.friendship.upsert({
      where: {
        organizationId_userAId_userBId: {
          organizationId: organizationId!,
          userAId,
          userBId,
        },
      },
      create: {
        organizationId: organizationId!,
        userAId,
        userBId,
        createdById: currentUser.id,
      },
      update: {},
      include: {
        userA: { select: this.memberSelect() },
        userB: { select: this.memberSelect() },
      },
    });

    const friend =
      friendship.userAId === currentUser.id
        ? friendship.userB
        : friendship.userA;

    return {
      success: true,
      friendship: {
        id: friendship.id,
        createdAt: friendship.createdAt,
        friend,
      },
    };
  }

  async removeFriend(
    currentUser: JwtPayload,
    organizationId: string | undefined,
    friendId: string,
  ) {
    this.assertNotSelf(currentUser.id, friendId);
    await this.assertOrganizationMember(currentUser.id, organizationId);

    const [userAId, userBId] = this.normalizeFriendshipPair(
      currentUser.id,
      friendId,
    );

    const deleted = await this.prisma.friendship.deleteMany({
      where: {
        organizationId,
        userAId,
        userBId,
      },
    });

    if (deleted.count === 0) {
      throw new NotFoundException('Amizade não encontrada');
    }

    return {
      success: true,
      message: 'Amigo removido com sucesso',
    };
  }

  async getMessages(
    currentUser: JwtPayload,
    organizationId: string | undefined,
    friendId: string,
    limit = 50,
  ) {
    this.assertNotSelf(currentUser.id, friendId);
    await this.assertCanChat(currentUser.id, friendId, organizationId);

    const messages = await this.prisma.message.findMany({
      where: this.directConversationWhere(
        organizationId!,
        currentUser.id,
        friendId,
      ),
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        sender: { select: this.memberSelect() },
        recipient: { select: this.memberSelect() },
      },
    });

    await this.markMessagesAsRead(currentUser.id, organizationId!, friendId);

    return {
      success: true,
      total: messages.length,
      messages: messages
        .reverse()
        .map((message) => this.formatMessage(message)),
    };
  }

  async sendMessage(
    currentUser: JwtPayload,
    organizationId: string | undefined,
    recipientId: string,
    dto: SendMessageDto,
  ) {
    this.assertNotSelf(currentUser.id, recipientId);
    await this.assertCanChat(currentUser.id, recipientId, organizationId);

    const content = dto.content.trim();

    if (!content) {
      throw new BadRequestException('Mensagem é obrigatória');
    }

    const message = await this.prisma.message.create({
      data: {
        organizationId: organizationId!,
        senderId: currentUser.id,
        recipientId,
        content,
      },
      include: {
        sender: { select: this.memberSelect() },
        recipient: { select: this.memberSelect() },
      },
    });

    return {
      success: true,
      message: this.formatMessage(message),
    };
  }

  async markMessagesAsRead(
    userId: string,
    organizationId: string,
    friendId: string,
  ) {
    await this.prisma.message.updateMany({
      where: {
        organizationId,
        senderId: friendId,
        recipientId: userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  }

  async touchLastSeen(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastSeen: new Date() },
    });
  }

  async assertOrganizationMember(
    userId: string,
    organizationId: string | undefined,
  ) {
    this.assertOrganizationId(organizationId);

    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId: organizationId!,
        },
      },
      select: {
        id: true,
        role: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Membro não pertence à organização');
    }

    return membership;
  }

  private async assertCanChat(
    userId: string,
    friendId: string,
    organizationId: string | undefined,
  ) {
    await this.assertOrganizationMember(userId, organizationId);
    await this.assertOrganizationMember(friendId, organizationId);

    const [userAId, userBId] = this.normalizeFriendshipPair(userId, friendId);

    const friendship = await this.prisma.friendship.findUnique({
      where: {
        organizationId_userAId_userBId: {
          organizationId: organizationId!,
          userAId,
          userBId,
        },
      },
      select: { id: true },
    });

    if (!friendship) {
      throw new ForbiddenException('Só é possível conversar com amigos');
    }
  }

  private directConversationWhere(
    organizationId: string,
    userId: string,
    friendId: string,
  ) {
    return {
      organizationId,
      OR: [
        { senderId: userId, recipientId: friendId },
        { senderId: friendId, recipientId: userId },
      ],
    };
  }

  private normalizeFriendshipPair(userId: string, friendId: string) {
    return [userId, friendId].sort() as [string, string];
  }

  private assertNotSelf(userId: string, friendId: string) {
    if (userId === friendId) {
      throw new BadRequestException('Não é possível adicionar a si próprio');
    }
  }

  private assertOrganizationId(organizationId: string | undefined) {
    if (!organizationId) {
      throw new ForbiddenException('Contexto da organização não encontrado');
    }
  }

  private memberSelect() {
    return {
      id: true,
      displayName: true,
      avatarUrl: true,
      lastSeen: true,
    };
  }

  private formatMessage(message: any) {
    return {
      id: message.id,
      organizationId: message.organizationId,
      senderId: message.senderId,
      recipientId: message.recipientId,
      content: message.content,
      readAt: message.readAt,
      createdAt: message.createdAt,
      sender: message.sender,
      recipient: message.recipient,
    };
  }
}
