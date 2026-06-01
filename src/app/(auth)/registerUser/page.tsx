"use client";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/images/lobo-SE.png";
import Google from "@/assets/images/SVG.png";
import { ArrowRight, Eye, EyeOff, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { registerAction } from "@/utils/actionsRegister";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
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
	const router = useRouter();

	const [state, formAction, pending] = useActionState(registerAction, initialState);
	
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [focusedField, setFocusedField] = useState<string | null>(null);

	useEffect(() => {
		if (state.success && state.user) {
			setUser(state.user);
			router.push('/mainDash');
		}
	}, [state, router, setUser]);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#e8eaed] p-6">
			{/* ===== MAIN CARD ===== */}
			<div className="flex flex-col md:flex-row w-full max-w-240 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,20,60,0.12),0_4px_20px_rgba(0,20,60,0.06)]">

				{/* ===== LEFT PANEL — Image + Quote ===== */}
				<div className="side2 bg-amber-700 w-full md:w-[45%] flex flex-col justify-between p-8 relative overflow-hidden min-h-75 md:min-h-175 self-stretch">
					{/* Dark overlay */}
					<div className="absolute inset-0 bg-linear-to-b from-[rgba(0,32,69,0.15)] to-[rgba(0,32,69,0.65)] pointer-events-none z-0" />

					{/* Logo */}
					<div className="flex items-center gap-2.5 relative z-10">
						<div className="w-9 h-10.5 flex items-center justify-center">
							<Image src={Logo} alt="Claris Logo" className="w-full h-full object-contain" />
						</div>
						<p className="text-white text-2xl font-semibold tracking-wider">CLARIS</p>
					</div>

					{/* Inspirational quote */}
					<div className="flex flex-col items-center gap-3.5 text-center relative z-10">
						<div className="inline-flex items-center gap-1.5 bg-[rgba(255,222,165,0.2)] border border-[rgba(255,222,165,0.35)] backdrop-blur-sm px-3.5 py-1.5 rounded-full text-[#ffdea5] text-xs tracking-wide animate-pulse">
							<Sparkles size={14} />
							<span>Um novo amanhecer</span>
						</div>
						<p className="text-white text-xl md:text-2xl leading-relaxed italic font-serif max-w-85 mb-2">
							"Comece a sua jornada sagrada."
						</p>
						<p className="text-[#86A0CD] text-sm md:text-base text-center">
							Junte-se a uma comunidade global dedicada à reflexão silenciosa,
							ao ministério digital e ao crescimento espiritual.
						</p>
					</div>

					{/* Decorative dots */}
					<div className="flex gap-2 justify-center relative z-10">
						<span className="w-6 h-2 rounded bg-[#ffdea5] transition-all duration-300" />
						<span className="w-2 h-2 rounded-full bg-white/30 transition-all duration-300" />
						<span className="w-2 h-2 rounded-full bg-white/30 transition-all duration-300" />
					</div>
				</div>

				{/* ===== RIGHT PANEL — Form ===== */}
				<div className="w-full md:w-[55%] flex flex-col justify-center gradientes p-7 md:p-10 self-stretch">
					<div className="w-full max-w-100 mx-auto flex flex-col">
						{/* Heading */}
						<div className="mb-6">
							<p className="text-[1.65rem] font-bold text-gray-900 font-serif italic mb-1.5">
								Criar uma conta.
							</p>
							<p className="text-gray-500 text-[0.9rem] leading-relaxed">
								Entre no Santuário Digital. O seu caminho começa aqui.
							</p>
						</div>

						{/* Google button */}
						<a
							href="http://localhost:3001/v1/api/auth/google"
							className="flex items-center justify-center gap-2.5 px-4 py-3 border border-black/8 rounded-[14px] bg-white/85 backdrop-blur-sm text-gray-800 text-sm font-medium cursor-pointer transition-all duration-300 ease-out no-underline mb-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 active:shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
						>
							<Image src={Google} alt="Google" width={18} height={18} />
							<span>Sign up with Google</span>
						</a>

						{/* Divider */}
						<div className="flex items-center gap-4 mb-5">
							<div className="flex-1 h-px bg-[#c9c9c9]" />
							<span className="text-[0.65rem] text-gray-400 tracking-widest font-medium whitespace-nowrap">OR USE EMAIL</span>
							<div className="flex-1 h-px bg-[#c9c9c9]" />
						</div>

						{/* Form */}
						<form action={formAction} className="flex flex-col w-full">
							{/* Nome completo */}
							<div className={`mb-4 transition-transform duration-200 ${focusedField === "displayName" ? "translate-x-0.5" : ""}`}>
								<label htmlFor="displayName" className="block mb-2 text-[0.7rem] font-semibold text-gray-500 tracking-wider">
									NOME COMPLETO
								</label>
								<input
									type="text"
									id="displayName"
									name="displayName"
									value={fields.displayName}
									onChange={handleChange}
									required
									placeholder="Delson Pedro"
									className="w-full px-4 py-2.5 border-[1.5px] border-black/8 rounded-[14px] bg-white/80 backdrop-blur-xs text-[0.9rem] text-gray-800 outline-none transition-all duration-300 ease-out placeholder:text-gray-400 focus:border-[#002045] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,32,69,0.08)]"
									onFocus={() => setFocusedField("displayName")}
									onBlur={() => setFocusedField(null)}
								/>
							</div>

							{/* E-mail */}
							<div className={`mb-4 transition-transform duration-200 ${focusedField === "email" ? "translate-x-0.5" : ""}`}>
								<label htmlFor="email" className="block mb-2 text-[0.7rem] font-semibold text-gray-500 tracking-wider">
									E-MAIL
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={fields.email}
									onChange={handleChange}
									required
									placeholder="ex. delson@church.com"
									className="w-full px-4 py-2.5 border-[1.5px] border-black/8 rounded-[14px] bg-white/80 backdrop-blur-xs text-[0.9rem] text-gray-800 outline-none transition-all duration-300 ease-out placeholder:text-gray-400 focus:border-[#002045] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,32,69,0.08)]"
									onFocus={() => setFocusedField("email")}
									onBlur={() => setFocusedField(null)}
									autoComplete="email"
								/>
							</div>

							{/* Gênero e Data de Nascimento */}
							<div className="flex gap-4 mb-4">
								<div className={`flex flex-col flex-1 transition-transform duration-200 ${focusedField === "gender" ? "translate-x-0.5" : ""}`}>
									<label htmlFor="gender" className="block mb-2 text-[0.7rem] font-semibold text-gray-500 tracking-wider">GÉNERO</label>
									<select
										id="gender"
										name="gender"
										value={fields.gender}
										onChange={handleChange}
										required
										className="w-full px-4 py-2.5 border-[1.5px] border-black/8 rounded-[14px] bg-white/80 backdrop-blur-xs text-[0.9rem] text-gray-800 outline-none transition-all duration-300 ease-out focus:border-[#002045] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,32,69,0.08)] appearance-none"
										onFocus={() => setFocusedField("gender")}
										onBlur={() => setFocusedField(null)}
									>
										<option value="" disabled hidden>Selecione...</option>
										<option value="masculino">Masculino</option>
										<option value="feminino">Feminino</option>
									</select>
								</div>

								<div className={`flex flex-col flex-1 transition-transform duration-200 ${focusedField === "birthDate" ? "translate-x-0.5" : ""}`}>
									<label htmlFor="birthDate" className="block mb-2 text-[0.7rem] font-semibold text-gray-500 tracking-wider">DATA Nasc.</label>
									<input
										type="date"
										id="birthDate"
										name="birthDate"
										value={fields.birthDate}
										onChange={handleChange}
										required
										className="w-full px-4 py-2.5 border-[1.5px] border-black/8 rounded-[14px] bg-white/80 backdrop-blur-xs text-[0.9rem] text-gray-800 outline-none transition-all duration-300 ease-out focus:border-[#002045] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,32,69,0.08)]"
										onFocus={() => setFocusedField("birthDate")}
										onBlur={() => setFocusedField(null)}
									/>
								</div>
							</div>

							{/* Senha */}
							<div className={`mb-4 transition-transform duration-200 ${focusedField === "password" ? "translate-x-0.5" : ""}`}>
								<label htmlFor="password" className="block mb-2 text-[0.7rem] font-semibold text-gray-500 tracking-wider">SENHA</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										id="password"
										name="password"
										required
										placeholder="••••••••"
										className="w-full px-4 py-2.5 pr-12 border-[1.5px] border-black/8 rounded-[14px] bg-white/80 backdrop-blur-xs text-[0.9rem] text-gray-800 outline-none transition-all duration-300 ease-out placeholder:text-gray-400 focus:border-[#002045] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,32,69,0.08)]"
										onFocus={() => setFocusedField("password")}
										onBlur={() => setFocusedField(null)}
										autoComplete="new-password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 p-1 flex items-center justify-center transition-colors duration-200 rounded-md hover:text-[#002045] hover:bg-[rgba(0,32,69,0.06)]"
										aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
									>
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
								<p className="text-gray-400 text-[0.7rem] mt-1.5 ml-1">Deve ter pelo menos 6 caracteres</p>
							</div>

							{/* Confirmar Senha */}
							<div className={`mb-5 transition-transform duration-200 ${focusedField === "confirmPassword" ? "translate-x-0.5" : ""}`}>
								<label htmlFor="confirmPassword" className="block mb-2 text-[0.7rem] font-semibold text-gray-500 tracking-wider">
									CONFIRMAR SENHA
								</label>
								<div className="relative">
									<input
										type={showConfirmPassword ? "text" : "password"}
										id="confirmPassword"
										name="confirmPassword"
										required
										placeholder="••••••••"
										className="w-full px-4 py-2.5 pr-12 border-[1.5px] border-black/8 rounded-[14px] bg-white/80 backdrop-blur-xs text-[0.9rem] text-gray-800 outline-none transition-all duration-300 ease-out placeholder:text-gray-400 focus:border-[#002045] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,32,69,0.08)]"
										onFocus={() => setFocusedField("confirmPassword")}
										onBlur={() => setFocusedField(null)}
										autoComplete="new-password"
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 p-1 flex items-center justify-center transition-colors duration-200 rounded-md hover:text-[#002045] hover:bg-[rgba(0,32,69,0.06)]"
										aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
									>
										{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
							</div>

							{/* Termos e Condições */}
							<div className="flex items-start gap-2 mb-5">
								<input
									type="checkbox"
									id="terms"
									name="terms"
									required
									className="mt-1 cursor-pointer w-4 h-4 text-[#002045] bg-gray-100 border-gray-300 rounded focus:ring-[#002045]"
								/>
								<label htmlFor="terms" className="text-[0.75rem] text-gray-600 cursor-pointer select-none leading-relaxed">
									Estou de acordo com os{" "}
									<Link href={"/termos-condicoes"} className="text-[#002045] font-semibold hover:underline">
										termos e condições
									</Link>{" "}
									e a{" "}
									<Link href={"/termos-condicoes"} className="text-[#002045] font-semibold hover:underline">
										política de privacidade
									</Link>.
								</label>
							</div>

							{/* Erro */}
							{state?.error && (
								<div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-xl mb-4 animate-shake" role="alert">
									<AlertCircle size={16} className="text-red-600 shrink-0" />
									<p className="text-red-600 text-[0.85rem] font-medium">{state.error}</p>
								</div>
							)}

							{/* Botão */}
							<button
								type="submit"
								disabled={pending}
								className="flex items-center justify-center gap-2 py-3.5 border-none rounded-[14px] bg-[#002045] text-white text-[0.85rem] font-semibold tracking-wide cursor-pointer transition-all duration-300 ease-out mb-6 hover:bg-[#003066] hover:shadow-[0_6px_24px_rgba(0,32,69,0.25)] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 active:shadow-[0_2px_8px_rgba(0,32,69,0.15)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
							>
								{pending ? (
									<>
										<Loader2 size={18} className="animate-spin" />
										<span>A criar conta...</span>
									</>
								) : (
									<>
										<span>CRIAR CONTA</span>
										<ArrowRight size={18} />
									</>
								)}
							</button>

							<div className="flex items-center gap-4 mb-2">
								<div className="flex-1 h-px bg-[#c9c9c9]" />
								<p className="text-gray-500 text-sm">
									Já tens uma conta?{" "}
									<Link href="/login" className="text-[#002045] font-semibold no-underline ml-1 transition-all duration-200 hover:text-[#003066] hover:underline">
										Entrar
									</Link>
								</p>
								<div className="flex-1 h-px bg-[#c9c9c9]" />
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}