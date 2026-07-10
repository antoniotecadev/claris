import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

async function getApiAuthToken() {
  if (typeof window === "undefined") {
    const { getAuthToken } = await import("@/lib/auth-cookies");
    return getAuthToken();
  }

  const response = await fetch("/api/auth-token", {
    cache: "no-store",
    credentials: "same-origin",
  });

  if (!response.ok) return null;

  const data = (await response.json()) as { token?: string | null };
  return data.token ?? null;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getApiAuthToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401 || (res.status === 404 && endpoint === "/user/me")) {
      if (typeof window !== "undefined") {
        window.location.href = "/api/logout";
        await new Promise(() => { });
      } else {
        redirect("/api/logout");
      }
    }

    const error = await res.json().catch(() => ({}));
    const message = Array.isArray(error?.message)
      ? error.message[0]
      : error?.message || "Erro inesperado.";
    const apiError = new Error(message) as Error & { status?: number };
    apiError.status = res.status;
    throw apiError;
  }

  return res.json();
}

export const api = {
  get: <T>(endpoint: string) => apiFetch<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    apiFetch<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: <T>(endpoint: string, body: unknown) =>
    apiFetch<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
  patch: <T>(endpoint: string, body: unknown) =>
    apiFetch<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  delete: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: "DELETE" }),
};
