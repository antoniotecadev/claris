"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/images/lobo-SE.png";
import Google from "@/assets/images/SVG.png";
import { ArrowRight } from "lucide-react";
import { registerAction } from "@/utils/actionsRegister";
import { use, useActionState, useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { useUserStore } from "@/stores/userStore";

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

	const setUser = useUserStore((state: { setUser: any; }) => state.setUser);
	const router = useRouter()

	const [state, formAction, pending] = useActionState(registerAction, initialState);
	useEffect(() => {

		if (state.success && state.user) {
			setUser(state.user);
			router.push('/mainDash')
		}
	}, [state]);

	return (
	
			<div className=" flex  justify-center items-center h-screen w-screen ">
				<section className="flex w-200 h-155 ">
					{/* Lado esquerdo */}
					<div className="side2 w-[50%] h-157 flex justify-between flex-col p-2 bg-amber-700">
						<div className="flex gap-2 p-5 items-center">
							<Image src={Logo} alt="" className="w-8 h-10" />
							<p className="text-white text-2xl">CLARIS</p>
						</div>
						<div className="flex flex-col gap-3 items-center justify-center">
							<p className="text-[#FFDEA5] tracking-wide font-bold text-[10px]">Um novo amanhecer</p>
							<p className="italic text-white text-[24px] text-center font-serif mb-2">
								"Comece a sua jornada sagrada."
							</p>
							<p className="text-[#86A0CD] text-[18px] text-center">
								Junte-se a uma comunidade global dedicada à reflexão silenciosa,
								ao ministério digital e ao crescimento espiritual.
							</p>
						</div>
						<div />
					</div>
					<div className="w-[50%] h-157 flex flex-col items-center gradientes">
						<div className="w-100 flex flex-col px-2">
							<p className="text-[20px] text-[#002045] font-serif italic mb-4">Criar uma conta.</p>
							<p className="text-[#43474E] text-[14px] mb-4">
								Entre no Santuário Digital. O seu caminho começa aqui.
							</p>
							<a href="http://localhost:3001/v1/api/auth/google"
								className="
									p-2
									bg-white
									text-black
									flex gap-2
									items-center justify-center
									rounded-2xl
									mb-4
									border border-gray-200
									transition-all duration-300
									hover:bg-gray-50
									hover:shadow-md
									hover:-translate-y-0.5
									hover:cursor-pointer
									active:scale-[0.98]
									text-[10px]
									
								"
							>
								<Image src={Google} alt="Google" className="w-5 h-5" />
								<p>Sign up with Google</p>
							</a>

							<div className="flex gap-3 items-center justify-around mb-2">
								<div className="w-30 h-px bg-gray-400" />
								<p className="text-gray-500 text-[10px]">OR USE EMAIL</p>
								<div className="w-30 h-px bg-gray-400" />
							</div>

							<form action={formAction} className="flex flex-col w-full">
								<label htmlFor="displayName" className="mb-1 text-[#43474E] text-[12px]">
									Nome completo
								</label>
								<input
									type="text"
									id="displayName"
									name="displayName"
									value={fields.displayName}
									onChange={handleChange}
									required
									placeholder="Delson Pedro"
									className="text-[#6B7280] bg-white rounded-2xl h-8 p-2 mb-2 text-[12px]"
								/>
								<div className="flex flex-col mb-2">
									<label htmlFor="email" className="mb-1 text-[#43474E] text-[12px]">E-mail</label>
									<input
										type="email"
										id="email"
										name="email"
										value={fields.email}
										onChange={handleChange}
										required
										placeholder="ex. delson@church.com"
										className="text-[#6B7280] bg-white rounded-2xl h-8 p-2 text-[12px]"
									/>
								</div>
								<div className="flex gap-5 mb-4">
									<div className="flex flex-col w-[50%]">
										<label htmlFor="gender" className="mb-1 text-[#43474E] text-[12px]">Género</label>
										<select
											id="gender"
											name="gender"
											value={fields.gender}
											onChange={handleChange}
											className="text-[#74777F] bg-white rounded-2xl h-8 p-2 text-[12px]"
										>
											<option value="" disabled hidden className="text-[12px]">
												Selecione o género
											</option>
											<option value="masculino">Masculino</option>
											<option value="feminino">Feminino</option>
										</select>
									</div>

									<div className="flex flex-col w-[50%]">
										<label htmlFor="birthDate" className="mb-1 text-[#43474E] text-[12px]">Data de Nascimento</label>
										<input
											type="date"
											id="birthDate"
											name="birthDate"
											value={fields.birthDate}
											onChange={handleChange}
											className="text-[#6B7280] bg-white rounded-2xl h-8 p-2 text-[12px]"
										/>
									</div>
								</div>

								{/* Senha */}
								<div className="flex flex-col mb-2">
									<label htmlFor="password" className="mb-1 text-[#43474E] text-[12px]">Senha</label>
									<input
										type="password"
										id="password"
										name="password"
										required
										placeholder="........"
										className="text-[#74777F] bg-white rounded-2xl h-8 p-2 text-[12px]"
									/>
									<p className="text-[#74777F] text-[11px] mt-1 mb-1">
										Deve ter pelo menos 6 caracteres
									</p>
								</div>

								{/* Confirmar Senha */}
								<div className="flex flex-col mb-3">
									<label htmlFor="confirmPassword" className="mb-1 text-[#43474E] text-[12px]">
										Confirmar senha
									</label>
									<input
										type="password"
										id="confirmPassword"
										name="confirmPassword"
										required
										placeholder="........"
										className="text-[#74777F] bg-white rounded-2xl h-8 p-2 text-[12px]"
									/>
								</div>
								<div className="flex items-center gap-2 mb-2">
									<input
										type="checkbox"
										id="terms"
										name="terms"
										required
										className="cursor-pointer" // Melhora a experiência do usuário
									/>

									<label htmlFor="terms" className="text-[11px] text-[#43474E] cursor-pointer select-none">
										Estou de acordo com os{" "}
										<Link href={"/termos-condicoes"} className="text-[#002045] font-medium hover:underline">
											termos e condições
										</Link>
										e {" "}
										<Link href={"/termos-condicoes"} className="text-[#002045] font-medium hover:underline">
											Política de privacidade
										</Link>
									</label>
								</div>

								{/* Erro */}
								{state?.error && (
									<p className="text-sm text-red-600 font-medium mb-4">{state.error}</p>
								)}

								{/* Botão */}
								<button
									type="submit"
									disabled={pending}
									className="bg-[#002045] flex justify-center items-center gap-4 text-white h-8 rounded-2xl mb-2 p-2
											transition-all duration-300  hover:bg-[#003066]
											hover:-translate-y-0.5 hover:shadow-lg
											active:scale-[0.98 hover:cursor-pointer disabled:opacity-60
											disabled:hover:translate-y-0  disabled:hover:shadow-none "
								>
									<p className="text-[12px]">{pending ? "A criar conta..." : "CRIAR CONTA"}</p>
									<ArrowRight size={12} />
								</button>

								<div className="flex justify-around items-center">
									<div className="w-20 h-px bg-gray-400" />
									<p className="text-gray-500 text-[12px]">
										Já tens uma conta?{" "}
										<a href="/login" className="text-[#002045]">Entrar</a>
									</p>
									<div className="w-20 h-px bg-gray-400" />

								</div>
							</form>
						</div>
					</div>
				</section>

			</div>

	);
}