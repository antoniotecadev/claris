
export interface UserPayload {
  id: string;
  email: string;
  displayName: string; 
  gender?: string | null;
  birthDate?: Date | null;
  avatarUrl?: string | null; 
  organizationId?: string; 
  role?: string; 
}