import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const baseUrl = siteUrl.replace(/\/$/, "");

const publicRoutes = [
	"/",
	"/contacto-suporte",
	"/politica-privacidade",
	"/termos-condicoes",
];

export default function sitemap(): MetadataRoute.Sitemap {
	const staticEntries = publicRoutes.map((pathname) => ({
		url: `${baseUrl}${pathname}`,
		lastModified: new Date(),
		changeFrequency: "weekly" as const,
		priority: pathname === "/" ? 1 : 0.7,
	}));

	const localizedEntries = locales.flatMap((locale) =>
		publicRoutes.map((pathname) => ({
			url: `${baseUrl}/${locale}${pathname === "/" ? "" : pathname}`,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: pathname === "/" ? 0.9 : 0.6,
		})),
	);

	return [...staticEntries, ...localizedEntries];
}