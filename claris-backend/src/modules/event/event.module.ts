import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PrismaModule } from '../prisma/prisma.module';
import { EventController } from './event.controller';
import { EventService } from './event.service';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
