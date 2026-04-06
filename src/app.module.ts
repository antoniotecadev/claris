import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

// O módulo raiz da aplicação, onde os controladores e serviços são registrados.

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Torna o módulo disponível em toda a app
      envFilePath: '.env', // Caminho para o arquivo .env
    }),
  ], // Módulos de banco de dados, autenticação, etc.
  controllers: [AppController], // Controladores que lidam com as rotas e solicitações HTTP.
  providers: [AppService], // Serviços que contêm a lógica de negócios e são injetados nos controladores.
})
export class AppModule {}
