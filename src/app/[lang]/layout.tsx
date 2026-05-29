import type { Metadata } from "next";
import { MessagesProvider } from "@/i18n/messages";
import { getDictionary } from "@/i18n/dictionaries";
import { locales, type Locale } from "@/i18n/routing";

export const metadata: Metadata = {
	title: "Claris",
	description:
		"Claris é uma plataforma de gestão de comunidades e igrejas, projetada para facilitar a comunicação, organização e engajamento dos membros. Com recursos como gerenciamento de eventos, comunicação em grupo, compartilhamento de recursos e muito mais, o Claris é a solução ideal para líderes comunitários e religiosos que desejam fortalecer suas comunidades e promover um ambiente colaborativo.",
};

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
