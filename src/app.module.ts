// Módulo: é uma classe decorada com `@Module` que organiza os componentes da aplicação.
// O módulo raiz da aplicação, onde os controladores, serviços e outros módulos são registrados.

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { ChurchModule } from './modules/church/church.module';
import { EventModule } from './modules/event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // ConfigModule: é um módulo que carrega as variáveis de ambiente do arquivo .env e as torna acessíveis em toda a aplicação.
      isGlobal: true,
      envFilePath: '.env',
      validate: (config) => {
        // Validação forte (recomendado)
        if (!config.JWT_SECRET) throw new Error('JWT_SECRET is missing');
        if (!config.DATABASE_URL) throw new Error('DATABASE_URL is missing');
        return config;
      },
    }),
    PrismaModule, // Banco de dados
    AuthModule, // Login/JWT
    UsersModule, // Gerenciamento de usuários
    OrganizationsModule, // Multi-tenancy (Igrejas)
    MembershipsModule, // Gestão de membros por organização
    ChurchModule,
    EventModule,
  ],
  controllers: [AppController], // Controladores que lidam com as rotas e solicitações HTTP.
  providers: [AppService], // Serviços que contêm a lógica de negócios e são injetados nos controladores.
})
export class AppModule {
  // O método `configure` é usado para aplicar middlewares a rotas específicas ou globalmente.
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware) // Aplica o TenantMiddleware
      .forRoutes({ path: '*path', method: RequestMethod.ALL }); // Aplica a todas as rotas e métodos HTTP
  }
}
