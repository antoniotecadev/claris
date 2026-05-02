"use server";
import axios from "axios";

export async function getOrganizations(selectionToken: string) {
  if (!selectionToken) return null;

  try {
    const res = await axios.post(
      "http://localhost:3001/v1/api/auth/organization/options",
      { selectionToken }
    );
    return res.data?.result;
  } catch (error: any) {
    console.error("Erro:", error?.response?.data);
    return null;
  }
}

export async function selectOrganization(selectionToken: string, organizationId: string) {
  try {
    const res = await axios.post(
      "http://localhost:3001/v1/api/auth/organization/select",
      { selectionToken, organizationId }
    );
    return res.data?.result;
  } catch (error: any) {
    console.error("Erro:", error?.response?.data);
    return null;
  }
}