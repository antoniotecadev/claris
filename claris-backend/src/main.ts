import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // Onde os controladores e serviços são definidos.
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApiOrganizationsModule } from './api/organizations/organizations.module';
import { ApiUsersModule } from './api/user/users.module';

// Ponto de entrada da aplicação,
// onde o aplicativo é criado e configurado para ouvir as solicitações na porta especificada (padrão 3000).
// O método `bootstrap` é assíncrono para permitir a inicialização de recursos assíncronos,
// como conexões de banco de dados ou serviços externos, antes de iniciar o servidor.

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1'); // Todas as rotas terão prefixo /api/api
  app.enableCors({
    origin: 'http://localhost:3000', // Permite solicitações do frontend local
    credentials: true, // Permite envio de cookies e credenciais
  });

  app.useGlobalPipes(
    // Aactiva a validação automática de todos os dados que chegam na API (body, query, params, etc.)
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não estão definidas nos DTOs (Data Transfer Objects)
      forbidNonWhitelisted: true, // Retorna um erro se houver propriedades não definidas nos DTOs
      transform: true, // Transforma os dados de entrada para os tipos definidos nos DTOs (por exemplo, string para número)
      transformOptions: {
        enableImplicitConversion: true, // Permite conversão implícita de tipos, como string para número, sem precisar usar @Type() nos DTOs
      },
    }),
  );

  const config = new DocumentBuilder()

    .setTitle('Claris Public API')
    .setDescription('Public API secured with API Key',)
    .setVersion('1.0.0')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
        description: 'Public API Key',
      },
      'api_key',
    ).build();

  const document = SwaggerModule.createDocument(app, config,
    {
      include: [
        ApiUsersModule,
        ApiOrganizationsModule,
      ],
    },
  );

  SwaggerModule.setup('public/docs', app, document,);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
