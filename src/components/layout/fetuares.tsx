import Image from "next/image";
import { Users, Calendar, MessageSquare, Heart } from "lucide-react";

import Simple from "./Simple";
import Sister from "@/assets/images/sisters.png";
import Rnascer from "@/assets/images/renascer.png";
import BackG from "@/assets/images/Background.png";
import Esp from "@/assets/images/Container.png";

export default function Fun() {
	return (
		<div className="bg-white">
			<div className="container mx-auto px-4">

				{/* HEADER */}
				<div className="flex flex-col items-center text-center py-16 space-y-4">
					<h5 className="text-[#1A365D] font-bold text-2xl md:text-4xl">
						Ferramentas desenhadas para o serviço
					</h5>
					<div className="w-24 h-1 bg-amber-300"></div>
				</div>

				{/* TOP GRID */}
				<div className="flex flex-col lg:flex-row gap-6">

					{/* CARD 1 */}
					<div className="w-full lg:w-2/3 bg-[#F1F5F9] rounded-2xl p-6 md:p-10 flex flex-col md:flex-row gap-6">
						
						<div className="md:w-1/2 space-y-4">
							<div className="flex items-center justify-center w-12 h-12 bg-[#BDD6FF] rounded-2xl">
								<Users size={24} className="text-[#1A365D]" />
							</div>

							<p className="text-[#1A365D] text-xl md:text-2xl">
								Gestão de membros
							</p>

							<p className="text-[#475569] text-base md:text-lg">
								Uma visão 360º da sua congregação. Acompanhe jornadas espirituais,
								participação em grupos e batismos com cuidado pastoral.
							</p>
						</div>

						<div className="md:w-1/2">
							<Image
								src={Sister}
								alt="Sisters"
								className="w-full h-auto rounded-2xl"
							/>
						</div>
					</div>

					{/* CARD 2 */}
					<div className="w-full lg:w-1/3 bg-[#1A365D] rounded-2xl p-6 md:p-8 flex flex-col gap-4">
						<div className="flex items-center justify-center w-12 h-12 bg-[#DBEAFE] rounded-2xl">
							<Calendar className="text-[#1A365D]" />
						</div>

						<p className="text-white text-xl md:text-2xl">Calendário</p>

						<p className="text-[#DBEAFE] text-base md:text-lg">
							Sincronize eventos de todos os departamentos em um único lugar sagrado.
						</p>

						<Image
							src={Rnascer}
							alt="Reviver"
							className="w-full h-auto"
						/>
					</div>
				</div>

				{/* BOTTOM GRID */}
				<div className="flex flex-col lg:flex-row gap-6 mt-6">

					{/* CARD 3 */}
					<div className="w-full lg:w-1/3 bg-[#F3F3F3] rounded-2xl p-6 md:p-10 flex flex-col gap-4">

						<div className="bg-[#FFDEA5] p-3 w-12 flex items-center justify-center rounded-2xl">
							<Heart size={24} className="text-[#5D4201]" />
						</div>

						<p className="text-xl md:text-2xl text-[#1A365D]">
							Doações e Dízimos
						</p>

						<p className="text-base md:text-lg text-[#475569]">
							Gestão financeira transparente e doações recorrentes seguras via aplicativo.
						</p>

						<Image src={BackG} alt="Back" className="w-full h-auto" />
					</div>

					{/* CARD 4 */}
					<div className="w-full lg:w-2/3 bg-[#F1F5F9] rounded-2xl p-6 md:p-10 flex flex-col md:flex-row gap-6">

						<div className="md:w-1/2 space-y-6">
							<div className="bg-[#BDD6FF] w-10 p-2 rounded">
								<MessageSquare size={24} className="text-[#1A365D]" />
							</div>

							<p className="text-xl md:text-2xl text-[#1A365D]">
								Comunicação Viva
							</p>

							<p className="text-base md:text-lg text-[#475569]">
								Conecte pequenos grupos e lideranças instantaneamente.
							</p>

							<p className="italic text-[#94A3B8] text-sm md:text-base">
								"Como o ferro com o ferro se afia..." — Provérbios 27:17
							</p>
						</div>

						<div className="md:w-1/2 flex justify-center items-center">
							<Image src={Esp} alt="container" className="w-full h-auto" />
						</div>
					</div>
				</div>

				<Simple />
			</div>
		</div>
	);
}