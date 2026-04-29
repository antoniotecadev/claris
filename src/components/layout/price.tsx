import { Check } from "lucide-react";

export default function Prices() {
	return (
		<div className="bg-white py-16">
			<div className="container mx-auto px-4">

				{/* HEADER */}
				<div className="text-center mb-12 space-y-4">
					<h1 className="text-[#1A365D] font-bold text-2xl md:text-4xl">
						Planos que acompanham seu Crescimento
					</h1>

					<p className="text-[#475569] text-base md:text-xl">
						Um plano para cada momento da sua congregação.
					</p>
				</div>

				{/* PRICING GRID */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

					{/* CARD 1 */}
					<div className="bg-[#F3F3F3] rounded-2xl p-6 flex flex-col gap-6">

						<p className="text-[#1A365D] font-bold text-xl">Seed</p>

						<p className="text-[#1A365D] font-bold text-3xl md:text-4xl">
							149 000 kz <span className="text-[#64748B] text-lg">/mês</span>
						</p>

						<div className="space-y-3">
							{["Até 100 Membros", "Gestão de Eventos", "Suporte via Chat"].map((item, i) => (
								<div key={i} className="flex gap-3 items-center">
									<Check size={18} className="text-amber-500" />
									<p className="text-[#475569] text-sm md:text-base">{item}</p>
								</div>
							))}
						</div>

						<button className="border border-[#002045] text-[#002045] rounded-xl py-3 font-bold hover:bg-[#002045] hover:text-white transition">
							Começar Agora
						</button>
					</div>

					{/* CARD 2 (DESTACADO) */}
					<div className="bg-[#002045] rounded-2xl p-6 flex flex-col gap-6 text-white shadow-xl scale-105">

						<p className="font-bold text-xl">Growth</p>

						<p className="font-bold text-3xl md:text-4xl">
							149 000 kz <span className="text-gray-300 text-lg">/mês</span>
						</p>

						<div className="space-y-3">
							{["Membros Ilimitados", "Múltiplos Campus", "Relatórios Financeiros"].map((item, i) => (
								<div key={i} className="flex gap-3 items-center">
									<Check size={18} className="text-amber-400" />
									<p className="text-sm md:text-base">{item}</p>
								</div>
							))}
						</div>

						<button className="bg-[#FFDEA5] text-[#261900] rounded-xl py-3 font-bold hover:opacity-90 transition">
							Começar Agora
						</button>
					</div>

					{/* CARD 3 */}
					<div className="bg-[#F3F3F3] rounded-2xl p-6 flex flex-col gap-6">

						<p className="text-[#1A365D] font-bold text-xl">Seed</p>

						<p className="text-[#1A365D] font-bold text-3xl md:text-4xl">
							149 000 kz <span className="text-[#64748B] text-lg">/mês</span>
						</p>

						<div className="space-y-3">
							{["Até 100 Membros", "Gestão de Eventos", "Suporte via Chat"].map((item, i) => (
								<div key={i} className="flex gap-3 items-center">
									<Check size={18} className="text-amber-500" />
									<p className="text-[#475569] text-sm md:text-base">{item}</p>
								</div>
							))}
						</div>

						<button className="border border-[#002045] text-[#002045] rounded-xl py-3 font-bold hover:bg-[#002045] hover:text-white transition">
							Começar Agora
						</button>
					</div>

				</div>
			</div>
		</div>
	);
}