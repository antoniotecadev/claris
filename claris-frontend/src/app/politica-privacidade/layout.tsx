import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
	title: "Política de Privacidade",
	description:
		"A Claris respeita a sua privacidade e está comprometida em proteger os seus dados pessoais.",
	pathname: "/politica-privacidade",
});

export default function PoliticaPrivacidadeLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return children;
}
