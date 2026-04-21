import { LucideIcon } from "lucide-react";
import Image from 'next/image'
import { Users, Calendar, MessageSquare, LayoutDashboard, Bell, Building2 } from "lucide-react";
import Simple from "./Simple";
import Sister from "@/assets/images/sisters.png"

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
				<div className="flex flex-col justify-center items-center py-20 space-y-5">
					<h5 className="text-[#1A365D] tracking-wide font-bold  text-4xl">
						Ferramentas desenhadas para o serviço
					</h5>
					<div className="w-50 h-1 bg-amber-300"></div>
					<div className="flex flex-wrap sm:flex sm:flex-row gap-6">
						<div className="w-[70%] border-gray-400 border-solid rounded-2xl bg-[#F1F5F9] gap-2 justify-between flex p-6">
							<div className="flex flex-col w-[50%] gap-2">
								<div className="flex items-center justify-center w-12 h-12 bg-[#BDD6FF] rounded-2xl">
									<Users size={24} className="text-[#1A365D]" />
								</div>
								<p className=" text-[#1A365D]">Gestão de membros</p>
								<p className="text-[#475569] text-[12px]">Uma visão 360º da sua congregação.
									Acompanhe jornadas espirituais, participação
									em grupos e batismos com cuidado pastoral.</p>
							</div>
							<div>
								<Image src={Sister} alt="Sisters" className="h-full w-full rounded-2xl" />
							</div>
						</div>
						<div className="bg-[#1A365D] w-[24%] p-3 flex flex-col">
							<div className="flex items-center justify-center w-12 h-12 bg-[#DBEAFE] rounded-2xl">
								<Calendar size={24} className="text-[#FFDEA5]" />
							</div>
							<p className="text-white">Calendário</p>
							<p className="text-[#DBEAFE] text-[9px]">Sincronize eventos de todos os
								departamentos em um único lugar
								sagrado.
							</p>
						</div>
					</div>


				</div>
			</div>
			<Simple />
		</div>

	)
}
