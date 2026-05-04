"use server"
import axios from "axios";
import { redirect } from "next/navigation";


export async function sendCodeAction(prevState: any, code: string, email: string) {
	if (!code || !email) {
		return { success: false, error: "Código e email são obrigatórios." };
	}

	try {
		const res = await axios.post(
			"http://localhost:3001/v1/api/auth/email/verify",
			{ email , code }
		);

		const data = res.data?.result ?? res.data;
		console.log("Resposta da verificação -> ", data);

		if (data?.requireOrganizationSelection) {
			redirect(`/select-organization?selectionToken=${encodeURIComponent(
				data.selectionToken, 
			)}`);
		} else {
			return { success: false, error: "Resposta inesperada do servidor." };
		}

	} catch (error: any) {

		const messages = error?.response?.data?.message;
		const errorMessage = Array.isArray(messages)
			? messages[0]
			: messages || "Erro inesperado. Tente novamente.";

		return { success: false, error: errorMessage };
	}	
}
