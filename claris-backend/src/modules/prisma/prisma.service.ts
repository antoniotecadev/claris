import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor(private configService: ConfigService) {
    // 1. Pegamos a URL do banco do ConfigService injetado
    const connectionString = configService.get<string>('DATABASE_URL');

    // 2. Criamos o Pool de forma única para esta instância
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    // 3. Passamos o adapter para o super (PrismaClient)
    super({ adapter });
    
    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end(); // Fecha o pool de conexões do driver PG
  }
}