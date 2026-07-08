import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
	title: "Contacto de Suporte",
	description: "Estamos aqui para ajudar. Responderemos o mais breve possível.",
	pathname: "/contacto-suporte",
});

export default function ContactoSuporteLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return children;
}
