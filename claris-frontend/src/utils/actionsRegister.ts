"use server";
import { api } from "@/lib/api";
import { setAuthToken } from "@/lib/auth-cookies";

export async function registerAction(prevState: any, formData: FormData) {
	const displayName = formData.get('displayName') as string;
	const email = formData.get('email') as string;
	const password = formData.get('password') as string;
	const confirmPassword = formData.get('confirmPassword') as string;
	const gender = formData.get('gender') as string;
	const birthDate = formData.get('birthDate') as string;

	if (!displayName || !email || !password) {
		return { success: false, error: "errors.required" };
	}

	if (password !== confirmPassword) {
		return { success: false, error: "errors.passwordsNotMatch" };
	}

	if (password.length < 6) {
		return { success: false, error: "errors.passwordMinLength" };
	}

	// Validar idade mínima de 13 anos
	if (birthDate) {
		const birth = new Date(birthDate);
		const today = new Date();
		let age = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
			age--;
		}
		if (age < 13) {
			return { success: false, error: "MINIMUM_AGE_ERROR", needsTranslation: true };
		}
	}

	try {
		const data = await api.post<any>("/auth/register", {
			displayName,
			email,
			password,
			...(gender && { gender }),
			...(birthDate && { birthDate }),
		});

		const accessToken = data?.user?.token?.access_token;
		if (accessToken) {
			await setAuthToken(accessToken);
		}
		return {
			success: true, user: {
				id: data.user.id,
				displayName: data.user.displayName,
				email: data.user.email,
				avatarUrl: data.user.avatarUrl,
			}
		};

	} catch (error: any) {
		return { success: false, error: error.message || "errors.accountCreationError" };
	}
}
