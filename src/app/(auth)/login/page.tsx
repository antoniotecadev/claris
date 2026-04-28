import Image from "next/image";
import Logo from "@/assets/images/lobo-SE.png"
import Google from "@/assets/images/SVG.png"
import { ArrowRight } from "lucide-react";

export default function Login() {
	return (
		<div >
			<div >
				<div>
					<div className="container m-auto  flex flex-col justify-center items-center h-screen">
						<section className="  flex  sm:w-7xl h-283.25 ">
							<div className="side w-[50%] h-full flex justify-between flex-col  p-5">
								<div className="flex gap-2 p-5  items-center">
									<Image src={Logo} alt="" className="w-20 h-full" />
									<p className="text-white text-4xl">CLARIS</p>
								</div>
								<div className="flex flex-col gap-3 items-center justify-center">
									<p className="text-[#FFDEA5] tracking-wide text-[30px]">Escrituras para hoje</p>
									<p className="italic text-white   text-[50px] text-center font-serif">“A tua palavra é lâmpada para os meus pés
										e luz para o meu caminho.”
									</p>
									<p className="text-[#86A0CD] text-[24px]">— Salmos 119:105</p>
								</div>
								<div className="flex justify-around text-white">
								</div>
							</div>
							<div className="w-full h-full flex flex-col justify-center items-center gradientes relative">
								<div className="w-94 h-181 flex flex-col ">
									<p className="text-3xl text-black font-serif italic mb-4">BEM VINDO DE VOLTA</p>
									<p className="text-[#43474E] mb-10">Insira os seus dados para aceder ao portal do Claris.</p>
									<button className="p-4 bg-white text-black flex gap-2 hover:cursor-pointer items-center justify-center rounded-2xl mb-10">
										<Image src={Google} alt="Google" className="w-5 h-5" />
										<p>Continue with Google</p>
									</button>
									<div className="flex gap-3 items-center justify-center mb-8">
										<div className="w-31.5 h-px bg-gray-400"></div>
										<p className="text-gray-500 text-[12px]">OR USE EMAIL</p>
										<div className="w-31.5 h-px bg-gray-400"></div>
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
								<div className="flex justify-around p-3  absolute top-270  tracking-wide w-full items-end-safe gap-6 text-[#74777F]">
									<p>PRIVACIDADE</p>
									<p>TERMOS</p>
									<p>SUPORTE</p>
									<p>CONTACTOS</p>
								</div>
							</div>
						</section>

					</div>
				</div>
			</div>
		</div>
	);
}