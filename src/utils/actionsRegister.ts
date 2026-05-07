"use server";
import { redirect } from "next/navigation";
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
    return { success: false, error: "Preencha todos os campos obrigatórios." };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "As senhas não coincidem." };
  }

  if (password.length < 6) {
    return { success: false, error: "A senha deve ter no mínimo 6 caracteres." };
  }

  try {
    const data = await api.post<any>("/auth/register", {
      displayName,
      email,
      password,
      ...(gender && { gender }),
      ...(birthDate && { birthDate }),
    });

    // Registo faz login automático — guarda o token no cookie
    const accessToken = data?.user?.token?.access_token;
    if (accessToken) {
      await setAuthToken(accessToken);
    }

  } catch (error: any) {
    return { success: false, error: error.message || "Erro ao criar conta." };
  }

  redirect("/select-organization");
}