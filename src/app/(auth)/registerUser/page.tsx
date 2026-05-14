"use client";
import Image from "next/image";
import Logo from "@/assets/images/lobo-SE.png";
import Google from "@/assets/images/SVG.png";
import { ArrowRight } from "lucide-react";
import { registerAction } from "@/utils/actionsRegister";
import { use, useActionState, useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from 'next/navigation'

export default function RegisterUser() {
	const initialState = {
		error: undefined,
		success: false,
	};

	const [fields, setFields] = useState({
		displayName: "",
		email: "",
		gender: "",
		birthDate: "",
		password: "",
		confirmPassword: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const setUser = useUserStore((state) => state.setUser);
	const router = useRouter()

	const [state, formAction, pending] = useActionState(registerAction, initialState);
	useEffect(() =>{
		
		if(state.success && state.user) {
			setUser(state.user);
			router.push('/mainDash')
		}	
	}, [state]);

	return (
		<div className="bg-[#E5E5E5]">
			<div className="container m-auto flex flex-col justify-center items-center h-screen">
				<section className="flex w-7xl h-291.5">
					{/* Lado esquerdo */}
					<div className="side2 w-10 h-full flex justify-between flex-col p-5">
						<div className="flex gap-2 p-5 items-center">
							<Image src={Logo} alt="" className="w-20 h-full" />
							<p className="text-white text-4xl">CLARIS</p>
						</div>
						<div className="flex flex-col gap-3 items-center justify-center">
							<p className="text-[#FFDEA5] tracking-wide font-bold text-[14px]">Um novo amanhecer</p>
							<p className="italic text-white text-[60px] text-center font-serif mb-2">
								"Comece a sua jornada sagrada."
							</p>
							<p className="text-[#86A0CD] text-[18px] text-center">
								Junte-se a uma comunidade global dedicada à reflexão silenciosa,
								ao ministério digital e ao crescimento espiritual.
							</p>
						</div>
						<div />
					</div>
					<div className="w-full h-full flex flex-col py-20 items-center gradientes">
						<div className="w-159 flex flex-col">
							<p className="text-[36px] text-[#002045] font-serif italic mb-4">Criar uma conta.</p>
							<p className="text-[#43474E] text-[16px] mb-12">
								Entre no Santuário Digital. O seu caminho começa aqui.
							</p>
							<a href="http://localhost:3001/v1/api/auth/google"
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
								<p>Sign up with Google</p>
							</a>

							<div className="flex gap-3 items-center justify-between mb-8">
								<div className="w-54 h-px bg-gray-400" />
								<p className="text-gray-500 text-[12px]">OR USE EMAIL</p>
								<div className="w-54 h-px bg-gray-400" />
							</div>

							<form action={formAction} className="flex flex-col w-full">
								<label htmlFor="displayName" className="mb-1 text-[#43474E]">
									Nome completo
								</label>
								<input
									type="text"
									id="displayName"
									name="displayName"
									value={fields.displayName}
									onChange={handleChange}
									required
									placeholder="ex. Delson Pedro"
									className="text-[#6B7280] bg-white rounded-2xl h-13.5 p-4 mb-4"
								/>
								<div className="flex flex-col mb-4">
									<label htmlFor="email" className="mb-1 text-[#43474E]">E-mail</label>
									<input
										type="email"
										id="email"
										name="email"
										value={fields.email}
										onChange={handleChange}
										required
										placeholder="ex. delson@church.com"
										className="text-[#6B7280] bg-white rounded-2xl h-13.5 p-4"
									/>
								</div>
								<div className="flex gap-5 mb-4">
									<div className="flex flex-col w-[50%]">
										<label htmlFor="gender" className="mb-1 text-[#43474E]">Género</label>
										<select
											id="gender"
											name="gender"
											value={fields.gender}
											onChange={handleChange}
											className="text-[#74777F] bg-white rounded-2xl h-13.5 p-4"
										>
											<option value="" disabled hidden>
												Selecione o género
											</option>
											<option value="masculino">Masculino</option>
											<option value="feminino">Feminino</option>
										</select>
									</div>

									<div className="flex flex-col w-[50%]">
										<label htmlFor="birthDate" className="mb-1 text-[#43474E]">Data de Nascimento</label>
										<input
											type="date"
											id="birthDate"
											name="birthDate"
											value={fields.birthDate}
											onChange={handleChange}
											className="text-[#6B7280] bg-white rounded-2xl h-13.5 p-4"
										/>
									</div>
								</div>

								{/* Senha */}
								<div className="flex flex-col mb-2">
									<label htmlFor="password" className="mb-1 text-[#43474E]">Senha</label>
									<input
										type="password"
										id="password"
										name="password"
										required
										placeholder="........"
										className="text-[#74777F] bg-white rounded-2xl h-13.5 p-4"
									/>
									<p className="text-[#74777F] text-[11px] mt-1 mb-3">
										Deve ter pelo menos 6 caracteres
									</p>
								</div>

								{/* Confirmar Senha */}
								<div className="flex flex-col mb-6">
									<label htmlFor="confirmPassword" className="mb-1 text-[#43474E]">
										Confirmar senha
									</label>
									<input
										type="password"
										id="confirmPassword"
										name="confirmPassword"
										required
										placeholder="........"
										className="text-[#74777F] bg-white rounded-2xl h-13.5 p-4"
									/>
								</div>

								{/* Erro */}
								{state?.error && (
									<p className="text-sm text-red-600 font-medium mb-4">{state.error}</p>
								)}

								{/* Botão */}
								<button
									type="submit"
									disabled={pending}
									className="bg-[#002045] flex justify-center items-center gap-4 text-white h-14 rounded-2xl mb-10
											transition-all duration-300  hover:bg-[#003066]
											hover:-translate-y-0.5 hover:shadow-lg
											active:scale-[0.98 hover:cursor-pointer disabled:opacity-60
											disabled:hover:translate-y-0  disabled:hover:shadow-none "
								>
									<p>{pending ? "A criar conta..." : "CRIAR CONTA"}</p>
									<ArrowRight size={20} />
								</button>

								<div className="flex justify-between items-center">
									<div className="w-35 h-px bg-gray-400" />
									<p className="text-gray-500 text-[12px]">
										Já tens uma conta?{" "}
										<a href="/login" className="text-[#002045]">Entrar</a>
									</p>
									<div className="w-35 h-px bg-gray-400" />

								</div>
							</form>
						</div>
					</div>
				</section>

				{/* Footer */}
				<div className="flex justify-around p-3 sm:w-7xl bg-white tracking-wide w-full text-[#74777F] items-center h-27.25">
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