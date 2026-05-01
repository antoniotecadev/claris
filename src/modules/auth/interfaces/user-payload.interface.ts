
export interface UserPayload {
  id: string;
  email: string;
  displayName: string; 
  avatarUrl?: string | null; 
  twofa_enabled?: boolean; 
  organizationId?: string; 
  role?: string; 
}