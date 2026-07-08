"use client";

import Logo from "@/assets/images/lobo-SE.png";
import { ArrowRight, Eye, EyeOff, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { GoogleAuthButton } from "@/components/ui/google-auth-button";
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
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#e8eaed] p-6 dark:bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.16),transparent_32%),linear-gradient(to_bottom,#0f172a,#020617)]">

			<div className="flex flex-col md:flex-row w-full max-w-240 rounded-t-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,20,60,0.12),0_4px_20px_rgba(0,20,60,0.06)]">

				<div className="side  w-full md:w-[45%] flex flex-col justify-between p-8 relative overflow-hidden min-h-200 md:min-h-0 self-stretch">
					<div className="absolute inset-0 bg-linear-to-b from-[rgba(0,32,69,0.15)] to-[rgba(0,32,69,0.45)] pointer-events-none z-0" />

					<Link href="/">
					<div className="flex items-center gap-2.5 relative z-10">
						<div className="w-9 h-10.5 flex items-center justify-center">
							<img src={Logo.src} alt="Claris Logo" className="w-full h-full object-contain" />
						</div>
						<p className="text-white text-2xl font-semibold tracking-wider">CLARIS</p>
					</div>
					</Link>

					<div className="flex flex-col items-center gap-3.5 text-center relative z-10">
						<div className="inline-flex items-center gap-1.5 bg-[rgba(255,222,165,0.2)] border border-[rgba(255,222,165,0.35)] backdrop-blur-sm px-3.5 py-1.5 rounded-full text-[#ffdea5] text-xs tracking-wide animate-pulse">
							<Sparkles size={14} />
							<span>{t("auth.login.scriptureLabel")}</span>
						</div>
						<p className="text-white text-xl leading-relaxed italic font-serif max-w-85">
							"{t("auth.login.scriptureText")}"
						</p>
						<p className="text-[#86a0cd] text-base">{t("auth.login.scriptureSource")}</p>
					</div>

					{/* Decorative dots */}
					<div className="flex gap-2 justify-center relative z-10">
						<span className="w-6 h-2 rounded bg-[#ffdea5] transition-all duration-300" />
						<span className="w-2 h-2 rounded-full bg-white/30 transition-all duration-300" />
						<span className="w-2 h-2 rounded-full bg-white/30 transition-all duration-300" />
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

						{/* Google button */}
						<GoogleAuthButton id="google-login-btn" text={t("auth.login.google")} />

						{/* Divider */}
						<div className="flex items-center gap-4 mb-5">
							<div className="flex-1 h-px bg-[#c9c9c9]" />
							<span className="text-[0.65rem] text-gray-400 tracking-widest font-medium whitespace-nowrap">
								{t("auth.login.divider")}
							</span>
							<div className="flex-1 h-px bg-[#c9c9c9]" />
						</div>

						{/* Form */}
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
									className="w-full px-4 py-3 border-[1.5px] border-black/8 rounded-[14px] bg-white/80 backdrop-blur-xs text-[0.9rem] text-gray-800 outline-none transition-all duration-300 ease-out placeholder:text-gray-400 focus:border-brand-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,32,69,0.08)]"
									onFocus={() => setFocusedField("email")}
									onBlur={() => setFocusedField(null)}
									autoComplete="email"
								/>
							</div>

							{/* Password */}
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
										className="w-full px-4 py-3 pr-12 border-[1.5px] border-black/8 rounded-[14px] bg-white/80 backdrop-blur-xs text-[0.9rem] text-gray-800 outline-none transition-all duration-300 ease-out placeholder:text-gray-400 focus:border-brand-primary focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,32,69,0.08)]"
										onFocus={() => setFocusedField("password")}
										onBlur={() => setFocusedField(null)}
										autoComplete="current-password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 p-1 flex items-center justify-center transition-colors duration-200 rounded-md hover:text-brand-primary hover:bg-[rgba(0,32,69,0.06)]"
											aria-label={showPassword ? t("auth.login.passwordHide") : t("auth.login.passwordShow")}
									>
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
							</div>

							{/* Error */}
							{state?.error && (
								<div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-xl mb-4 animate-shake" role="alert">
									<AlertCircle size={16} className="text-red-600 shrink-0" />
									<p className="text-red-600 text-[0.85rem] font-medium">{t(state.error)}</p>
								</div>
							)}

							{/* Submit */}
							<button
								type="submit"
								disabled={pending}
								id="login-submit-btn"
								className="flex items-center justify-center gap-2 py-3.5 border-none rounded-[14px] bg-brand-primary text-white text-[0.85rem] font-semibold tracking-wide cursor-pointer transition-all duration-300 ease-out mb-6 hover:bg-[#003066] hover:shadow-[0_6px_24px_rgba(0,32,69,0.25)] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 active:shadow-[0_2px_8px_rgba(0,32,69,0.15)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
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
								<Link href={registerHref} className="text-brand-primary font-semibold no-underline ml-1 transition-all duration-200 hover:text-[#003066] hover:underline">
									{t("auth.login.createAccount")}
								</Link>
							</p>
						</form>
					</div>
				</div>
			</div>

			{/* ===== FOOTER ===== */}
			<footer className="flex dark:bg-slate-900 flex-col md:flex-row items-center justify-between w-full max-w-240 px-7 py-4 mt-0 bg-white rounded-b-2xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] gap-3 md:gap-0">
				<p className=" dark:text-slate-50 text-brand-primary italic font-semibold text-[0.8rem] tracking-wide">CLARIS</p>
				<div className="flex gap-5">
					<Link href={privacyHref} target="_blank" className="text-gray-400 text-[0.72rem] no-underline tracking-wide transition-colors duration-200 hover:text-brand-primary">
						{t("footer.privacy")}
					</Link>
					<Link href={termsHref} target="_blank" className="text-gray-400 text-[0.72rem] no-underline tracking-wide transition-colors duration-200 hover:text-brand-primary">
						{t("footer.terms")}
					</Link>
					<Link href={supportHref} target="_blank" className="text-gray-400 text-[0.72rem] no-underline tracking-wide transition-colors duration-200 hover:text-brand-primary">
						{t("footer.support")}
					</Link>
				</div>
				<p className="text-gray-400 text-[0.72rem] tracking-wide">© 2024 CLARIS ORGANIZATION</p>
			</footer>
		</div>
	);
}
