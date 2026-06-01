import { cookies } from "next/headers";

export async function POST() {
    console.log("Logout endpoint called");
  (await cookies()).delete("auth_token");

  return Response.json({ success: true });
}