import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Aqui você pode importar outros módulos, como o PrismaModule para acessar o banco de dados
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
