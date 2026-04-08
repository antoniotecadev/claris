// src/modules/auth/interfaces/jwt-payload.interface.ts

// JwtPayload: define a estrutura do payload do JWT, incluindo email, ID do usuário, ID da organização activa na sessão e o papel do usuário nessa organização.
export interface JwtPayload {
  email: string;
  sub: string; // userId
  organizationId: string; // O ID da igreja activa na sessão
  role: string; // O papel dele nessa igreja
}
