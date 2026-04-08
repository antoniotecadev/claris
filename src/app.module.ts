// src/app.module.ts

// Módulo: é uma classe decorada com `@Module` que organiza os componentes da aplicação.
// O módulo raiz da aplicação, onde os controladores, serviços e outros módulos são registrados.

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { OrganizatiosnController } from './modules/organizatiosn/organizatiosn.controller';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna o módulo disponível em toda a app
      envFilePath: '.env', // Caminho para o arquivo .env
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    OrganizationsModule,
    MembershipsModule,
    ChatModule,
  ], // Módulos de banco de dados, autenticação, etc.
  controllers: [AppController, OrganizatiosnController], // Controladores que lidam com as rotas e solicitações HTTP.
  providers: [AppService], // Serviços que contêm a lógica de negócios e são injetados nos controladores.
})
export class AppModule {}
