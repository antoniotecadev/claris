import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/assets/styles/globals.css";
import { MessagesProvider } from "@/i18n/messages";
import { getDictionary } from "@/i18n/dictionaries";
import { defaultLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/layout/theme-provider";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	preload: false,
})

export const metadata: Metadata = {
	title: "Claris",
	description: "Claris é uma plataforma de gestão de comunidades e igrejas, projetada para facilitar a comunicação, organização e engajamento dos membros. Com recursos como gerenciamento de eventos, comunicação em grupo, compartilhamento de recursos e muito mais, o Claris é a solução ideal para líderes comunitários e religiosos que desejam fortalecer suas comunidades e promover um ambiente colaborativo.",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const messages = await getDictionary(defaultLocale);

	return (
		<html
			lang={defaultLocale}
			suppressHydrationWarning
			className={cn("h-full", "antialiased", inter.variable, "font-sans")}
		>
			<body className="min-h-full flex flex-col bg-background text-foreground">
				<ThemeProvider >
					<MessagesProvider locale={defaultLocale} messages={messages}>
						{children}
					</MessagesProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
