export default function ContactoSuportePage() {
	return (
		<main className="min-h-screen bg-gray-50">
			<section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
				<div className="max-w-3xl">
					<h1 className="text-3xl md:text-4xl font-bold text-[#1A365D]">
						Contacto de Suporte
					</h1>
					<p className="text-gray-500 mt-2">
						Estamos aqui para ajudar. Responderemos o mais breve possível.
					</p>

					<div className="mt-8 grid gap-6">
						<div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
							<h2 className="text-lg font-semibold text-[#1A365D]">Canais de contacto</h2>
							<ul className="mt-3 space-y-2 text-gray-700">
								<li>
									<span className="font-medium">Email:</span> suporte@claris.app
								</li>
								<li>
									<span className="font-medium">Telefone:</span> +351 21 000 0000
								</li>
								<li>
									<span className="font-medium">Horário:</span> Seg–Sex, 09:00–18:00
								</li>
							</ul>
						</div>

						<div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
							<h2 className="text-lg font-semibold text-[#1A365D]">Informações úteis</h2>
							<p className="mt-2 text-gray-700">
								Para acelerar o atendimento, envie o máximo de detalhes possível,
								como organização, descrição do problema e capturas de ecrã.
							</p>
						</div>

						<div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
							<h2 className="text-lg font-semibold text-[#1A365D]">Status do serviço</h2>
							<p className="mt-2 text-gray-700">
								Verifique atualizações e manutenções programadas no nosso painel
								de status antes de abrir um pedido.
							</p>
							<button className="mt-4 text-[#2B3EA2] font-medium hover:underline">
								Ver status
							</button>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
