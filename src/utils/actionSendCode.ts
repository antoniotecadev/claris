"use server"
import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { setAuthToken } from "@/lib/auth-cookies";
import type { ActionResult, VerifyCodeResponse } from "@/types/auth.types";


export async function sendCodeAction(_prevState: unknown, code: string, email: string): Promise<ActionResult> {
	if (!code || !email) {
		return { success: false, error: "Código e email são obrigatórios." };
	}
	let redirecionarUrl: string | null = null;

	try {
		console.log("Enviando código para verificação -> ", { email, code });
		const res = await api.post<{ result?: VerifyCodeResponse } & VerifyCodeResponse>("/auth/email/verify-login", { email, code });
		const data = res?.result ?? res;
		console.log("Resposta da verificação -> ", data);

		const accessToken = data?.user?.token?.access_token ?? data?.token?.access_token;
		if (accessToken) {
			await setAuthToken(accessToken);
			redirecionarUrl = "/mainDash";
		} else if (data?.requireOrganizationSelection) {
			if (!data.selectionToken) {
				return { success: false, error: "Token de seleção não informado pelo servidor." };
			}
			redirecionarUrl = `/select-organization?selectionToken=${encodeURIComponent(
				data.selectionToken,
			)}`;
		} else if (data?.success) {
			redirecionarUrl = "/mainDash";

		} else {
			return { success: false, error: "Resposta inesperada do servidor." };
		}

	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : "Erro inesperado. Tente novamente.";

		return { success: false, error: errorMessage };
	}
	if (redirecionarUrl) {
		redirect(redirecionarUrl);
	}

	return { success: true };
}
