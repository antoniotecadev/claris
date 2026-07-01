"use client";

import Image from "next/image";
import { Suspense, useRef, useState, useEffect } from "react";
import Logo from "@/assets/images/lobo-SE.png"
import { useSearchParams, useRouter } from "next/navigation";
import { sendCodeAction } from "@/utils/actionSendCode";
import { Loader2, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import  Link  from "next/link"
import { addLocaleToPathname } from "@/i18n/routing";
import { useMessages } from "@/i18n/messages";

function CodeAuthContent() {
	const { locale, t } = useMessages();
	const searchParams = useSearchParams();
	const email = searchParams.get("email") || "";
	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | undefined>(undefined);
	const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
	const [countdown, setCountdown] = useState(180);
	const router = useRouter();

	useEffect(() => {
		if (countdown <= 0) return;
		const timer = setInterval(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);
		return () => clearInterval(timer);
	}, [countdown]);

	const formatCountdown = () => {
		const m = Math.floor(countdown / 60).toString().padStart(2, "0");
		const s = (countdown % 60).toString().padStart(2, "0");
		return `${m}:${s}`;
	};

	const getCode = () => digits.join("");

	const handleChange = (value: string, idx: number) => {
		const digit = value.replace(/\D/g, "");
		const newDigits = [...digits];
		newDigits[idx] = digit;
		setDigits(newDigits);

		if (digit && idx < 5) {
			inputRefs.current[idx + 1]?.focus();
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
		if (e.key === "Backspace") {
			if (digits[idx] === "" && idx > 0) {
				const newDigits = [...digits];
				newDigits[idx - 1] = "";
				setDigits(newDigits);
				inputRefs.current[idx - 1]?.focus();
			} else {
				const newDigits = [...digits];
				newDigits[idx] = "";
				setDigits(newDigits);
			}
		}
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
		const newDigits = Array(6).fill("");
		pasted.split("").forEach((char, i) => (newDigits[i] = char));
		setDigits(newDigits);
		inputRefs.current[Math.min(pasted.length, 5)]?.focus();
	};

	const handleVerify = async () => {
		setPending(true);
		setError(undefined);
		const code = getCode();
		if (code.length < 6) {
			setPending(false);
			return;
		}
		
		const result = await sendCodeAction(undefined, code, email, locale);
		if (result?.error) {
			setError(result.error);
			setPending(false);
		} else {
			// If success, we should redirect to mainDash
			router.push(addLocaleToPathname("/mainDash", locale));
		}
	};

	const handleResend = () => {
		if (countdown > 0) return;
		setCountdown(300);
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center  px-4 py-8 text-slate-900 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_26%),linear-gradient(to_bottom,#020617,#0f172a)] dark:text-slate-50">
			<div className="flex w-full max-w-240 flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl md:flex-row dark:border-white/10 dark:bg-slate-950/70">
				<div className="side1 relative min-h-75 w-full flex flex-col justify-between overflow-hidden bg-slate-900 p-8 md:min-h-155 md:w-[45%] self-stretch">
					<div className="absolute inset-0 bg-linear-to-b from-[rgba(2,6,23,0.2)] via-[rgba(2,6,23,0.55)] to-[rgba(2,6,23,0.82)] pointer-events-none z-0" />
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
							<span>{t("auth.code.label")}</span>
						</div>
						<p className="text-white text-xl md:text-2xl leading-relaxed italic font-serif max-w-85">
								&quot;{t("auth.code.quote")}&quot;
						</p>
					</div>

					<div className="relative z-10 flex justify-center gap-2">
						<span className="h-2 w-2 rounded-full bg-white/30 transition-all duration-300" />
						<span className="h-2 w-6 rounded bg-amber-200 transition-all duration-300" />
						<span className="h-2 w-2 rounded-full bg-white/30 transition-all duration-300" />
					</div>
				</div>

				{/* ===== RIGHT PANEL — Form ===== */}
				<div className="w-full md:w-[55%] flex flex-col items-center justify-center bg-white p-7 md:p-10 self-stretch dark:bg-slate-900">
					<div className="w-full max-w-100 flex flex-col items-center">

						{/* Heading */}
						<div className="text-center mb-8 w-full">
							<p className="text-[1.65rem] font-bold text-gray-900 font-serif italic mb-2">
								{t("auth.code.title")}
							</p>
							<p className="text-gray-500 text-[0.9rem] leading-relaxed">
								{t("auth.code.subtitle")} <br/>
								<strong className="text-[#002045] block mt-1">{email}</strong>
							</p>
						</div>

						<div className="flex w-full justify-center gap-2 sm:gap-3" dir="ltr">
							{digits.map((digit, idx) => (
								<input key={idx} ref={(el) => { inputRefs.current[idx] = el; }} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleChange(e.target.value, idx)} onKeyDown={(e) => handleKeyDown(e, idx)} onPaste={handlePaste} className="h-14 w-12 rounded-[14px] border-[1.5px] border-slate-200 bg-white px-4 text-center text-[1.5rem] font-medium text-slate-800 outline-none transition-all duration-300 ease-out focus:-translate-y-1 focus:border-sky-700 focus:shadow-[0_0_0_3px_rgba(14,165,233,0.12)] sm:h-16 sm:w-14 dark:border-white/10 dark:bg-white/5 dark:text-slate-100" />
							))}
						</div>

						{error && (
							<div className="mb-6 mt-8 flex w-full items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 animate-shake dark:border-red-400/20 dark:bg-red-500/10" role="alert">
								<AlertCircle size={16} className="text-red-600 shrink-0" />
								<p className="text-[0.85rem] font-medium text-red-600 dark:text-red-200">{t(error)}</p>
							</div>
						)}

						<button onClick={handleVerify} disabled={getCode().length < 6 || pending} className="mt-8 mb-4 flex w-full items-center justify-center gap-2 rounded-[14px] border-none bg-slate-950 py-3.5 text-[0.85rem] font-semibold tracking-wide text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_12px_28px_rgba(15,23,42,0.2)] active:translate-y-0 active:scale-[0.98] active:shadow-[0_2px_8px_rgba(15,23,42,0.15)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200">
							{pending ? (
								<>
									<Loader2 size={18} className="animate-spin" />
									<span>{t("auth.code.verifying")}</span>
								</>
							) : (
								<>
									<span>{t("auth.code.verify")}</span>
									<ArrowRight size={18} />
								</>
							)}
						</button>

						{/* Resend Button */}
						<button
							onClick={handleResend}
							disabled={countdown > 0}
							className="flex items-center justify-center w-full py-3.5 border border-gray-200 rounded-[14px] bg-white text-[#002045] text-[0.85rem] font-semibold tracking-wide cursor-pointer transition-all duration-300 ease-out mb-8 hover:bg-gray-50 hover:shadow-sm active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
						>
							{countdown > 0
								? t("auth.code.resendCountdown", { time: formatCountdown() })
								: t("auth.code.resend")}
						</button>

						{/* Bottom Quote */}
						<div className="mt-auto pt-4 w-full border-t border-gray-200 text-center">
							<p className="text-gray-500 text-sm italic">
									&quot;{t("auth.code.footerQuote")}&quot; <br/>
								<span className="text-[#002045] font-medium not-italic block mt-1">{t("auth.code.footerSource")}</span>
							</p>
						</div>
					</div>
				</div>
			</div>

			<footer className="mt-0 flex w-full max-w-240 flex-col items-center justify-between gap-3 rounded-b-2xl border border-t-0 border-white/60 bg-white/80 px-7 py-4 shadow-[0_4px_12px_rgba(15,23,42,0.04)] backdrop-blur-xl md:flex-row md:gap-0 dark:border-white/10 dark:bg-slate-950/70">
				<p className="text-[0.8rem] font-semibold italic tracking-wide text-slate-800 dark:text-slate-100">CLARIS</p>
				<div className="flex gap-5">
					<Link href="/politica-privacidade" className="text-[0.72rem] tracking-wide text-slate-400 no-underline transition-colors duration-200 hover:text-sky-800 dark:hover:text-sky-300">{t("footer.privacy")}</Link>
					<Link href="/termos-condicoes" className="text-[0.72rem] tracking-wide text-slate-400 no-underline transition-colors duration-200 hover:text-sky-800 dark:hover:text-sky-300">{t("footer.terms")}</Link>
					<Link href="/contacto-suporte" className="text-[0.72rem] tracking-wide text-slate-400 no-underline transition-colors duration-200 hover:text-sky-800 dark:hover:text-sky-300">{t("footer.support")}</Link>
				</div>
				<p className="text-[0.72rem] tracking-wide text-slate-400">© 2024 CLARIS ORGANIZATION</p>
			</footer>
		</div>
	);
}

export default function CodeAuth() {
	const { t } = useMessages();
	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center bg-[#e8eaed] text-[#002045]">
					<Loader2 className="mr-2 animate-spin" size={20} />
					<span>{t("common.loading")}</span>
				</div>
			}
		>
			<CodeAuthContent />
		</Suspense>
	);
}
