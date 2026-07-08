import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).delete("auth_token");

  return Response.json({ success: true });
}
