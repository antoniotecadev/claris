import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// O controlador principal da aplicação, responsável por lidar com as solicitações HTTP e retornar respostas.
// Ele injeta o serviço `AppService` para acessar a lógica de negócios e retornar dados ou mensagens para os clientes.

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): object {
    return this.appService.getHello();
  }
}
