import { Users, Calendar, Check } from "lucide-react";

export default function Prices() {
	return (
		<div className="bg-white">
			<div className="m-auto container">
				<div className="flex flex-col p-10 justify-center items-center gap-6">

					<h1 className="text-[#1A365D] font-bold tracking-wide text-4xl">
						Planos que acompanham seu Crescimento
					</h1>

					<h2 className="text-[#475569] text-[20px]">
						Um plano para cada momento da sua congregação.
					</h2>
					<div className="flex justify-between  w-full">
						<div className="flex gap-4 justify-between w-full items-center">
							<div className="bg-[#F3F3F3] flex flex-col gap-4 rounded-2xl  h-120 space-y-3 p-5 w-120" >
								<p className="text-[#1A365D]  font-bold text-[20px]">Seed</p>
								<p className="text-[#1A365D] font-bold text-[40px] ">R$ 149 <span className="text-[#64748B] text-[24px]">/mês</span></p>
								<div className="flex flex-col gap-3 space-y-2 p-2">
									<div className="flex gap-3 ">
										<Check size={22} className="text-amber-500 font-bold" />
										<p className="text-[#475569] text-[24px]">Até 100 Membros</p>
									</div>
									<div className="flex gap-3 ">
										<Check size={22} className="text-amber-500 font-bold" />
										<p className="text-[#475569] text-[24px]">Gestão de Eventos</p>
									</div>
									<div className="flex gap-3 ">
										<Check size={22} className="text-amber-500 font-bold" />
										<p className="text-[#475569] text-[24px]">Suporte via Chat</p>
									</div>
								</div>
								<div className="flex items-center justify-center p-4">
									<button className="p-3 border-solid border-[1px] border-[#002045] rounded-2xl text-[#002045] font-bold cursor-pointer hover:bg-[#002045] hover:text-white transition-discrete duration-500 w-full">
										Começar Agora
									</button>
								</div>
							</div>

							<div className="bg-[#002045] flex flex-col gap-4 rounded-2xl space-y-3 p-10 h-130 w-150" >
								<p className="text-white  font-bold text-[20px]">Growth</p>
								<p className="text-white font-bold text-[40px] ">R$ 149 <span className="text-[#64748B] text-[24px]">/mês</span></p>
								<div className="flex flex-col gap-3 space-y-2">
									<div className="flex gap-3 ">
										<Check size={22} className="text-amber-500 font-bold" />
										<p className="text-white text-[24px]">Membros Ilimitados</p>
									</div>
									<div className="flex gap-3 ">
										<Check size={22} className="text-amber-500 font-bold" />
										<p className="text-white text-[24px]">Múltiplos Campus</p>
									</div>
									<div className="flex gap-3 ">
										<Check size={22} className="text-amber-500 font-bold" />
										<p className="text-white text-[24px]">Relatórios Financeiros</p>
									</div>

								</div>
								<div className="flex items-center justify-center p-4">
									<button className="p-5 border-solid border-[1px] bg-[#FFDEA5] border-[#261900] rounded-2xl  font-bold cursor-pointer text-[#261900]  w-full">
										Começar Agora
									</button>
								</div>
							</div>

							<div className="bg-[#F3F3F3] flex flex-col gap-4 rounded-2xl   h-120 space-y-3 p-5 w-120" >
								<p className="text-[#1A365D]  font-bold text-[20px]">Seed</p>
								<p className="text-[#1A365D] font-bold text-[40px] ">R$ 149 <span className="text-[#64748B] text-[24px]">/mês</span></p>
								<div className="flex flex-col gap-3 space-y-2 p-2">
									<div className="flex gap-3 ">
										<Check size={22} className="text-amber-500 font-bold" />
										<p className="text-[#475569] text-[24px]">Até 100 Membros</p>
									</div>
									<div className="flex gap-3 ">
										<Check size={22} className="text-amber-500 font-bold" />
										<p className="text-[#475569] text-[24px]">Gestão de Eventos</p>
									</div>
									<div className="flex gap-3 ">
										<Check size={22} className="text-amber-500 font-bold" />
										<p className="text-[#475569] text-[24px]">Suporte via Chat</p>
									</div>
								</div>
								<div className="flex items-center justify-center p-4">
									<button className="p-3 border-solid border-[1px] border-[#002045] rounded-2xl text-[#002045] font-bold cursor-pointer hover:bg-[#002045] hover:text-white transition-discrete duration-500 w-full">
										Começar Agora
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}