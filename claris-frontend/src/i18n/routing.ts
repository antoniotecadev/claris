export const locales = ["pt", "en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";

export const isLocale = (value: string): value is Locale =>
	locales.includes(value as Locale);

export const getLocaleFromPathname = (pathname: string): Locale | null => {
	const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
	const [, maybeLocale] = path.split("/");
	return maybeLocale && isLocale(maybeLocale) ? maybeLocale : null;
};

export const removeLocaleFromPathname = (pathname: string): string => {
	const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
	const locale = getLocaleFromPathname(path);
	if (!locale) return path;
	const without = path.replace(`/${locale}`, "") || "/";
	return without.startsWith("/") ? without : `/${without}`;
};

export const addLocaleToPathname = (pathname: string, locale: string): string => {
	const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
	const cleanPath = removeLocaleFromPathname(path);
	return `/${locale}${cleanPath === "/" ? "" : cleanPath}`;
};

export const getDateLocale = (locale: string): string => {
	switch (locale) {
		case "en":
			return "en-GB";
		case "fr":
			return "fr-FR";
		case "pt":
		default:
			return "pt-PT";
	}
};
