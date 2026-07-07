import { NextRequest, NextResponse } from "next/server";
import {
	addLocaleToPathname,
	defaultLocale,
	getLocaleFromPathname,
	removeLocaleFromPathname,
} from "@/i18n/routing";

const PUBLIC_ROUTES = [
	"/",
	"/login",

	"/registerUser",
	"/auth/google/callback",
	"/callback",
	"/termos-condicoes",
	"/politica-privacidade",
	"/contacto-suporte",
	
];
const API_PREFIX = "/api";

const getPreferredLocale = (request: NextRequest) => {
	const header = request.headers.get("accept-language") ?? "";
	const languages = header
		.split(",")
		.map((part) => part.split(";")[0]?.trim())
		.filter(Boolean)
		.map((lang) => lang.toLowerCase());

	for (const lang of languages) {
		const base = lang.split("-")[0] ?? lang;
		if (["pt", "en", "fr"].includes(base)) return base;
	}

	return defaultLocale;
};

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	//console.log("Pathname: ", pathname);

	const localeInPath = getLocaleFromPathname(pathname);
	if (!localeInPath) {
		const locale = getPreferredLocale(request);
		request.nextUrl.pathname = addLocaleToPathname(pathname, locale);
		return NextResponse.redirect(request.nextUrl);
	}

	const pathWithoutLocale = removeLocaleFromPathname(pathname);
	const isPublicRoute = PUBLIC_ROUTES.some(
		(route) => pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
	);

	if (pathname.startsWith(API_PREFIX)) {
		return NextResponse.next();
	}

	const token = request.cookies.get("auth_token")?.value;

	//console.log("Token: ", token);
	//console.log("Is Public Route2: ", isPublicRoute);

	if (!token && !isPublicRoute) {
		return NextResponse.redirect(
			new URL(addLocaleToPathname("/login", localeInPath), request.url)
		);
	}

	if (
		token &&
		["/login", "/codeAuth", "/select-organization"].includes(pathWithoutLocale)
	) {
		return NextResponse.redirect(
			new URL(addLocaleToPathname("/mainDash", localeInPath), request.url)
		);
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