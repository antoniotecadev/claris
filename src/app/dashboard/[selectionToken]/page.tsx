import { getOrganizations } from "@/utils/actionMain";

export default async function Page({
  params,
}: {
  params: { selectionToken: string };
}) {
  const data = await getOrganizations(params.selectionToken);

  return (
    <div>
      <h1>Dashboard</h1>

      <ul>
        {data?.organizations.map((igreja: any) => (
          <li key={igreja.id}>{igreja.name}</li>
        ))}
      </ul>
    </div>
  );
}


