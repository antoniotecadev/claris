export type ActionResult = {
	success: boolean;
	error?: string;
	redirectUrl?: string;
};

export type TokenPayload = {
	access_token: string;
};

export type OrganizationRef = {
	organizationId: string;
	name: string;
	slug: string;
	logoUrl: string | null;
	role: string;
};

export type LoginResponse = {
	success?: boolean;
	requireEmailCode?: boolean;
	requireEmailVerification?: boolean;
	requireOrganizationSelection?: boolean;
	selectionToken?: string;
	id: string,
	email: string,
	displayName: string,
	avatarUrl: string,
	gender: string,
	birthDate: string,
	user?: {
		token?: TokenPayload;
	};
};

export type VerifyCodeResponse = {
	success?: boolean;
	requireOrganizationSelection?: boolean;
	selectionToken?: string;
	token?: TokenPayload;
	user?: {
		token?: TokenPayload;
	};
};

export type OrganizationOptionsResponse = {
	organizations?: OrganizationRef[];
};
