import { LucideIcon } from "lucide-react";
import Image from 'next/image'
import { Users, Calendar, MessageSquare, LayoutDashboard, Heart, Building2 } from "lucide-react";
import Simple from "./Simple";
import Sister from "@/assets/images/sisters.png"
import Rnascer from "@/assets/images/renascer.png"
import BackG from "@/assets/images/Background.png"
import Esp from "@/assets/images/Container.png"

interface FunctCard {
	title: string;
	description: string;
	icon: LucideIcon;
	iconBgColor: string;

}



function Card({ title, description, icon: Icon, iconBgColor = "[bg-[#EEF2FF]" }: FunctCard) {
	return (
		<div className="w-full max-w-[320px] bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col items-start transition-all hover:scale-[1.02]">

			{/* Ícone Dinâmico */}
			<div className={`w-12 h-12 mb-6 flex items-center justify-center rounded-xl ${iconBgColor} text-[#5C00CA]`}>
				<Icon size={24} />
			</div>

			<h3 className="text-[#191C1E] font-bold text-xl mb-3">
				{title}
			</h3>

			<p className="text-gray-500 text-sm leading-relaxed text-left">
				{description}
			</p>
		</div>
	);
}

export default function Fun() {

	return (
		<div className="bg-white">
			<div className="m-auto container">
				<div className="flex flex-col">
					<div className="flex flex-col justify-center items-center py-20 space-y-6">
						<h5 className="text-[#1A365D] tracking-wide font-bold  text-4xl">
							Ferramentas desenhadas para o serviço
						</h5>
						<div className="w-50 h-1 bg-amber-300"></div>
						<div className="flex flex-wrap w-full justify-between sm:flex sm:flex-row gap-2">
							<div className="w-[70%] h-93.5 border-gray-400 border-solid rounded-2xl bg-[#F1F5F9] gap-2 justify-between flex p-6 ">
								<div className="flex flex-col w-[50%] gap-2 space-y-4">
									<div className="flex items-center justify-center w-12 h-12 bg-[#BDD6FF] rounded-2xl">
										<Users size={24} className="text-[#1A365D]" />
									</div>
									<p className=" text-[#1A365D] text-2xl">Gestão de membros</p>
									<p className="text-[#475569] text-[20px]">Uma visão 360º da sua congregação.
										Acompanhe jornadas espirituais, participação
										em grupos e batismos com cuidado pastoral.</p>
								</div>
								<div>
									<Image src={Sister} alt="Sisters" className="h-full w-full rounded-2xl" />
								</div>
							</div>
							<div className="bg-[#1A365D] h-112	 w-[29%] p-10 flex flex-col space-y-4 rounded-2xl">
								<div className="flex items-center justify-center w-12 h-12 bg-[#DBEAFE] rounded-2xl">
									<Calendar className="text-[#f5bf63]" />
								</div>
								<p className="text-white text-2xl">Calendário</p>
								<p className="text-[#DBEAFE] text-[20px]">Sincronize eventos de todos os
									departamentos em um único lugar
									sagrado.
								</p>
								<Image src={Rnascer} alt="Reviver" className="w-100 h-50" />
							</div>
						</div>
					</div>
					<div className="flex gap-6 justify-between items-center">
						<div className="w-[30%] flex flex-col gap-5 h-112 bg-[#F3F3F3] p-15 rounded-2xl ">
							<div className="bg-[#FFDEA5] p-3 w-15 flex items-center justify-center rounded-2xl">
								<Heart size={24} className="text-[#5D4201]" />
							</div>
							<p className="text-2xl text-[#1A365D]">Doações e Dízimos</p>
							<p className="text-[20px] text-[#475569] ">Gestão financeira transparente e
								doações recorrentes seguras via
								aplicativo para sustentar a obra.</p>
							<Image src={BackG} alt="Back" className="h-35" />
						</div>
						<div className="flex  w-[70%] bg-[#F1F5F9] h-112  p-10 gap-2 items-center justify-center rounded-2xl">
							<div className="w-[50%] space-y-8 flex flex-col">
								<div className="bg-[#BDD6FF] w-10 p-2">
									<MessageSquare size={24} className="text-[#1A365D]" />
								</div>
								<p className="text-2xl text-[#1A365D]">Comunicação Viva</p>
								<p className="text-[20px] text-[#475569] ">Conecte pequenos grupos e lideranças
									instantaneamente em um ambiente seguro.</p>
								<p className="italic text-[#94A3B8] text-[15px]">"Como o ferro com o ferro se afia, assim o homem afia o
									rosto do seu amigo." — Provérbios 27:17</p>
							</div>
							<div className="flex justify-center items-center">
								<Image src={Esp} alt="container" className="w-100 h-60"/>
							</div>
						</div>

					</div>

				</div>
			</div>
			<Simple />
		</div>

	)
}
