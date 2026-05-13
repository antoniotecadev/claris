// SEM "use client" — é server por defeito
import { api } from "@/lib/api";
import MainDashClient from "./MainDashClient";

interface Church {
  id: string;
  name: string;
  description: string;
  logoUrl: string | null;
  membersCount: number;
}

interface OrganizationRef {
  organizationId: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  role: string;
}

// fetch corre no servidor — sem useEffect, sem loading state
export default async function DashboardPage() {
  // Ambos os fetches correm em paralelo no servidor
  const [orgsData, churches] = await Promise.allSettled([
    api.get<any>("/users/me/organizations"),
    api.get<Church[]>("/churches"),
  ]);

  const organizations: OrganizationRef[] =
    orgsData.status === "fulfilled"
      ? orgsData.value?.organizations ?? orgsData.value ?? []
      : [];

  const churchList: Church[] =
    churches.status === "fulfilled"
      ? (churches.value ?? []).slice(0, 5)
      : [];

  // Passa os dados prontos para o client component
  return (
    <MainDashClient
      organizations={organizations}
      churches={churchList}
    />
  );
}