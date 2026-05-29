import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from 'generated/prisma/enums';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventCommentDto } from './dto/create-event-comment.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async listEvents(
    currentUser: JwtPayload,
    organizationId: string | undefined,
  ) {
    await this.assertIsOrganizationMember(currentUser.id, organizationId);

    const events = await this.prisma.event.findMany({
      where: { organizationId },
      orderBy: { date: 'asc' },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        location: true,
        photoUrl: true,
        createdAt: true,
        interests: {
          where: { userId: currentUser.id },
          select: { id: true },
        },
        _count: {
          select: {
            interests: true,
            comments: true,
          },
        },
      },
    });

    return {
      success: true,
      total: events.length,
      events: events.map((event) => this.formatEventSummary(event)),
    };
  }

  async createEvent(
    currentUser: JwtPayload,
    organizationId: string | undefined,
    dto: CreateEventDto,
    file?: Express.Multer.File,
  ) {
    await this.assertCanManageEvents(currentUser.id, organizationId);

    const date = this.parseEventDate(dto.date);
    const photoUrl = await this.resolvePhotoUrl(dto.photoUrl, file);

    const event = await this.prisma.event.create({
      data: {
        organizationId: organizationId!,
        title: dto.title,
        description: dto.description,
        date,
        location: dto.location,
        photoUrl,
      },
      select: this.eventDetailSelect(currentUser.id),
    });

    return {
      success: true,
      event: this.formatEventDetail(event),
    };
  }

  async getEvent(
    currentUser: JwtPayload,
    organizationId: string | undefined,
    eventId: string,
  ) {
    await this.assertIsOrganizationMember(currentUser.id, organizationId);

    const event = await this.findEventDetail(
      organizationId!,
      eventId,
      currentUser.id,
    );

    return {
      success: true,
      event: this.formatEventDetail(event),
    };
  }

  async updateEvent(
    currentUser: JwtPayload,
    organizationId: string | undefined,
    eventId: string,
    dto: UpdateEventDto,
    file?: Express.Multer.File,
  ) {
    await this.assertCanManageEvents(currentUser.id, organizationId);
    await this.assertEventBelongsToOrganization(organizationId!, eventId);

    const photoUrl = await this.resolvePhotoUrl(dto.photoUrl, file);

    const event = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        title: dto.title,
        description: dto.description,
        date: dto.date ? this.parseEventDate(dto.date) : undefined,
        location: dto.location,
        photoUrl,
      },
      select: this.eventDetailSelect(currentUser.id),
    });

    return {
      success: true,
      event: this.formatEventDetail(event),
    };
  }

  async deleteEvent(
    currentUser: JwtPayload,
    organizationId: string | undefined,
    eventId: string,
  ) {
    await this.assertCanManageEvents(currentUser.id, organizationId);
    await this.assertEventBelongsToOrganization(organizationId!, eventId);

    await this.prisma.$transaction([
      this.prisma.eventComment.deleteMany({ where: { eventId } }),
      this.prisma.eventInterest.deleteMany({ where: { eventId } }),
      this.prisma.event.delete({ where: { id: eventId } }),
    ]);

    return {
      success: true,
      message: 'Evento removido com sucesso',
    };
  }

  async markInterest(
    currentUser: JwtPayload,
    organizationId: string | undefined,
    eventId: string,
  ) {
    await this.assertIsOrganizationMember(currentUser.id, organizationId);
    await this.assertEventBelongsToOrganization(organizationId!, eventId);

    await this.prisma.eventInterest.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId: currentUser.id,
        },
      },
      create: {
        eventId,
        userId: currentUser.id,
      },
      update: {},
    });

    const interestedCount = await this.prisma.eventInterest.count({
      where: { eventId },
    });

    return {
      success: true,
      interested: true,
      interestedCount,
    };
  }

  async removeInterest(
    currentUser: JwtPayload,
    organizationId: string | undefined,
    eventId: string,
  ) {
    await this.assertIsOrganizationMember(currentUser.id, organizationId);
    await this.assertEventBelongsToOrganization(organizationId!, eventId);

    await this.prisma.eventInterest.deleteMany({
      where: {
        eventId,
        userId: currentUser.id,
      },
    });

    const interestedCount = await this.prisma.eventInterest.count({
      where: { eventId },
    });

    return {
      success: true,
      interested: false,
      interestedCount,
    };
  }

  async addComment(
    currentUser: JwtPayload,
    organizationId: string | undefined,
    eventId: string,
    dto: CreateEventCommentDto,
  ) {
    await this.assertIsOrganizationMember(currentUser.id, organizationId);
    await this.assertEventBelongsToOrganization(organizationId!, eventId);

    const content = dto.content.trim();

    if (!content) {
      throw new BadRequestException('Comentário é obrigatório');
    }

    const comment = await this.prisma.eventComment.create({
      data: {
        eventId,
        authorId: currentUser.id,
        content,
      },
      select: this.commentSelect(),
    });

    return {
      success: true,
      comment,
    };
  }

  async deleteComment(
    currentUser: JwtPayload,
    organizationId: string | undefined,
    eventId: string,
    commentId: string,
  ) {
    const membership = await this.assertIsOrganizationMember(
      currentUser.id,
      organizationId,
    );
    await this.assertEventBelongsToOrganization(organizationId!, eventId);

    const comment = await this.prisma.eventComment.findFirst({
      where: {
        id: commentId,
        eventId,
      },
      select: {
        id: true,
        authorId: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comentário não encontrado');
    }

    if (comment.authorId !== currentUser.id && membership.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'Sem permissão para remover este comentário',
      );
    }

    await this.prisma.eventComment.delete({
      where: { id: commentId },
    });

    return {
      success: true,
      message: 'Comentário removido com sucesso',
    };
  }

  private async assertCanManageEvents(
    userId: string,
    organizationId: string | undefined,
  ) {
    const membership = await this.assertIsOrganizationMember(
      userId,
      organizationId,
    );

    if (membership.role !== Role.ADMIN) {
      throw new ForbiddenException('Sem permissão para gerir eventos');
    }
  }

  private async assertIsOrganizationMember(
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
        role: true,
      },
    });

    if (!membership) {
      throw new ForbiddenException('Membro não pertence à organização');
    }

    return membership;
  }

  private async assertEventBelongsToOrganization(
    organizationId: string,
    eventId: string,
  ) {
    const event = await this.prisma.event.findFirst({
      where: {
        id: eventId,
        organizationId,
      },
      select: { id: true },
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }
  }

  private async findEventDetail(
    organizationId: string,
    eventId: string,
    userId: string,
  ) {
    const event = await this.prisma.event.findFirst({
      where: {
        id: eventId,
        organizationId,
      },
      select: this.eventDetailSelect(userId),
    });

    if (!event) {
      throw new NotFoundException('Evento não encontrado');
    }

    return event;
  }

  private eventDetailSelect(userId: string) {
    return {
      id: true,
      organizationId: true,
      title: true,
      description: true,
      date: true,
      location: true,
      photoUrl: true,
      createdAt: true,
      interests: {
        where: { userId },
        select: { id: true },
      },
      comments: {
        orderBy: { createdAt: 'asc' as const },
        select: this.commentSelect(),
      },
      _count: {
        select: {
          interests: true,
          comments: true,
        },
      },
    };
  }

  private commentSelect() {
    return {
      id: true,
      content: true,
      createdAt: true,
      author: {
        select: {
          id: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    };
  }

  private formatEventSummary(event: {
    interests: { id: string }[];
    _count: { interests: number; comments: number };
  }) {
    const { interests, _count, ...rest } = event;

    return {
      ...rest,
      interested: interests.length > 0,
      interestedCount: _count.interests,
      commentCount: _count.comments,
    };
  }

  private formatEventDetail(event: {
    interests: { id: string }[];
    _count: { interests: number; comments: number };
  }) {
    const { interests, _count, ...rest } = event;

    return {
      ...rest,
      interested: interests.length > 0,
      interestedCount: _count.interests,
      commentCount: _count.comments,
    };
  }

  private async resolvePhotoUrl(photoUrl?: string, file?: Express.Multer.File) {
    if (!file) {
      return photoUrl;
    }

    const uploaded: any = await this.cloudinaryService.uploadFile(
      file,
      'claris/events',
    );

    return uploaded.secure_url;
  }

  private parseEventDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Data do evento inválida');
    }

    return date;
  }

  private assertOrganizationId(organizationId: string | undefined) {
    if (!organizationId) {
      throw new ForbiddenException('Contexto da organização não encontrado');
    }
  }
}
