// src/common/decorator/current-user.decorator.ts

// CurrentUser: é um decorador personalizado que extrai o usuário autenticado do objecto de solicitação (request) e o torna disponível como um parâmetro em controladores ou serviços.
// Ele depende do facto de que a estratégia JWT (JwtStrategy) já tenha validado o token e adicionado as informações do usuário ao objecto request.user.
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  // data: é um parâmetro opcional que pode ser passado ao usar o decorador, mas neste caso não é necessário.
  // ctx: é o contexto de execução que fornece acesso ao objecto de solicitação (request) e outros detalhes da solicitação HTTP.

  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // Retorna o que a tua JwtStrategy validou
  },
);
