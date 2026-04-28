import Image from "next/image";
import Logo from "@/assets/images/lobo-SE.png"
import Google from "@/assets/images/SVG.png"
import { ArrowRight } from "lucide-react";

export default function Login() {
	const handleSelect = (e : any) =>
	{
		console.log(e);
	}
	const arrr = ["Anmanha", "hoje", "ontem"];
	return (
		<div >
			<select name="" id="">
				{arrr.map((ee) => (<option onSelect={handleSelect} value="">${ee}</option>)
				)}
			</select>
			<div >
				<div className="bg-[#E5E5E5]">
					<div className="container m-auto  flex flex-col justify-center items-center h-screen ">
						<section className="  flex  w-7xl h-291.5 ">
							<div className="side2 w-10 h-full flex justify-between flex-col  p-5">
								<div className="flex gap-2 p-5  items-center">
									<Image src={Logo} alt="" className="w-20 h-full" />
									<p className="text-white text-4xl">CLARIS</p>
								</div>
								<div className="flex flex-col gap-3 items-center justify-center">
									<p className="text-[#FFDEA5] tracking-wide text-[30px]">Escrituras para hoje</p>
									<p className="italic text-white   text-[50px] text-center font-serif">"Que tudo seja feito
										com decência e ordem”
									</p>
									<p className="text-[#86A0CD] text-[24px]">— 1 Coríntios 14:40</p>
								</div>
								<div className="flex justify-around text-white">
								</div>
							</div>
							<div className="w-full  h-full flex flex-col justify-center items-center gradientes">
								<div className="w-159 h-181 flex flex-col">
									<p className="text-3xl text-black font-serif italic mb-4">Comece sua jornada de gestão.</p>
									<p className="text-[#43474E] mb-12">Crie uma conta administrativa para gerenciar a presença digital da sua igreja.</p>
									<div className="flex gap-3 mb-6">
										<p className="bg-[#FFDEA5] text-[#1A1C1C] px-4 rounded-2xl"> 1</p>
										<p className="text-[#002045]">Dados pessoais</p>
									</div>
									<div className="flex ">
										<form action="" className="flex flex-col  w-full">
											<div className="flex justify-between gap-3">
												<div className="flex flex-col">
													<label htmlFor="fullNmae" className="mb-1 text-[#43474E]">Nome completo</label>
													<input type="text" id="fullNmae" placeholder="ex. Delson Pedro" className="text-[#6B7280]  bg-white rounded-2xl h-13.5 p-4" />
													<label htmlFor="pass" className="mb-1 text-[#43474E]">Senha</label>
													<input type="password" id="pss" placeholder="........" className="text-[#74777F] bg-white rounded-2xl h-13.5 p-4 mb-1" />
													<label htmlFor="passC" className="mb-1 text-[#43474E]">Confirmar senha</label>
													<input type="password" id="pssC" placeholder="........" className="text-[#74777F] bg-white rounded-2xl h-13.5 p-4 mb-10" />
												</div>
												<div className="flex flex-col">
													<label htmlFor="fullNmae" className="mb-1 text-[#43474E]">E-mail</label>
													<input type="text" id="fullNmae" placeholder="ex. delsonpedro@church.com" className="text-[#6B7280]  bg-white rounded-2xl h-13.5 p-4 mb-1" />
													<label htmlFor="tel" className="mb-1 text-[#43474E]">Telefone</label>
													<input type="password" id="tel" placeholder="9xx xxx xxx" className="text-[#74777F] bg-white rounded-2xl h-13.5 p-4 mb-1" />
													<label htmlFor="photo" className="mb-1 text-[#43474E]">Foto</label>
													<input type="file" accept="image/png"  id="photo" placeholder="9xx xxx xxx" className="text-[#74777F] bg-white rounded-2xl h-13.5 p-4 mb-11" />
												</div>
											</div>
											<div className="flex gap-3 mb-6">
												<p className="bg-[#FFDEA5] text-[#1A1C1C] px-4 rounded-2xl">2</p>
												<p className="text-[#002045]">Dados da igreja</p>
											</div>
											<div className="flex justify-between gap-3">
												<div className="flex flex-col">
													<label htmlFor="fullNmae" className="mb-1 text-[#43474E]">Nome da igreja</label>
													<input type="text" id="fullNmae" placeholder="ex. Jesus Cristo" className=" text-[#74777F] bg-white rounded-2xl h-13.5 p-4 mb-1" />
													<label htmlFor="pass" className="mb-1 text-[#43474E]">Senha</label>
													<input type="password" id="pss" placeholder="........" className="text-[#74777F] bg-white rounded-2xl h-13.5 p-4 mb-1" />
												</div>
												<div className="flex flex-col">
													<label htmlFor="fullNmae" className="mb-1 text-[#43474E]">E-mail</label>
													<input type="text" id="fullNmae" placeholder="ex. delsonpedro@church.com" className="text-[#6B7280]  bg-white rounded-2xl h-13.5 p-4" />
													<label htmlFor="tel" className="mb-1 text-[#43474E]">Telefone</label>
													<input type="password" id="tel" placeholder="9xx xxx xxx" className="text-[#74777F] bg-white rounded-2xl h-13.5 p-4 " />
												</div>
											</div>
										</form>
									</div>
									<form action="" className="flex flex-col">
										<label htmlFor="email" className="text-[#43474E] mb-2.25">EMAIL ADDRESS</label>
										<input type="email" id="email" placeholder="ex pastor@claris.org " className="text-[#74777F] bg-white rounded-2xl h-13.5 p-4 mb-6" />
										<label htmlFor="pss" className="text-[#43474E] flex justify-between mb-2.25">
											<p>SENHA</p>
											<p className="text-[#002045] hover:cursor-pointer">Esqueceu sua senha?</p>
										</label>
										<input type="password" id="pss" placeholder="........" className="text-[#74777F] bg-white rounded-2xl h-13.5 p-4 mb-6" />

										<button className="bg-[#002045] flex justify-center items-center gap-2 text-white h-14 rounded-2xl mb-10 hover:cursor-pointer">
											<p>ENTRAR</p>
											<ArrowRight size={20} />
										</button>
										<div className="w-full h-px bg-gray-400 mb-10"></div>
										<p className="text-[#43474E] text-center mb-12 ">Primeira vez aqui ?<span className="text-[#002045] hover:cursor-pointer">Criar conta.</span> </p>
									</form>

								</div>
							</div>
						</section>
						<div className="flex justify-around p-3  sm:w-7xl  bg-white tracking-wide w-full  text-[#74777F] items-center h-27.25">
							<p className="text-[#002045] italic">CLARIS</p>
							<div className="flex gap-4">
								<p>PRIVACIDADE</p>
								<p>TERMOS</p>
								<p>SUPORTE</p>
								<p>CONTACTOS</p>
							</div>
							<p>© 2024 CLARIS ORGANIZATION</p>
						</div>

					</div>
				</div>
			</div>
		</div>
	);
}





/*

<button className="p-4 bg-white text-black flex gap-2 hover:cursor-pointer items-center justify-center rounded-2xl mb-10">
										<Image src={Google} alt="Google" className="w-5 h-5" />
										<p>Continue with Google</p>
									</button>

 */