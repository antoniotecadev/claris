"use server"
import axios from "axios";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;

	if (!email || !password) {
		return { success: false, error: "Email e senha são obrigatórios." };
	}

	let redirectUrl: string | null = null;

	try {

		const res = await axios.post(
			"http://localhost:3001/v1/api/auth/login",
			{ email, password }
		);

		const data = res.data?.result ?? res.data;
		console.log("Resposta do login -> ", data);

		if (data?.requireEmailCode) {
			redirectUrl = `/codeAuth`;
		}
		else if (data?.requireEmailVerification) {
			redirectUrl = `/codeAuth?email=${encodeURIComponent(data.email)}`;
		}
		else if (data?.requireOrganizationSelection) {
			redirectUrl = `/select-organization?selectionToken=${encodeURIComponent(
				data.selectionToken, 
			)}`;
		}

		else {
			return { success: false, error: "Resposta inesperada do servidor." };
		}

	} catch (error: any) {

		const messages = error?.response?.data?.message;
		const errorMessage = Array.isArray(messages)
			? messages[0]
			: messages || "Erro inesperado. Tente novamente.";

		return { success: false, error: errorMessage };
	}

	// ← redirect FORA do try/catch
	if (!redirectUrl) {
		return { success: false, error: "URL de redirecionamento não determinado." };
	}
	redirect(redirectUrl);
}