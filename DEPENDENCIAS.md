# 📦 Dependências do NestJS - Guia Completo

## 🏗️ Core do NestJS (Obrigatórias)

### `@nestjs/core` (Coração do NestJS)
Fornece a estrutura básica para criar e organizar a aplicação NestJS, incluindo o sistema de módulos, injeção de dependências e ciclo de vida dos componentes.

### `@nestjs/common` (Utilitários essenciais)
Contém decoradores, interfaces e classes comuns usadas em toda a aplicação, como `@Controller`, `@Injectable`, `@Module`, etc.

### `@nestjs/platform-express` (Servidor HTTP)
Permite que a aplicação NestJS seja executada em um servidor Express, que é o servidor HTTP mais popular para aplicações Node.js.

### `reflect-metadata` (Metadados em tempo de execução)
Esta biblioteca é usada para adicionar metadados a classes e métodos em tempo de execução. O NestJS a utiliza para implementar recursos como injeção de dependências e decoradores personalizados.

### `rxjs` (Programação reativa)
A biblioteca rxjs é usada para implementar programação reativa em aplicações NestJS, permitindo o tratamento de dados assíncronos de forma mais eficiente.

---

## ⚙️ Configuração e Utilitários

### `@nestjs/config`
Centraliza e gerencia as configurações da aplicação, essencialmente substituindo o uso direto de `process.env` com uma abordagem mais organizada e poderosa.

### `class-validator`
Valida se os dados que chegam no seu DTO são corretos (ex: se o email é realmente um email).

### `class-transformer`
Transforma objetos simples em instâncias de classes e vice-versa.

### `@nestjs/mapped-types`
Criar variações de DTOs (como o `PartialType` para atualizações de dados).

---

## 🔐 Autenticação e Segurança

### `@nestjs/jwt`
Pacote para gerar e validar tokens JWT (JSON Web Tokens).

### `@nestjs/passport`
Integra estratégias de autenticação do Passport.js (local, jwt, google, facebook, etc.).

### `passport` (Framework de autenticação)
O Passport é um middleware de autenticação para Node.js que suporta uma ampla variedade de estratégias de autenticação, como local, JWT, OAuth, etc. Ele é usado em conjunto com `@nestjs/passport` para implementar autenticação em aplicações NestJS.

### `passport-jwt` (Estratégia JWT)
Esta é uma estratégia de autenticação para o Passport que permite a autenticação usando JSON Web Tokens (JWT). Ele é usado para proteger rotas e garantir que apenas usuários autenticados possam acessá-las.

### `passport-local` (Estratégia local)
Esta é uma estratégia de autenticação para o Passport que permite a autenticação usando um nome de usuário e senha. É comumente usada para autenticação tradicional em aplicações web.

### `bcrypt`
Para "hashear" as senhas dos usuários (nunca salve senhas em texto puro!).

---

## 🗄️ Banco de Dados

### `@prisma/client`
O ORM para interagir com o banco de dados.

---

## 📊 Tabela Resumo Rápida

| Dependência | Categoria | Função Principal |
|-------------|-----------|------------------|
| `@nestjs/core` | Core | Estrutura da aplicação, DI, módulos |
| `@nestjs/common` | Core | Decorators e utilitários essenciais |
| `@nestjs/platform-express` | Core | Servidor HTTP (Express) |
| `reflect-metadata` | Core | Suporte a decorators |
| `rxjs` | Core | Programação reativa |
| `@nestjs/config` | Config | Gerenciamento de configurações |
| `class-validator` | Validação | Validar dados dos DTOs |
| `class-transformer` | Transformação | Transformar objetos em classes |
| `@nestjs/mapped-types` | DTO | Criar variações de DTOs |
| `@nestjs/jwt` | Auth | Gerar/validar tokens JWT |
| `@nestjs/passport` | Auth | Integração com Passport.js |
| `passport` | Auth | Framework de autenticação |
| `passport-jwt` | Auth | Estratégia de autenticação JWT |
| `passport-local` | Auth | Estratégia de autenticação local |
| `bcrypt` | Segurança | Hash de senhas |
| `@prisma/client` | Database | ORM para banco de dados |

---

## 🎯 Fluxo de Uso Recomendado

```typescript
// 1. Core obrigatório
import { NestFactory } from '@nestjs/core';
import { Controller, Get, Module } from '@nestjs/common';

// 2. Configurações
import { ConfigModule } from '@nestjs/config';

// 3. Validação e transformação
import { IsEmail, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

// 4. Autenticação
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';

// 5. Banco de dados
import { PrismaClient } from '@prisma/client';