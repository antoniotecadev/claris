"use server";
import { api } from "@/lib/api";
import { setAuthToken } from "@/lib/auth-cookies";
import type { OrganizationOptionsResponse, VerifyCodeResponse } from "@/types/auth.types";

type TokenResponse = {
  access_token?: string;
};

export type SwitchedOrganizationUser = {
  id?: string;
  userId?: string;
  displayName?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  token?: TokenResponse;
};

type SwitchOrganizationResponse = {
  success?: boolean;
  user?: SwitchedOrganizationUser;
  token?: TokenResponse;
};

type CurrentUserResponse = {
  profile?: SwitchedOrganizationUser;
  user?: SwitchedOrganizationUser;
};

export async function getOrganizations(selectionToken: string) {
  if (!selectionToken) return null;

  try {
    const res = await api.post<{ result?: OrganizationOptionsResponse } & OrganizationOptionsResponse>("/auth/organization/options", { selectionToken });
    return res?.result ?? res;
  } catch {
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
  } catch {
    return null;
  }
}

export async function getMyOrganizations() {
  try {
    const res = await api.get<{ result?: unknown; organizations?: unknown[] } | unknown[]>("/organizations/my");
    // backend likely returns an array of organizations
    if (Array.isArray(res)) return res;
    return res?.organizations ?? res?.result ?? [];
  } catch {
    return null;
  }
}

export async function switchOrganization(organizationId: string) {
  try {
    const res = await api.post<
      ({ result?: SwitchOrganizationResponse } & SwitchOrganizationResponse)
    >(`/organizations/switch/${organizationId}`, {});
    const data = res?.result ?? res;
    const accessToken = data?.user?.token?.access_token ?? data?.token?.access_token;

    if (accessToken) {
      await setAuthToken(accessToken);
    }

    return data;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const res = await api.get<({ result?: CurrentUserResponse } & CurrentUserResponse)>("/user/me");
    const data = res?.result ?? res;
    return data?.profile ?? data?.user ?? null;
  } catch {
    return null;
  }
}
