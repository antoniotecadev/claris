"use server";
import { api } from "@/lib/api";
import { setAuthToken } from "@/lib/auth-cookies";
import type { OrganizationOptionsResponse, VerifyCodeResponse } from "@/types/auth.types";

export async function getOrganizations(selectionToken: string) {
  if (!selectionToken) return null;

  try {
    const res = await api.post<{ result?: OrganizationOptionsResponse } & OrganizationOptionsResponse>("/auth/organization/options", { selectionToken });
    return res?.result ?? res;
  } catch (error: unknown) {
    console.error("Erro:", error instanceof Error ? error.message : error);
    return null;
  }
}

export async function selectOrganization(selectionToken: string, organizationId: string) {
  try {
    const res = await api.post<{ result?: VerifyCodeResponse } & VerifyCodeResponse>("/auth/organization/select", { selectionToken, organizationId });
    const data = res?.result ?? res;
    const accessToken = data?.user?.token?.access_token ?? data?.token?.access_token;

    if (accessToken) {
      await setAuthToken(accessToken);
    }

    return data;
  } catch (error: unknown) {
    console.error("Erro:", error instanceof Error ? error.message : error);
    return null;
  }
}