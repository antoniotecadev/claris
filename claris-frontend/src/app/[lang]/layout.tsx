import { MessagesProvider } from "@/i18n/messages";
import { getDictionary } from "@/i18n/dictionaries";
import { locales, type Locale } from "@/i18n/routing";

export async function generateStaticParams() {
	return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
	const { lang } = await params;
	const locale = (locales.includes(lang as Locale) ? lang : locales[0]) as Locale;
	const messages = await getDictionary(locale);

	return (
		<MessagesProvider locale={locale} messages={messages}>
			{children}
		</MessagesProvider>
	);
}
