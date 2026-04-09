import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // Onde os controladores e serviços são definidos.
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// Ponto de entrada da aplicação,
// onde o aplicativo é criado e configurado para ouvir as solicitações na porta especificada (padrão 3000).
// O método `bootstrap` é assíncrono para permitir a inicialização de recursos assíncronos,
// como conexões de banco de dados ou serviços externos, antes de iniciar o servidor.

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // Todas as rotas terão prefixo /api
  app.enableCors({
    origin: '*', // Permite solicitações de qualquer origem. Em produção, é recomendado restringir isso a domínios específicos.
  });

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
