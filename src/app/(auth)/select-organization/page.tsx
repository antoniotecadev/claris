"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { selectOrganization } from "@/utils/actionMain";
import { getOrganizations } from "@/utils/actionMain";
import { useEffect, useState } from "react";

interface Organization {
  organizationId: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  role: string;
}

export default function SelectOrganizationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectionToken = searchParams.get("selectionToken") || "";

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrganizations(selectionToken).then((data) => {
      setOrganizations(data?.organizations || []);
      setLoading(false);
    });
  }, [selectionToken]);

  async function handleSelect(organizationId: string) {
    setSelecting(true);
    try {
      const data = await selectOrganization(selectionToken, organizationId);
      const accessToken = data?.user?.token?.access_token ?? data?.token?.access_token;

      if (accessToken) {
        router.push("/mainDash");
      } else {
        setError("Erro ao selecionar organização.");
      }
    } catch {
      setError("Erro inesperado.");
    } finally {
      setSelecting(false);
    }
  }

  if (loading) return <p className="text-center mt-10">A carregar...</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#E5E5E5]">
      <div className="bg-white rounded-2xl p-8 w-96 shadow-md">
        <h1 className="text-2xl font-serif italic text-black mb-2">Selecionar Igreja</h1>
        <p className="text-[#43474E] mb-6">Escolha a organização à qual pretende aceder.</p>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <ul className="flex flex-col gap-3">
          {organizations.map((org) => (
            <li key={org.organizationId}>
              <button
                onClick={() => handleSelect(org.organizationId)}
                disabled={selecting}
                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-[#002045] hover:text-white transition-colors disabled:opacity-50"
              >
                <p className="font-medium">{org.name}</p>
                <p className="text-sm opacity-70">{org.role}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}