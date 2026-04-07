import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Método chamado quando o módulo AppModule é inicializado,
  // onde a conexão com o banco de dados é estabelecida.
  async onModuleInit() {
    await this.$connect();
  }

  // Método chamado quando o módulo AppModule é destruído,
  // onde a conexão com o banco de dados é encerrada para liberar recursos.
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
