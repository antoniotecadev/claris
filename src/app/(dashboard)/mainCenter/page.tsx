import { de } from "zod/locales";
import Image from "next/image";
import icon from "@/assets/images/logoSem.png";
import { Users , Mic } from "lucide-react";





export default function MainCenter() {
	return (
		<div className="bg-white h-screen">
			<div className="  w-[256px] h-screen  bg-[#e7ebf1]">
				<div className="flex flex-col gap-4 p-4">
					<div className="flex items-center gap-4">
						<Image src={icon} alt="Administrador" width={32} height={32} />
						<p className="text-[#1E3A8A] text-[20px] font-bold">Claris</p>
					</div>
					<div className="flex items-center gap-4">

						<p className="text-[#475F83] text-[14px]">Administrador</p>
					</div>
					<div className="flex flex-col text-[#43474E] py-9 gap-4">
						<div className="bg-white p-6 rounded-2xl flex  justify-center items-center w-49.25 h-10.25 gap-3">
							<Users size={24} />
							<p className="">Mistérios</p>
						</div>
						<div className="bg-white p-6 rounded-2xl flex  justify-center items-center w-49.25 h-10.25">
							<Mic size={24}/>
							<p className="">Mistérios</p>
						</div>
						<div className="bg-white p-6 rounded-2xl flex  justify-center items-center w-49.25 h-10.25">
							<p className="">Mistérios</p>
						</div>
						<div className="bg-white p-6 rounded-2xl flex  justify-center items-center w-49.25 h-10.25">
							<p className="">Mistérios</p>
						</div>

					</div>
				</div>
				<div className="h-px bg-zinc-400 w-full" />
				<div className="flex flex-col gap-4 p-4">
					<p className="text-[#1E3A8A] text-[16px] font-bold">Atividades Recentes</p>
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-3">
							<div className="w-6 h-6 bg-[#1E3A8A] rounded-full" />
							<p className="text-[#475F83] text-[14px]">João Silva atualizou o evento "Culto de Domingo".</p>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-6 h-6 bg-[#1E3A8A] rounded-full" />
							<p className="text-[#475F83] text-[14px]">Maria Santos adicionou um novo membro à igreja "Igreja da Paz".</p>
						</div>
						<div className="flex items-center gap-3">
							<div className="w-6 h-6 bg-[#1E3A8A] rounded-full" />
							<p className="text-[#475F83] text-[14px]">Carlos Oliveira compartilhou um recurso na comunidade "Igreja do Amor".</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}