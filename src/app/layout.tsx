import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "@/assets/styles/globals.css";
import Header from "@/components/layout/header";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/layout/theme-provider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"]
})

export const metadata: Metadata = {
	title: "Claris",
	description: "Claris é uma plataforma de gestão de comunidades e igrejas, projetada para facilitar a comunicação, organização e engajamento dos membros. Com recursos como gerenciamento de eventos, comunicação em grupo, compartilhamento de recursos e muito mais, o Claris é a solução ideal para líderes comunitários e religiosos que desejam fortalecer suas comunidades e promover um ambiente colaborativo.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={cn("h-full", "antialiased", inter.variable, "font-sans", geist.variable)}
		>
			<body className="min-h-full flex flex-col bg-background text-foreground">
				<ThemeProvider>
				{children}
				</ThemeProvider>
				
			</body>
		</html>
	);
}
