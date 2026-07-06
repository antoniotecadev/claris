"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/images/lobo-SE.png";
import { ArrowRight, Eye, EyeOff, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { GoogleAuthButton } from "@/components/ui/google-auth-button";
import { registerAction } from "@/utils/actionsRegister";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { addLocaleToPathname } from "@/i18n/routing";
import { useMessages } from "@/i18n/messages";

export default function RegisterUser() {
	const { locale, t } = useMessages();
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

	const calculateAge = (birthDate: string) => {
		if (!birthDate) return 0;
		const birth = new Date(birthDate);
		const today = new Date();
		let age = today.getFullYear() - birth.getFullYear();
		const monthDiff = today.getMonth() - birth.getMonth();
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
			age--;
		}
		return age;
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setFields(prev => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const setUser = useUserStore((state) => state.setUser);
	const router = useRouter();
	const loginHref = addLocaleToPathname("/login", locale);
	const termsHref = addLocaleToPathname("/termos-condicoes", locale);
	const privacyHref = addLocaleToPathname("/politica-privacidade", locale);
	const supportHref = addLocaleToPathname("/contacto-suporte", locale);

	const [state, formAction, pending] = useActionState(registerAction, initialState);

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [focusedField, setFocusedField] = useState<string | null>(null);

	useEffect(() => {
		if (state.success && state.user) {
			setUser(state.user);
			router.push(addLocaleToPathname("/mainDash", locale));
		}
	}, [state, router, setUser, locale]);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_28%),linear-gradient(to_bottom,#e5eef9,#dbeafe)] px-4 py-8 text-slate-900 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_26%),linear-gradient(to_bottom,#020617,#0f172a)] dark:text-slate-50">
			<div className="flex w-full max-w-240 flex-col overflow-hidden rounded-t-2xl border border-white/60 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl md:flex-row dark:border-white/10 dark:bg-slate-950/70">
				<div className="side2 relative min-h-75 w-full flex flex-col justify-between overflow-hidden bg-slate-900 p-8 md:min-h-175 md:w-[45%] self-stretch">
					<div className="absolute inset-0 bg-linear-to-b from-[rgba(2,6,23,0.2)] via-[rgba(2,6,23,0.56)] to-[rgba(2,6,23,0.84)] pointer-events-none z-0" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.10),transparent_30%)]" />

					<div className="relative z-10 flex items-center gap-2.5">
						<div className="w-9 h-10.5 flex items-center justify-center">
							<img src={Logo.src} alt="Claris Logo" className="w-full h-full object-contain" />
						</div>
						<p className="text-white text-2xl font-semibold tracking-wider">CLARIS</p>
					</div>

					<div className="relative z-10 flex flex-col items-center gap-3.5 text-center">
						<div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/30 bg-white/10 px-3.5 py-1.5 text-xs tracking-wide text-amber-100 backdrop-blur-sm animate-pulse">
							<Sparkles size={14} />
							<span>{t("auth.register.scriptureLabel")}</span>
						</div>
						<p className="text-white text-xl md:text-2xl leading-relaxed italic font-serif max-w-[340px] mb-2">
							&quot;{t("auth.register.scriptureTitle")}&quot;
						</p>
						<p className="text-[#86A0CD] text-sm md:text-base text-center">
							{t("auth.register.scriptureDescription")}
						</p>
					</div>

					<div className="relative z-10 flex justify-center gap-2">
						<span className="h-2 w-6 rounded bg-amber-200 transition-all duration-300" />
						<span className="h-2 w-2 rounded-full bg-white/30 transition-all duration-300" />
						<span className="h-2 w-2 rounded-full bg-white/30 transition-all duration-300" />
					</div>
				</div>

				<div className="w-full md:w-[55%] flex items-center justify-center gradientes p-7 md:p-10 self-stretch">
					<div className="mx-auto flex w-full max-w-100 flex-col">
						<div className="mb-6">
							<p className="text-[1.65rem] font-bold text-gray-900 font-serif italic mb-1.5">
								{t("auth.register.title")}
							</p>
							<p className="text-gray-500 text-[0.9rem] leading-relaxed">
								{t("auth.register.subtitle")}
							</p>
						</div>

						<GoogleAuthButton text={t("auth.register.google")} />

						{/* Divider */}
						<div className="flex items-center gap-4 mb-5">
							<div className="flex-1 h-px bg-[#c9c9c9]" />
							<span className="text-[0.65rem] text-gray-400 tracking-widest font-medium whitespace-nowrap">
								{t("auth.register.divider")}
							</span>
							<div className="flex-1 h-px bg-[#c9c9c9]" />
						</div>

						{/* Form */}
						<form action={formAction} className="flex flex-col w-full">
							<input type="hidden" name="locale" value={locale} />
							{/* Nome completo */}
							<div className={`mb-4 transition-transform duration-200 ${focusedField === "displayName" ? "translate-x-0.5" : ""}`}>
								<label htmlFor="displayName" className="block mb-2 text-[0.7rem] font-semibold text-gray-500 tracking-wider">
									{t("auth.register.fullName")}
								</label>
								<input
									type="text"
									id="displayName"
									name="displayName"
									value={fields.displayName}
									onChange={handleChange}
									required
									placeholder={t("auth.register.fullNamePlaceholder")}
									className="w-full px-4 py-2.5 border-[1.5px] border-black/8 rounded-[14px] bg-white/80 backdrop-blur-xs text-[0.9rem] text-gray-800 outline-none transition-all duration-300 ease-out placeholder:text-gray-400 focus:border-[#002045] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,32,69,0.08)]"
									onFocus={() => setFocusedField("displayName")}
									onBlur={() => setFocusedField(null)}
								/>
							</div>

							<div className={`mb-4 transition-transform duration-200 ${focusedField === "email" ? "translate-x-0.5" : ""}`}>
								<label htmlFor="email" className="block mb-2 text-[0.7rem] font-semibold text-gray-500 tracking-wider">
									{t("auth.register.email")}
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={fields.email}
									onChange={handleChange}
									required
									placeholder={t("auth.register.emailPlaceholder")}
									className="w-full px-4 py-2.5 border-[1.5px] border-black/[0.08] rounded-[14px] bg-white/80 backdrop-blur-xs text-[0.9rem] text-gray-800 outline-none transition-all duration-300 ease-out placeholder:text-gray-400 focus:border-[#002045] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,32,69,0.08)]"
									onFocus={() => setFocusedField("email")}
									onBlur={() => setFocusedField(null)}
									autoComplete="email"
								/>
							</div>

							{/* Gênero e Data de Nascimento */}
							<div className="flex gap-4 mb-4">
								<div className={`flex flex-col flex-1 transition-transform duration-200 ${focusedField === "gender" ? "translate-x-0.5" : ""}`}>
										<label htmlFor="gender" className="block mb-2 text-[0.7rem] font-semibold text-gray-500 tracking-wider">
											{t("auth.register.gender")}
										</label>
									<select
										id="gender"
										name="gender"
										value={fields.gender}
										onChange={handleChange}
										required
										className="w-full appearance-none rounded-[14px] border-[1.5px] border-slate-200 bg-white/80 px-4 py-2.5 text-[0.9rem] text-slate-800 outline-none backdrop-blur-xs transition-all duration-300 ease-out focus:border-sky-700 focus:bg-white focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)] dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:focus:bg-white/8"
										onFocus={() => setFocusedField("gender")}
										onBlur={() => setFocusedField(null)}
									>
											<option value="" disabled hidden>{t("auth.register.genderPlaceholder")}</option>
											<option value="masculino">{t("auth.register.genderMale")}</option>
											<option value="feminino">{t("auth.register.genderFemale")}</option>
									</select>
								</div>

								<div className={`flex flex-col flex-1 transition-transform duration-200 ${focusedField === "birthDate" ? "translate-x-0.5" : ""}`}>
									<label htmlFor="birthDate" className="block mb-2 text-[0.7rem] font-semibold text-gray-500 tracking-wider">
										{t("auth.register.birthDate")}
									</label>
									<input
										type="date"
										id="birthDate"
										name="birthDate"
										value={fields.birthDate}
										onChange={handleChange}
										required
										className="w-full rounded-[14px] border-[1.5px] border-slate-200 bg-white/80 px-4 py-2.5 text-[0.9rem] text-slate-800 outline-none backdrop-blur-xs transition-all duration-300 ease-out focus:border-sky-700 focus:bg-white focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)] dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:focus:bg-white/8"
										onFocus={() => setFocusedField("birthDate")}
										onBlur={() => setFocusedField(null)}
									/>
									{fields.birthDate && calculateAge(fields.birthDate) < 13 && (
										<p className="text-red-600 text-[0.7rem] mt-1.5 ml-1 font-medium flex items-center gap-1">
											{t("auth.register.minimumAge")}
										</p>
									)}
								</div>
							</div>

							<div className={`mb-4 transition-transform duration-200 ${focusedField === "password" ? "translate-x-0.5" : ""}`}>
								<label htmlFor="password" className="block mb-2 text-[0.7rem] font-semibold text-gray-500 tracking-wider">
									{t("auth.register.password")}
								</label>
								<div className="relative">
									<input
										type={showPassword ? "text" : "password"}
										id="password"
										name="password"
										required
										placeholder="••••••••"
										className="w-full rounded-[14px] border-[1.5px] border-slate-200 bg-white/80 px-4 py-2.5 pr-12 text-[0.9rem] text-slate-800 outline-none backdrop-blur-xs transition-all duration-300 ease-out placeholder:text-slate-400 focus:border-sky-700 focus:bg-white focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)] dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-white/8"
										onFocus={() => setFocusedField("password")}
										onBlur={() => setFocusedField(null)}
										autoComplete="new-password"
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md border-none bg-transparent p-1 text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-sky-800 dark:hover:bg-white/8 dark:hover:text-sky-300"
										aria-label={showPassword ? t("auth.login.passwordHide") : t("auth.login.passwordShow")}
									>
										{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
								<p className="text-gray-400 text-[0.7rem] mt-1.5 ml-1">{t("auth.register.passwordHint")}</p>
							</div>

							<div className={`mb-5 transition-transform duration-200 ${focusedField === "confirmPassword" ? "translate-x-0.5" : ""}`}>
								<label htmlFor="confirmPassword" className="block mb-2 text-[0.7rem] font-semibold text-gray-500 tracking-wider">
									{t("auth.register.confirmPassword")}
								</label>
								<div className="relative">
									<input
										type={showConfirmPassword ? "text" : "password"}
										id="confirmPassword"
										name="confirmPassword"
										required
										placeholder="••••••••"
										className="w-full rounded-[14px] border-[1.5px] border-slate-200 bg-white/80 px-4 py-2.5 pr-12 text-[0.9rem] text-slate-800 outline-none backdrop-blur-xs transition-all duration-300 ease-out placeholder:text-slate-400 focus:border-sky-700 focus:bg-white focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)] dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-white/8"
										onFocus={() => setFocusedField("confirmPassword")}
										onBlur={() => setFocusedField(null)}
										autoComplete="new-password"
									/>
									<button
										type="button"
										onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md border-none bg-transparent p-1 text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-sky-800 dark:hover:bg-white/8 dark:hover:text-sky-300"
										aria-label={showConfirmPassword ? t("auth.login.passwordHide") : t("auth.login.passwordShow")}
									>
										{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
									</button>
								</div>
							</div>

							<div className="mb-5 flex items-start gap-2">
								<input
									type="checkbox"
									id="terms"
									name="terms"
									required
									className="mt-1 h-4 w-4 cursor-pointer rounded border-slate-300 bg-slate-100 text-sky-800 focus:ring-sky-700 dark:border-white/20 dark:bg-white/10"
								/>
								<p className="text-[0.75rem] text-gray-600 leading-relaxed">
									<label htmlFor="terms" className="cursor-pointer select-none">
									{t("auth.register.termsPrefix")} {" "}
									</label>
									<Link
										href={termsHref}
										target="_blank"
										className="text-[#002045] font-semibold hover:underline"
									>
										{t("auth.register.terms")}
									</Link>{" "}
									<span>{t("auth.register.and")} </span>
									<Link
										href={privacyHref}
										target="_blank"
										className="text-[#002045] font-semibold hover:underline"
									>
										{t("auth.register.privacy")}
									</Link>.
								</p>
							</div>

							{state?.error && (
								<div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 animate-shake dark:border-red-400/20 dark:bg-red-500/10" role="alert">
									<AlertCircle size={16} className="text-red-600 shrink-0" />
								<p className="text-[0.85rem] font-medium text-red-600 dark:text-red-200">
									{state.error === "MINIMUM_AGE_ERROR" 
										? t("auth.register.minimumAge")
										: t(state.error)
									}
								</p>
							</div>
						)}

						<button
							type="submit"
							disabled={pending || (fields.birthDate !== "" && calculateAge(fields.birthDate) < 13)}
								className="mb-6 flex items-center justify-center gap-2 rounded-[14px] border-none bg-slate-950 py-3.5 text-[0.85rem] font-semibold tracking-wide text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_12px_28px_rgba(15,23,42,0.2)] active:translate-y-0 active:scale-[0.98] active:shadow-[0_2px_8px_rgba(15,23,42,0.15)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200"
							>
								{pending ? (
									<>
										<Loader2 size={18} className="animate-spin" />
										<span>{t("auth.register.submitting")}</span>
									</>
								) : (
									<>
										<span>{t("auth.register.submit")}</span>
										<ArrowRight size={18} />
									</>
								)}
							</button>

							<div className="flex items-center gap-4 mb-2">
								<div className="flex-1 h-px bg-[#c9c9c9]" />
								<p className="text-gray-500 text-sm">
									{t("auth.register.already")} {" "}
									<Link href={loginHref} className="text-[#002045] font-semibold no-underline ml-1 transition-all duration-200 hover:text-[#003066] hover:underline">
										{t("auth.register.login")}
									</Link>
								</p>
								<div className="h-px flex-1 bg-slate-300 dark:bg-white/10" />
							</div>
						</form>
					</div>
				</div>
			</div>

			<footer className="dark:bg-slate-900 flex flex-col md:flex-row items-center justify-between w-full max-w-240 px-7 py-4 mt-0 bg-white rounded-b-2xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] gap-3 md:gap-0">
				<p className="dark:text-slate-50 text-[#002045] italic font-semibold text-[0.8rem] tracking-wide">CLARIS</p>
				<div className="flex gap-5">
					<Link href={privacyHref} target="_blank" className="text-gray-400 text-[0.72rem] no-underline tracking-wide transition-colors duration-200 hover:text-[#002045]">
						{t("footer.privacy")}
					</Link>
					<Link href={termsHref} target="_blank" className="text-gray-400 text-[0.72rem] no-underline tracking-wide transition-colors duration-200 hover:text-[#002045]">
						{t("footer.terms")}
					</Link>
					<Link href={supportHref} target="_blank" className="text-gray-400 text-[0.72rem] no-underline tracking-wide transition-colors duration-200 hover:text-[#002045]">
						{t("footer.support")}
					</Link>
				</div>
				<p className="text-gray-400 text-[0.72rem] tracking-wide">© 2024 CLARIS ORGANIZATION</p>
			</footer>
		</div>
	);
}
