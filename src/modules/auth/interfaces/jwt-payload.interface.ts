export interface JwtPayload{
	id: string | undefined;
	email: string | undefined;
	organizationId?: string;
	role?: string
}