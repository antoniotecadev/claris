
export interface JwtPayload {
  id: string;
  email: string;
  organizationId?: string;
  role?: string;
}