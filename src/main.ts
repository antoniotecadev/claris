import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module'; // Onde os controladores e serviços são definidos.

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
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
