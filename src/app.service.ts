import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Serviço para acessar as variáveis de ambiente.

// O serviço principal da aplicação, responsável por conter a lógica de negócios.
// Ele é injetado no controlador `AppController` para fornecer dados ou mensagens para os clientes.
// O método `getHello` retorna uma string simples, mas em uma aplicação real, ele poderia conter lógica mais complexa,
// como acessar um banco de dados ou chamar outros serviços.

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): object {
    return {
      message: 'Hello World!',
      name: 'Claris Backend',
      version: '1.0.0',
    };
  }
}
