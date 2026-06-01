"use client";

import Image from "next/image";
import Logo from "@/assets/images/lobo-SE.png";
import Google from "@/assets/images/SVG.png";
import { ArrowRight, Eye, EyeOff, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { loginAction } from "@/utils/actionsLogin";
import { useActionState } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
	const initialState = {
		error: undefined,
		success: false,
		message: "",
	};

	const [state, formAction, pending] = useActionState(loginAction, initialState);
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [focusedField, setFocusedField] = useState<string | null>(null);

	useEffect(() => {
		if (state?.success && state?.redirectUrl) {
			router.push(state.redirectUrl);
		}
	}, [state, router]);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_28%),linear-gradient(to_bottom,#e5eef9,#dbeafe)] px-4 py-8 text-slate-900 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_26%),linear-gradient(to_bottom,#020617,#0f172a)] dark:text-slate-50">
			<div className="flex w-full max-w-240 flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl md:flex-row dark:border-white/10 dark:bg-slate-950/70">
				<div className="side relative min-h-200 w-full overflow-hidden bg-slate-900 p-8 md:min-h-0 md:w-[45%] self-stretch">
					<div className="absolute inset-0 bg-linear-to-b from-[rgba(2,6,23,0.2)] via-[rgba(2,6,23,0.55)] to-[rgba(2,6,23,0.82)] pointer-events-none z-0" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.10),transparent_30%)]" />

					<div className="relative z-10 flex items-center gap-2.5">
						<div className="w-9 h-10.5 flex items-center justify-center">
							<Image src={Logo} alt="Claris Logo" className="w-full h-full object-contain" />
						</div>
						<p className="text-white text-2xl font-semibold tracking-wider">CLARIS</p>
					</div>

					<div className="relative z-10 flex flex-col items-center gap-3.5 text-center">
						<div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/30 bg-white/10 px-3.5 py-1.5 text-xs tracking-wide text-amber-100 backdrop-blur-sm animate-pulse">
							<Sparkles size={14} />
							<span>Escrituras para hoje</span>
						</div>
						<p className="max-w-85 font-serif text-xl italic leading-relaxed text-white md:text-2xl">
							"A tua palavra é lâmpada para os meus pés
							e luz para o meu caminho."
						</p>
						<p className="text-sm text-sky-200/80 md:text-base">— Salmos 119:105</p>
					</div>

					<div className="relative z-10 flex justify-center gap-2">
						<span className="h-2 w-6 rounded bg-amber-200 transition-all duration-300" />
						<span className="h-2 w-2 rounded-full bg-white/30 transition-all duration-300" />
						<span className="h-2 w-2 rounded-full bg-white/30 transition-all duration-300" />
					</div>
				</div>

				<div className="w-full md:w-[55%] flex items-center justify-center bg-[linear-gradient(180deg,rgba(248,250,252,0.92),rgba(241,245,249,0.95))] p-7 self-stretch md:p-10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.96))]">
					<div className="flex w-full max-w-100 flex-col">
						<div className="mb-7 w-full text-center">
							<p className="mb-1.5 font-serif text-[1.65rem] font-bold italic text-slate-900 dark:text-white">
								Bem-vindo de volta
							</p>
							<p className="text-[0.9rem] leading-relaxed text-slate-500 dark:text-slate-300">
								Insira os seus dados para aceder ao portal do Claris.
							</p>
						</div>

						<a
							href="http://localhost:3001/v1/api/auth/google"
							id="google-login-btn"
							className="mb-5 flex items-center justify-center gap-2.5 rounded-[14px] border border-slate-200/80 bg-white/85 px-4 py-3 text-sm font-medium text-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.04)] backdrop-blur-sm no-underline transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] active:translate-y-0 active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/8"
						>
							<Image src={Google} alt="Google" width={18} height={18} />
							<span>Continuar com Google</span>
						</a>

						<div className="mb-5 flex items-center gap-4">
							<div className="h-px flex-1 bg-slate-300 dark:bg-white/10" />
							<span className="whitespace-nowrap text-[0.65rem] font-medium tracking-widest text-slate-400">OU USE EMAIL</span>
							<div className="h-px flex-1 bg-slate-300 dark:bg-white/10" />
						</div>

						<form action={formAction} className="flex flex-col">
							<div className={`mb-5 transition-transform duration-200 ${focusedField === "email" ? "translate-x-0.5" : ""}`}>
								<label htmlFor="email" className="mb-2 flex items-center justify-between text-[0.7rem] font-semibold tracking-wider text-slate-500 dark:text-slate-300">
									EMAIL
								</label>
								<input
									type="email"
									name="email"
									required
									id="email"
									placeholder="pastor@claris.org"
									className="w-full rounded-[14px] border-[1.5px] border-slate-200 bg-white/80 px-4 py-3 text-[0.9rem] text-slate-800 outline-none backdrop-blur-xs transition-all duration-300 ease-out placeholder:text-slate-400 focus:border-sky-700 focus:bg-white focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)] dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-white/8"
									onFocus={() => setFocusedField("email")}
									onBlur={() => setFocusedField(null)}
									autoComplete="email"
								/>
							</div>

							<div className={`mb-5 transition-transform duration-200 ${focusedField === "password" ? "translate-x-0.5" : ""}`}>
								<label htmlFor="pss" className="mb-2 flex items-center justify-between text-[0.7rem] font-semibold tracking-wider text-slate-500 dark:text-slate-300">
									<span>SENHA</span>
								</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										id="pss"
										name="password"
										required
										placeholder="••••••••"
										className="w-full rounded-[14px] border-[1.5px] border-slate-200 bg-white/80 px-4 py-3 pr-12 text-[0.9rem] text-slate-800 outline-none backdrop-blur-xs transition-all duration-300 ease-out placeholder:text-slate-400 focus:border-sky-700 focus:bg-white focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)] dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-white/8"
										onFocus={() => setFocusedField("password")}
										onBlur={() => setFocusedField(null)}
										autoComplete="current-password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md border-none bg-transparent p-1 text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-sky-800 dark:hover:bg-white/8 dark:hover:text-sky-300"
										aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
									>
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
							</div>

							{state?.error && (
								<div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 animate-shake dark:border-red-400/20 dark:bg-red-500/10" role="alert">
									<AlertCircle size={16} className="text-red-600 shrink-0" />
									<p className="text-[0.85rem] font-medium text-red-600 dark:text-red-200">{state.error}</p>
								</div>
							)}

							<button
								type="submit"
								disabled={pending}
								id="login-submit-btn"
								className="mb-6 flex items-center justify-center gap-2 rounded-[14px] border-none bg-slate-950 py-3.5 text-[0.85rem] font-semibold tracking-wide text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_12px_28px_rgba(15,23,42,0.2)] active:translate-y-0 active:scale-[0.98] active:shadow-[0_2px_8px_rgba(15,23,42,0.15)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200"
							>
								{pending ? (
									<>
										<Loader2 size={18} className="animate-spin" />
										<span>A entrar...</span>
									</>
								) : (
									<>
										<span>ENTRAR</span>
										<ArrowRight size={18} />
									</>
								)}
							</button>

							<div className="mb-5 h-px w-full bg-slate-300 dark:bg-white/10" />
							<p className="text-center text-sm text-slate-500 dark:text-slate-300">
								Primeira vez aqui?{" "}
								<Link href="/registerUser" className="ml-1 font-semibold text-sky-800 no-underline transition-all duration-200 hover:text-sky-950 hover:underline dark:text-sky-300 dark:hover:text-sky-200">
									Criar conta
								</Link>
							</p>
						</form>
					</div>
				</div>
			</div>

			<footer className="mt-0 flex w-full max-w-240 flex-col items-center justify-between gap-3 rounded-b-2xl border border-t-0 border-white/60 bg-white/80 px-7 py-4 shadow-[0_4px_12px_rgba(15,23,42,0.04)] backdrop-blur-xl md:flex-row md:gap-0 dark:border-white/10 dark:bg-slate-950/70">
				<p className="text-[0.8rem] font-semibold italic tracking-wide text-slate-800 dark:text-slate-100">CLARIS</p>
				<div className="flex gap-5">
					<Link href="/politica-privacidade" className="text-[0.72rem] tracking-wide text-slate-400 no-underline transition-colors duration-200 hover:text-sky-800 dark:hover:text-sky-300">Política de Privacidade</Link>
					<Link href="/termos-condicoes" className="text-[0.72rem] tracking-wide text-slate-400 no-underline transition-colors duration-200 hover:text-sky-800 dark:hover:text-sky-300">Termos de serviço</Link>
					<Link href="/contacto-suporte" className="text-[0.72rem] tracking-wide text-slate-400 no-underline transition-colors duration-200 hover:text-sky-800 dark:hover:text-sky-300">Contactos</Link>
				</div>
				<p className="text-[0.72rem] tracking-wide text-slate-400">© 2024 CLARIS ORGANIZATION</p>
			</footer>
		</div>
	);
}