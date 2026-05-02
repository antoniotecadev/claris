import { getOrganizations } from "@/utils/actionMain";

export default async function Page({
  params,
}: {
  params: { selectionToken: string };
}) {
  const organizations = await getOrganizations(params.selectionToken);

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {organizations.map((igreja) => (
          <li key={igreja.id}>{igreja.name}</li>
        ))}
      </ul>
    </div>
  );
}