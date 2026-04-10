import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // Onde os controladores e serviços são definidos.
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Ponto de entrada da aplicação,
// onde o aplicativo é criado e configurado para ouvir as solicitações na porta especificada (padrão 3000).
// O método `bootstrap` é assíncrono para permitir a inicialização de recursos assíncronos,
// como conexões de banco de dados ou serviços externos, antes de iniciar o servidor.

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/v1/api'); // Todas as rotas terão prefixo /v1/api
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
    .setTitle('Church SaaS API')
    .setDescription('Documentação da API para os Membros B, C e D')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Insira o seu token JWT',
        in: 'header',
      },
      'access-token', // Este é o nome da referência para usarmos nos controllers
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
