import { NextRequest, NextResponse } from "next/server";
const PUBLIC_ROUTES = ["/", "/login", "/registerAdmim", "/registerUser", "/codeAuth", ""];
const API_PREFIX = "/api";

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	console.log("Pathname: ", pathname);
	const isPublicRoute = PUBLIC_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`)
	);

	if (pathname.startsWith(API_PREFIX)) {
		return NextResponse.next();
	}

	const token = request.cookies.get("auth_token")?.value;

	console.log("Token: ", token);
	console.log("Is Public Route: ", isPublicRoute);

	if (!token && !isPublicRoute) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (token && ["/login", "/codeAuth", "/select-organization"].includes(pathname)) {
		return NextResponse.redirect(new URL("/mainDash", request.url));
	}

	const requestHeaders = new Headers(request.headers);
	if (token) {
		requestHeaders.set("Authorization", `Bearer ${token}`);
	}

	return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\.(?:png|jpg|jpeg|gif|svg|webp)$).*)',
	],
}