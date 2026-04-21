import Image from "next/image";
import igreja from "@/assets/images/unnamed.png";
import Conf from "./conf";
import heroImg from "@/assets/images/hero.png";

export default function Hero() {
	return (
		<section
			style={{
				backgroundImage: `linear-gradient(
                   to right, 
				    rgba(26, 54, 93, 0.98) 10%, 
				    rgba(26, 54, 93, 0.80) 50%, 
				    rgba(26, 54, 93, 0.60) 100%
                ), url(${heroImg.src})`
			}}
			className="bg-white bg-center bg-cover min-h-screen flex flex-col justify-center"
		>
			<div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 justify-between items-start pt-10 px-6 mb-4">
				<div className="flex flex-col  justify-center space-y-12">
					<div><span className="px-2 py-1 bg-[#FFDEA5] text-[#5D4201] tracking-wide rounded-2xl ">Tecnológia com propósito</span></div>
					<p className="text-white text-3xl wrap-break-word sm:text-5xl xl:text-6xl font-bold">
						Modernize sua administração <br /><span className="text-[#FFDEA5] font-bold">com graça.</span>
					</p>
					<p className="text-[#DBEAFE] sm:text-xl sm:w-100">
						Simplifique o ministério para focar no que realmente
						importa: as pessoas. Uma plataforma completa desenhada
						para a igreja moderna.
					</p>
					<div className="flex gap-2">
						<button className="px-10 py-3 text-[#261900] rounded-xl bg-[#FFDEA5] ">
							Começar
						</button>
						<button className="px-6 py-2 rounded-xl bg-[#a2c6f1]  text-gray-800">
							Ver demostração
						</button>
						
					</div>
					<p className="italic text-[#BFDBFE] sm:w-100">"Lâmpada para os meus pés é tua palavra, e luz para o meu caminho." — Salmos 119:105</p>
				</div>
			</div>
			<Conf />
		</section>
	);
}