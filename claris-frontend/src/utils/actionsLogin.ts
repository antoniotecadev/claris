"use server"
import { api } from "@/lib/api";
import { setAuthToken } from "@/lib/auth-cookies";
import { addLocaleToPathname, defaultLocale } from "@/i18n/routing";
import type { ActionResult, LoginResponse } from "@/types/auth.types";

export async function loginAction(_prevState: unknown, formData: FormData): Promise<ActionResult> {
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;
	const locale = (formData.get("locale") as string) || defaultLocale;

	if (!email || !password) {
		return { success: false, error: "errors.emailAndPasswordRequired" };
	}

	let redirectUrl: string | null = null;

	try {
	
		const res = await api.post<{ result?: LoginResponse } & LoginResponse>("/auth/login", { email, password });
		const data = res?.result ?? res;

		if (data?.user?.token?.access_token) {
			await setAuthToken(data.user.token.access_token);
			redirectUrl = addLocaleToPathname("/mainDash", locale);
		}
		else if (data?.requireEmailCode) {
			redirectUrl = addLocaleToPathname(
				`/codeAuth?email=${encodeURIComponent(formData.get('email') as string)}`,
				locale
			);
		}
		else if (data?.requireEmailVerification) {
			if (!data.email) {
				return { success: false, error: "errors.emailNotProvided" };
			}
			redirectUrl = addLocaleToPathname(
				`/codeAuth?email=${encodeURIComponent(data.email)}`,
				locale
			);
		}
		else if (data?.requireOrganizationSelection) {
			if (!data.selectionToken) {
				return { success: false, error: "errors.selectionTokenNotProvided" };
			}
			redirectUrl = addLocaleToPathname(
				`/select-organization?selectionToken=${encodeURIComponent(
					data.selectionToken,
				)}`,
				locale
			);
		}
		else {
			return { success: false, error: "errors.unexpectedResponse" };
		}

	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "errors.unexpected";

		return { success: false, error: errorMessage };
	}

	if (!redirectUrl) {
		return { success: false, error: "errors.redirectNotDetermined" };
	}

	return { success: true, redirectUrl };
}