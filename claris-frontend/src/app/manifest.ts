import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Claris",
		short_name: "Claris",
		description:
			"Plataforma de gestão de comunidades e igrejas para comunicação, organização e engajamento dos membros.",
		start_url: "/",
		scope: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#002045",
		orientation: "portrait-primary",
		icons: [
			{
				src: "/favicon-16x16.png",
				sizes: "16x16",
				type: "image/png",
			},
			{
				src: "/favicon-32x32.png",
				sizes: "32x32",
				type: "image/png",
			},
			{
				src: "/apple-touch-icon.png",
				sizes: "180x180",
				type: "image/png",
			},
			{
				src: "/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "any maskable",
			},
			{
				src: "/android-chrome-512x512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "any maskable",
			},
		],
		categories: ["productivity", "social"],
		lang: "pt",
		dir: "ltr",
	};
}
