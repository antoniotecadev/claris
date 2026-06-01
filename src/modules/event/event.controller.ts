import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventService } from './event.service';

@UseGuards(JwtAuthGuard)
@Controller('organizations/:organizationId/events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  listEvents(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
  ) {
    return this.eventService.listEvents(user, organizationId);
  }

  @Post()
  @UseInterceptors(FileInterceptor('photoUrl'))
  createEvent(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
    @Body() dto: CreateEventDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.eventService.createEvent(user, organizationId, dto, file);
  }

  @Get(':eventId')
  getEvent(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.eventService.getEvent(user, organizationId, eventId);
  }

  @Patch(':eventId')
  @UseInterceptors(FileInterceptor('photoUrl'))
  updateEvent(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
    @Param('eventId') eventId: string,
    @Body() dto: UpdateEventDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.eventService.updateEvent(
      user,
      organizationId,
      eventId,
      dto,
      file,
    );
  }

  @Delete(':eventId')
  deleteEvent(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.eventService.deleteEvent(user, organizationId, eventId);
  }

  @Post(':eventId/interests')
  markInterest(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.eventService.markInterest(user, organizationId, eventId);
  }

  @Delete(':eventId/interests')
  removeInterest(
    @CurrentUser() user: JwtPayload,
    @Param('organizationId') organizationId: string,
    @Param('eventId') eventId: string,
  ) {
    return this.eventService.removeInterest(user, organizationId, eventId);
  }
}
