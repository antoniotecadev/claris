"use server"
import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { setAuthToken } from "@/lib/auth-cookies";
import type { ActionResult, LoginResponse } from "@/types/auth.types";

export async function loginAction(_prevState: unknown, formData: FormData): Promise<ActionResult> {
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;

	if (!email || !password) {
		return { success: false, error: "Email e senha são obrigatórios." };
	}

	let redirectUrl: string | null = null;

	try {
	
		const res = await api.post<{ result?: LoginResponse } & LoginResponse>("/auth/login", { email, password });
		const data = res?.result ?? res;

		if (data?.user?.token?.access_token) {
			await setAuthToken(data.user.token.access_token);
			redirectUrl = "/mainDash";
		}
		else if (data?.requireEmailCode) {
			redirectUrl = `/codeAuth?email=${encodeURIComponent(formData.get('email') as string)}`;
		}
		else if (data?.requireEmailVerification) {
			if (!data.email) {
				return { success: false, error: "Email não informado pelo servidor." };
			}
			redirectUrl = `/codeAuth?email=${encodeURIComponent(data.email)}`;
		}
		else if (data?.requireOrganizationSelection) {
			if (!data.selectionToken) {
				return { success: false, error: "Token de seleção não informado pelo servidor." };
			}
			redirectUrl = `/select-organization?selectionToken=${encodeURIComponent(
				data.selectionToken,
			)}`;
		}
		else {
			return { success: false, error: "Resposta inesperada do servidor." };
		}

	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "Erro inesperado. Tente novamente.";

		return { success: false, error: errorMessage };
	}

	if (!redirectUrl) {
		return { success: false, error: "URL de redirecionamento não determinado." };
	}

	return { success: true, redirectUrl };
}