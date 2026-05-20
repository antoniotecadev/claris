export default function DashboardPage() {
	return (
		<div className="flex flex-col w-full h-full ">
			<div className="w-full h-64 bg-[url('/assets/heroMain.png')] bg-cover text-white rounded-2xl p-5 gap-2 ">
				<div className="flex  flex-col w-[45%] justify-between h-full p-2">
					<p className="text-[#FFDEA5] font-bold text-[12px]">PAINEL ADMINISTRATIVO</p>
					<p className="text-white italic text-[48px] ">Bem-vindo ao Santuário Digital</p>
					<p className="text-[18px] text-white">
						Gerencie os ministérios, eventos e a comunidade com a serenidade e
						o propósito que nossa missão exige.
					</p>
				</div>
			</div>
			<div className="w-full flex h-157.25 mt-7.5 bg-white">
				<div  className="flex flex-col w-159.75">
					<div className="flex justify-between items-center w-full p-4">
						<div className="flex flex-col ">
							<p className="text-[#002045] font-bold text-[30px]">Gestão de Grupos</p>
							<p className=" tracking-wide text-[#43474E]">Ministérios ativos na Claris</p>
						</div>
						<button className="bg-[#F3F3F3] rounded-2xl h-10 p-2 text-[#002045] w-32 font-bold"> + Novo grupo</button>
					</div>
					<div className="">

					</div>
				</div>

			</div>
		</div>
	)
}


