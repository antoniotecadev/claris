import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/assets/styles/globals.css";
import { MessagesProvider } from "@/i18n/messages";
import { getDictionary } from "@/i18n/dictionaries";
import { defaultLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/layout/theme-provider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const metadataBase = new URL(siteUrl);

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	preload: false,
});

export const metadata: Metadata = {
	metadataBase,
	title: {
		default: "Claris",
		template: "%s | Claris",
	},
	description: "Claris é uma plataforma de gestão de comunidades e igrejas, projetada para facilitar a comunicação, organização e engajamento dos membros. Com recursos como gerenciamento de eventos, comunicação em grupo, compartilhamento de recursos e muito mais, o Claris é a solução ideal para líderes comunitários e religiosos que desejam fortalecer suas comunidades e promover um ambiente colaborativo.",
	applicationName: "Claris",
	keywords: [
		"Claris",
		"gestão de igrejas",
		"gestão de comunidades",
		"comunicação comunitária",
		"eventos da igreja",
	],
	authors: [{ name: "Claris" }],
	creator: "Claris",
	publisher: "Claris",
	manifest: "/site.webmanifest",
	icons: {
		icon: [
			{ url: "/favicon.ico" },
			{ url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
			{ url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
		],
		apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
		other: [{ rel: "android-touch-icon", url: "/android-chrome-192x192.png", sizes: "192x192" }],
	},
	alternates: {
		canonical: "/",
		languages: {
			pt: "/pt",
			en: "/en",
			fr: "/fr",
			"x-default": "/",
		},
	},
	openGraph: {
		title: "Claris",
		description: "Plataforma de gestão de comunidades e igrejas para comunicação, organização e engajamento dos membros.",
		url: "/",
		siteName: "Claris",
		type: "website",
		images: [
			{
				url: "/android-chrome-512x512.png",
				width: 512,
				height: 512,
				alt: "Claris",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Claris",
		description: "Plataforma de gestão de comunidades e igrejas para comunicação, organização e engajamento dos membros.",
		images: ["/android-chrome-512x512.png"],
	},
	formatDetection: {
		telephone: false,
		email: false,
		address: false,
	},
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
			data-scroll-behavior="smooth"
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
