"use client";
import Image from "next/image";
import Logo from "@/assets/images/lobo-SE.png"
import Google from "@/assets/images/SVG.png"
import { ArrowRight } from "lucide-react";
import { loginAction } from "@/utils/actionsLogin";
import { useActionState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {

	const initialState = {
		error: undefined,
		success: false,
		message: "",
	};

	const [state, formAction, pending] = useActionState(loginAction, initialState)
	const router = useRouter();

	useEffect(() => {
		if (state?.success && state?.redirectUrl) {
			router.push(state.redirectUrl);
		}
	}, [state, router]);

	return (

		<div className="bg-[#E5E5E5]">
			
			<div className="container m-auto  flex flex-col justify-center items-center h-screen ">
				<section className="  flex  w-200 h-150 ">
					<div className="side w-[50%] h-full flex justify-between flex-col  p-5">
						<div className="flex gap-2 p-5  items-center">
							<Image src={Logo} alt="" className="w-8 h-10" />
							<p className="text-white text-2xl">CLARIS</p>
						</div>
						<div className="flex flex-col gap-3 items-center justify-center">
							<p className="text-[#FFDEA5] tracking-wide text-[12px]">Escrituras para hoje</p>
							<p className="italic text-white   text-[20px] text-center font-serif">“A tua palavra é lâmpada para os meus pés
								e luz para o meu caminho.”
							</p>
							<p className="text-[#86A0CD] text-[18px]">— Salmos 119:105</p>
						</div>
						<div className="flex justify-around text-white">
						</div>
					</div>
					<div className="w-[50%] h-full flex flex-col justify-center items-center gradientes">
						<div className="w-94 h-150 flex flex-col ">
							<p className="text-3xl text-black font-serif italic mb-4">BEM VINDO DE VOLTA</p>
							<p className="text-[#43474E] mb-10">Insira os seus dados para aceder ao portal do Claris.</p>
							<a
								href="http://localhost:3001/v1/api/auth/google"
								className="
											p-4
											bg-white
											text-black
											flex gap-2
											items-center justify-center
											rounded-2xl
											mb-10
											border border-gray-200
											transition-all duration-300
											hover:bg-gray-50
											hover:shadow-md
											hover:-translate-y-0.5
											hover:cursor-pointer
											active:scale-[0.98]
										"
							>
								<Image src={Google} alt="Google" className="w-5 h-5" />
								<p>Continue with Google</p>
							</a>
							<div className="flex gap-3 items-center justify-center mb-8">
								<div className="w-31.5 h-px bg-gray-400"></div>
								<p className="text-gray-500 text-[12px]">OR USE EMAIL</p>
								<div className="w-31.5 h-px bg-gray-400"></div>
							</div>
							<form action={formAction} className="flex flex-col">
								<label htmlFor="email" className="text-[#43474E] mb-2.25">EMAIL ADDRESS</label>
								<input type="email" name="email" required id="email" placeholder="ex pastor@claris.org " className="text-[#74777F] bg-white rounded-2xl h-13.5 p-4 mb-6" />
								<label htmlFor="pss" className="text-[#43474E] flex justify-between mb-2.25">
									<p>SENHA</p>
									<p className="text-[#002045] hover:cursor-pointer">Esqueceu sua senha?</p>
								</label>
								<input type="password" id="pss" name="password" required placeholder="........" className="text-[#74777F] bg-white rounded-2xl h-13.5 p-4 mb-6" />
								{state?.error && (
									<div className="mb-3  ">
										<p className="text-sm text-red-600 font-medium flex items-center gap-2">
											{state.error}
										</p>
									</div>
								)}
								<button
									type="submit"
									disabled={pending}
									className="
													bg-[#002045]
													flex justify-center items-center gap-2
													text-white
													h-14
													rounded-2xl
													mb-10
													transition-all duration-300
													hover:bg-[#003066]
													hover:shadow-lg
													hover:-translate-y-0.5
													hover:cursor-pointer
													active:scale-[0.98]
													disabled:opacity-60
													disabled:hover:translate-y-0
													disabled:hover:shadow-none
												"
								>
									<p >ENTRAR</p>
									<ArrowRight size={20} />
								</button>

								<div className="w-full h-px bg-gray-400 mb-10"></div>
								<p className="text-[#43474E] text-center mb-12 ">Primeira vez aqui ?<span className="text-[#002045] hover:cursor-pointer">
									<Link href={"/registerUser"}>Criar conta</Link>
								</span> </p>
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
	);
}