import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService], // Registra o serviço, para permite que seja injetado em outros componentes da aplicação.
  exports: [PrismaService], // Exporta o serviço para que possa ser injetado em outros módulos, como AppModule.
})
export class PrismaModule {}
