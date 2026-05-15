import { NextRequest, NextResponse } from "next/server";
import { setAuthToken } from "@/lib/auth-cookies";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing_token", request.url));
  }

  await setAuthToken(token);

  return NextResponse.redirect(new URL("/mainDash", request.url));
}