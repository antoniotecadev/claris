import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  (await cookies()).delete("auth_token");
  return Response.json({ success: true });
}

export async function GET(request: Request) {
  (await cookies()).delete("auth_token");
  return NextResponse.redirect(new URL("/login", request.url));
}
