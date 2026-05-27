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
				    rgba(26, 54, 93, 0.98) 10%, 
				    rgba(26, 54, 93, 0.80) 50%, 
				    rgba(26, 54, 93, 0.60) 100%
                ), url(${heroImg.src})`
				}}
				className="bg-white bg-center bg-cover flex flex-col justify-center py-12 md:py-20 lg:py-28 min-h-screen md:min-h-auto"
			>
				<div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 justify-between items-center px-4 md:px-6 lg:px-0">
					<div className="flex flex-col justify-center space-y-6 md:space-y-8">
						<p className="text-center lg:text-left text-xs md:text-sm text-[#FDE68A] italic">"Pois Deus não é Deus de desordem, mas de paz."</p>
						<div><span className="inline-block px-3 md:px-4 py-1.5 md:py-2 bg-[#FFDEA5] text-[#5D4201] text-xs md:text-sm tracking-wide rounded-full md:rounded-2xl font-semibold">Tecnologia com propósito</span></div>
						<p className="text-white text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
							Modernize sua administração <br /><span className="text-[#FFDEA5] font-bold">com graça.</span>
						</p>
						<p className="text-[#DBEAFE] text-sm md:text-base lg:text-lg max-w-xl">
							Simplifique o ministério para focar no que realmente
							importa: as pessoas. Uma plataforma completa desenhada
							para a igreja moderna.
						</p>
						<p className="italic text-[#BFDBFE] text-xs md:text-sm max-w-lg">"Lâmpada para os meus pés é tua palavra, e luz para o meu caminho." — Salmos 119:105</p>
					</div>
				</div>

			</section>
			<Conf />
		</>
	);
}