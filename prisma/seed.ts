// prisma/seed.ts
import { PrismaClient, Role } from '../generated/prisma/client'; // Importe o Prisma Client e o enum Role do arquivo gerado
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

// conjunto de conexões pré-estabelecidas com o banco de dados que ficam disponíveis para serem reutilizadas,
// evitando a sobrecarga de criar uma nova conexão a cada operação.
// O PrismaPg é um adaptador que permite usar o Prisma Client com o pool de conexões do PostgreSQL.
const pool = new Pool({
  connectionString: new ConfigService().get<string>('DATABASE_URL'),
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Semeando base de dados...');

  // 1. Limpar dados existentes (Ordem inversa das dependências)
  await prisma.membership.deleteMany();
  await prisma.event.deleteMany();
  await prisma.message.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const saltRounds = 10; // Número de rounds para o bcrypt gerar o hash da senha
  const passwordHash = await bcrypt.hash('password123', saltRounds);

  // 2. Criar Organizações (Igrejas)
  const org1 = await prisma.organization.create({
    data: {
      name: 'Igreja Central de Luanda',
      slug: 'igreja-central',
      logoUrl: 'https://placehold.co/200x200?text=ICL',
    },
  });

  const org2 = await prisma.organization.create({
    data: {
      name: 'Igreja da Graça',
      slug: 'igreja-graca',
      logoUrl: 'https://placehold.co/200x200?text=IDG',
    },
  });

  // 3. Criar Utilizadores e Atribuir Memberships
  // Utilizador 1: Pastor na Igreja Central
  await prisma.user.create({
    data: {
      email: 'pastor@central.com',
      passwordHash: passwordHash,
      displayName: 'Pastor António',
      memberships: {
        create: {
          organizationId: org1.id,
          role: Role.PASTOR,
        },
      },
    },
  });

  // Utilizador 2: Membro na Igreja Central
  await prisma.user.create({
    data: {
      email: 'membro@central.com',
      passwordHash: passwordHash,
      displayName: 'João Silva',
      memberships: {
        create: {
          organizationId: org1.id,
          role: Role.MEMBER,
        },
      },
    },
  });

  // Utilizador 3: Pastor na Igreja da Graça
  await prisma.user.create({
    data: {
      email: 'pastor@graca.com',
      passwordHash: passwordHash,
      displayName: 'Pastora Maria',
      memberships: {
        create: {
          organizationId: org2.id,
          role: Role.PASTOR,
        },
      },
    },
  });

  // 4. Criar Eventos para testar o Multi-tenancy
  await prisma.event.create({
    data: {
      title: 'Culto de Domingo - Central',
      description: 'Culto principal da manhã',
      date: new Date(),
      organizationId: org1.id,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Vigília da Graça',
      description: 'Vigília de oração sexta-feira',
      date: new Date(),
      organizationId: org2.id,
    },
  });

  console.log('Seed concluído com sucesso!');
  console.log(`Igreja Central ID: ${org1.id}`);
  console.log(`Igreja Graça ID: ${org2.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
