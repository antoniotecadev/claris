import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
	title: "Termos e Condições",
	description:
		"Consulte os termos de utilização da plataforma Claris e as condições aplicáveis ao serviço.",
	pathname: "/termos-condicoes",
});

export default function TermosCondicoesLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return children;
}
