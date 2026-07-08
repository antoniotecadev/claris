import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/routing";

const siteName = "Claris";

type PageMetadataParams = {
	title: string;
	description: string;
	pathname: string;
	locale?: Locale;
	index?: boolean;
};

export function buildPageMetadata({
	title,
	description,
	pathname,
	locale,
	index = true,
}: PageMetadataParams): Metadata {
	const cleanPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
	const pathWithoutLocale =
		locale && cleanPathname.startsWith(`/${locale}`)
			? cleanPathname.replace(`/${locale}`, "") || "/"
			: cleanPathname;

	const languages = locales.reduce<Record<string, string>>((acc, currentLocale) => {
		acc[currentLocale] =
			`/${currentLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
		return acc;
	}, {});

	return {
		title,
		description,
		alternates: {
			canonical: cleanPathname,
			languages: {
				...languages,
				"x-default": pathWithoutLocale,
			},
		},
		openGraph: {
			title: `${title} | ${siteName}`,
			description,
			url: cleanPathname,
			siteName,
			type: "website",
		},
		twitter: {
			card: "summary",
			title: `${title} | ${siteName}`,
			description,
		},
		robots: index
			? {
					index: true,
					follow: true,
				}
			: {
					index: false,
					follow: false,
					googleBot: {
						index: false,
						follow: false,
					},
				},
	};
}

export const privateMetadata: Metadata = {
	robots: {
		index: false,
		follow: false,
		googleBot: {
			index: false,
			follow: false,
		},
	},
};
