export default function Prices() {
	return (
		<div className="bg-white">
			<div className="m-auto container">
				<div className="flex flex-col p-10 justify-center items-center gap-6">
					
					<h1 className="text-[#191C1E] font-bold tracking-wide text-2xl">
						Preços pensados com simplicidade e graça.
					</h1>

					<h2 className="text-[#464555]">
						Um plano para cada momento da sua congregação.
					</h2>

					<div className="cards">
						
						<div className="card red">
							<h3 className="text-xl font-bold">Seed</h3>
							<p className="text-3xl font-bold mt-2">R$0<span className="text-sm">/mês</span></p>

							<ul className="mt-4 text-sm space-y-2">
								<li>Até 50 membros</li>
								<li>Calendário básico</li>
								<li>1 administrador</li>
							</ul>

							<button className="mt-6 bg-white text-[#2B3EA2] px-4 py-2 rounded">
								Start for Free
							</button>
						</div>

						<div className="card blue">
							<span className="text-xs bg-white text-[#2B3EA2] px-3 py-1 rounded-full mb-2">
								MOST POPULAR
							</span>

							<h3 className="text-xl font-bold">Growth</h3>
							<p className="text-3xl font-bold mt-2">R$149<span className="text-sm">/mês</span></p>

							<ul className="mt-4 text-sm space-y-2">
								<li>Membros ilimitados</li>
								<li>Gestão financeira</li>
								<li>Chat em tempo real</li>
								<li>Suporte prioritário</li>
							</ul>

							<button className="mt-6 bg-white text-[#2B3EA2] px-4 py-2 rounded cursor-pointer">
								Get Growth
							</button>
						</div>

						<div className="card green">
							<h3 className="text-xl font-bold">Sanctuary</h3>
							<p className="text-3xl font-bold mt-2">R$299<span className="text-sm">/mês</span></p>

							<ul className="mt-4 text-sm space-y-2">
								<li>Tudo no Growth</li>
								<li>App customizado</li>
								<li>Relatórios avançados</li>
								<li>Gerente de sucesso</li>
							</ul>

							<button className="mt-6 bg-white text-[#2B3EA2] px-4 py-2 rounded">
								Contact Sales
							</button>
						</div>

					</div>
				</div>
			</div>
		</div>
	);
}