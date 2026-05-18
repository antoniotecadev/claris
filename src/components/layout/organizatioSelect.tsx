"use client"

import { api } from "@/lib/api";
import { useEffect, useState } from "react";

interface OrganizatioSelectProps {
  id: string;
  name: string;
}

export default function OrganizatioSelect({ className }: { className?: string }) {
    const [selectedOrganization, setSelectedOrganization] = useState<OrganizatioSelectProps[]>([]);
    const [selected, setSelected] = useState<string>("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);

        api.get<{ organizations: OrganizatioSelectProps[] }>("/organizations")
            .then((res) => {
                setSelectedOrganization(res.organizations);
            })
            .finally(() => setLoading(false));
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        
        <div>
            <select name="organization" id="organization" value={selected} onChange={(e) => setSelected(e.target.value)}>
                <option value="">Select an organization</option>
                {selectedOrganization.map((org) => (
                    <option key={org.id} value={org.id}>
                        {org.name}
                    </option>
                ))}
            </select>
        </div>
    )
}