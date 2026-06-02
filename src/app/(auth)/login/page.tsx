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
import { addLocaleToPathname } from "@/i18n/routing";
import { useMessages } from "@/i18n/messages";

export default function Login() {
	const { locale, t } = useMessages();
	const initialState = {
		error: undefined,
		success: false,
		message: "",
	};

	const [state, formAction, pending] = useActionState(loginAction, initialState);
	const router = useRouter();
	const registerHref = addLocaleToPathname("/registerUser", locale);
	const privacyHref = addLocaleToPathname("/politica-privacidade", locale);
	const termsHref = addLocaleToPathname("/termos-condicoes", locale);
	const supportHref = addLocaleToPathname("/contacto-suporte", locale);
	const [showPassword, setShowPassword] = useState(false);
	const [focusedField, setFocusedField] = useState<string | null>(null);

	useEffect(() => {
		if (state?.success && state?.redirectUrl) {
			router.push(addLocaleToPathname(state.redirectUrl, locale));
		}
	}, [state, router, locale]);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_28%),linear-gradient(to_bottom,#e5eef9,#dbeafe)] px-4 py-8 text-slate-900 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_26%),linear-gradient(to_bottom,#020617,#0f172a)] dark:text-slate-50">
			<div className="flex w-full max-w-240 flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl md:flex-row dark:border-white/10 dark:bg-slate-950/70">
				<div className="side relative min-h-200 w-full overflow-hidden bg-slate-900 p-8 md:min-h-0 md:w-[45%] self-stretch">
					<div className="absolute inset-0 bg-linear-to-b from-[rgba(2,6,23,0.2)] via-[rgba(2,6,23,0.55)] to-[rgba(2,6,23,0.82)] pointer-events-none z-0" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.10),transparent_30%)]" />

			{/* ===== MAIN CARD ===== */}
			<div className="flex flex-col md:flex-row w-full max-w-240 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,20,60,0.12),0_4px_20px_rgba(0,20,60,0.06)]">

				{/* ===== LEFT PANEL — Image + Quote ===== */}
				<div className="side  w-full md:w-[45%] flex flex-col justify-between p-8 relative overflow-hidden min-h-200 md:min-h-0 self-stretch">
					{/* Dark overlay */}
					<div className="absolute inset-0 bg-linear-to-b from-[rgba(0,32,69,0.15)] to-[rgba(0,32,69,0.45)] pointer-events-none z-0" />

					{/* Logo */}
					<Link href="/">
					<div className="flex items-center gap-2.5 relative z-10">
						<div className="w-9 h-10.5 flex items-center justify-center">
							<Image src={Logo} alt="Claris Logo" className="w-full h-full object-contain" />
						</div>
						<p className="text-white text-2xl font-semibold tracking-wider">CLARIS</p>
					</div>
					</Link>

					<div className="relative z-10 flex flex-col items-center gap-3.5 text-center">
						<div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/30 bg-white/10 px-3.5 py-1.5 text-xs tracking-wide text-amber-100 backdrop-blur-sm animate-pulse">
							<Sparkles size={14} />
							<span>{t("auth.login.scriptureLabel")}</span>
						</div>
						<p className="text-white text-xl leading-relaxed italic font-serif max-w-85">
							"{t("auth.login.scriptureText")}"
						</p>
						<p className="text-[#86a0cd] text-base">{t("auth.login.scriptureSource")}</p>
					</div>

					<div className="relative z-10 flex justify-center gap-2">
						<span className="h-2 w-6 rounded bg-amber-200 transition-all duration-300" />
						<span className="h-2 w-2 rounded-full bg-white/30 transition-all duration-300" />
						<span className="h-2 w-2 rounded-full bg-white/30 transition-all duration-300" />
					</div>
				</div>

				{/* ===== RIGHT PANEL — Form ===== */}
				<div className="w-full md:w-[55%] flex items-center justify-center gradientes p-7 md:p-10 self-stretch">
					<div className="w-full max-w-100 flex flex-col">

						{/* Heading */}
						<div className="mb-7">
							<p className="text-[1.65rem] font-bold text-gray-900 font-serif italic mb-1.5">
								{t("auth.login.welcomeTitle")}
							</p>
							<p className="text-gray-500 text-[0.9rem] leading-relaxed">
								{t("auth.login.welcomeSubtitle")}
							</p>
						</div>

						<a
							href="http://localhost:3001/v1/api/auth/google"
							id="google-login-btn"
							className="mb-5 flex items-center justify-center gap-2.5 rounded-[14px] border border-slate-200/80 bg-white/85 px-4 py-3 text-sm font-medium text-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.04)] backdrop-blur-sm no-underline transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] active:translate-y-0 active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/8"
						>
							<Image src={Google} alt="Google" width={18} height={18} />
							<span>{t("auth.login.google")}</span>
						</a>

						{/* Divider */}
						<div className="flex items-center gap-4 mb-5">
							<div className="flex-1 h-px bg-[#c9c9c9]" />
							<span className="text-[0.65rem] text-gray-400 tracking-widest font-medium whitespace-nowrap">
								{t("auth.login.divider")}
							</span>
							<div className="flex-1 h-px bg-[#c9c9c9]" />
						</div>

						<form action={formAction} className="flex flex-col">
							<input type="hidden" name="locale" value={locale} />
							{/* Email */}
							<div className={`mb-5 transition-transform duration-200 ${focusedField === "email" ? "translate-x-0.5" : ""}`}>
								<label htmlFor="email" className="flex justify-between items-center mb-2 text-[0.7rem] font-semibold text-gray-500 tracking-wider">
										{t("auth.login.emailLabel")}
								</label>
								<input
									type="email"
									name="email"
									required
									id="email"
										placeholder={t("auth.login.emailPlaceholder")}
									className="w-full px-4 py-3 border-[1.5px] border-black/8 rounded-[14px] bg-white/80 backdrop-blur-xs text-[0.9rem] text-gray-800 outline-none transition-all duration-300 ease-out placeholder:text-gray-400 focus:border-[#002045] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,32,69,0.08)]"
									onFocus={() => setFocusedField("email")}
									onBlur={() => setFocusedField(null)}
									autoComplete="email"
								/>
							</div>

							<div className={`mb-5 transition-transform duration-200 ${focusedField === "password" ? "translate-x-0.5" : ""}`}>
								<label htmlFor="pss" className="flex justify-between items-center mb-2 text-[0.7rem] font-semibold text-gray-500 tracking-wider">
										<span>{t("auth.login.passwordLabel")}</span>
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
										className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 p-1 flex items-center justify-center transition-colors duration-200 rounded-md hover:text-[#002045] hover:bg-[rgba(0,32,69,0.06)]"
											aria-label={showPassword ? t("auth.login.passwordHide") : t("auth.login.passwordShow")}
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
											<span>{t("auth.login.submitting")}</span>
									</>
								) : (
									<>
											<span>{t("auth.login.submit")}</span>
										<ArrowRight size={18} />
									</>
								)}
							</button>

							{/* Bottom */}
							<div className="w-full h-px bg-gray-300 mb-5" />
							<p className="text-center text-gray-500 text-sm">
								{t("auth.login.firstTime")} {" "}
								<Link href={registerHref} className="text-[#002045] font-semibold no-underline ml-1 transition-all duration-200 hover:text-[#003066] hover:underline">
									{t("auth.login.createAccount")}
								</Link>
							</p>
						</form>
					</div>
				</div>
			</div>

			<footer className="mt-0 flex w-full max-w-240 flex-col items-center justify-between gap-3 rounded-b-2xl border border-t-0 border-white/60 bg-white/80 px-7 py-4 shadow-[0_4px_12px_rgba(15,23,42,0.04)] backdrop-blur-xl md:flex-row md:gap-0 dark:border-white/10 dark:bg-slate-950/70">
				<p className="text-[0.8rem] font-semibold italic tracking-wide text-slate-800 dark:text-slate-100">CLARIS</p>
				<div className="flex gap-5">
					<Link href={privacyHref} className="text-gray-400 text-[0.72rem] no-underline tracking-wide transition-colors duration-200 hover:text-[#002045]">
						{t("footer.privacy")}
					</Link>
					<Link href={termsHref} className="text-gray-400 text-[0.72rem] no-underline tracking-wide transition-colors duration-200 hover:text-[#002045]">
						{t("footer.terms")}
					</Link>
					<Link href={supportHref} className="text-gray-400 text-[0.72rem] no-underline tracking-wide transition-colors duration-200 hover:text-[#002045]">
						{t("footer.support")}
					</Link>
				</div>
				<p className="text-[0.72rem] tracking-wide text-slate-400">© 2024 CLARIS ORGANIZATION</p>
			</footer>
			</div>
			</div>
		</div>
}