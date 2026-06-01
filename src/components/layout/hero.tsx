"use client";
import Image from "next/image";
import igreja from "@/assets/images/unnamed.png";
import Conf from "./conf";
import heroImg from "@/assets/images/hero.png";

export default function Hero() {
	return (
		<>

			<section
				style={{
					backgroundImage: `linear-gradient(
						to right,
						rgba(15, 23, 42, 0.96) 8%,
						rgba(15, 23, 42, 0.78) 52%,
						rgba(15, 23, 42, 0.56) 100%
					), url(${heroImg.src})`
				}}
				className="relative overflow-hidden bg-slate-50 bg-center bg-cover flex flex-col justify-center py-12 md:py-20 lg:py-28 min-h-screen md:min-h-auto dark:bg-slate-950"
			>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.12),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.14),_transparent_30%)]" />
				<div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/10 dark:from-white/0 dark:via-transparent dark:to-black/30" />
				<div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 justify-between items-center px-4 md:px-6 lg:px-0">
					<div className="relative flex flex-col justify-center space-y-6 md:space-y-8 rounded-3xl border border-white/10 bg-slate-950/40 p-6 md:p-10 shadow-[0_24px_80px_rgba(2,6,23,0.35)] backdrop-blur-md">
						<p className="text-center lg:text-left text-xs md:text-sm text-amber-200 italic">"Pois Deus não é Deus de desordem, mas de paz."</p>
						<div><span className="inline-block px-3 md:px-4 py-1.5 md:py-2 bg-white/10 text-amber-100 text-xs md:text-sm tracking-wide rounded-full md:rounded-2xl font-semibold ring-1 ring-white/10">Tecnologia com propósito</span></div>
						<p className="text-white text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight drop-shadow-sm">
							Modernize sua administração <br /><span className="text-[#FFDEA5] font-bold">com graça.</span>
						</p>
						<p className="text-slate-200 text-sm md:text-base lg:text-lg max-w-xl leading-relaxed">
							Simplifique o ministério para focar no que realmente
							importa: as pessoas. Uma plataforma completa desenhada
							para a igreja moderna.
						</p>
						<p className="italic text-slate-300 text-xs md:text-sm max-w-lg">"Lâmpada para os meus pés é tua palavra, e luz para o meu caminho." — Salmos 119:105</p>
					</div>
				</div>

			</section>
			<Conf />
		</>
	);
}