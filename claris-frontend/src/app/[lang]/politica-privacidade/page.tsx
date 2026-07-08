import type { Metadata } from "next";
import { getDictionary } from "@/i18n/dictionaries";
import { locales, type Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";

type PageProps = {
	params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { lang } = await params;
	const locale = (locales.includes(lang as Locale) ? lang : locales[0]) as Locale;
	const messages = await getDictionary(locale);

	return buildPageMetadata({
		title: messages.legal.privacy.title,
		description: messages.legal.privacy.sections.overviewText,
		pathname: `/${locale}/politica-privacidade`,
		locale,
	});
}

export { default } from "../../politica-privacidade/page";
