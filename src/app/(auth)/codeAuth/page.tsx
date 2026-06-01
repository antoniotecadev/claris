"use client"

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
		const digit = value.replace(/\D/g, "")
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
		// TODO: Call an API to actually resend the code
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#e8eaed] p-6">
			{/* ===== MAIN CARD ===== */}
			<div className="flex flex-col md:flex-row w-full max-w-240 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,20,60,0.12),0_4px_20px_rgba(0,20,60,0.06)] bg-white">

				{/* ===== LEFT PANEL — Image + Quote ===== */}
				<div className="side1 bg-slate-800 w-full md:w-[45%] flex flex-col justify-between p-8 relative overflow-hidden min-h-75 md:min-h-155 self-stretch">
					{/* Dark overlay */}
					<div className="absolute inset-0 bg-linear-to-b from-[rgba(0,32,69,0.15)] to-[rgba(0,32,69,0.55)] pointer-events-none z-0" />

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
							<span>{t("auth.code.label")}</span>
						</div>
						<p className="text-white text-xl md:text-2xl leading-relaxed italic font-serif max-w-[340px]">
								&quot;{t("auth.code.quote")}&quot;
						</p>
					</div>

					{/* Decorative dots */}
					<div className="flex gap-2 justify-center relative z-10">
						<span className="w-2 h-2 rounded-full bg-white/30 transition-all duration-300" />
						<span className="w-6 h-2 rounded bg-[#ffdea5] transition-all duration-300" />
						<span className="w-2 h-2 rounded-full bg-white/30 transition-all duration-300" />
					</div>
				</div>

				{/* ===== RIGHT PANEL — Form ===== */}
				<div className="w-full md:w-[55%] flex flex-col items-center justify-center bg-[#fafafa] p-7 md:p-10 self-stretch">
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

						{/* Code Input */}
						<div className="flex gap-2 sm:gap-3 justify-center mb-8 w-full" dir="ltr">
							{digits.map((digit, idx) => (
								<input
									key={idx}
									ref={(el) => { inputRefs.current[idx] = el; }}
									type="text"
									inputMode="numeric"
									maxLength={1}
									value={digit}
									onChange={(e) => handleChange(e.target.value, idx)}
									onKeyDown={(e) => handleKeyDown(e, idx)}
									onPaste={handlePaste}
									className="w-12 h-14 sm:w-14 sm:h-16 bg-white border-[1.5px] border-gray-200 rounded-[14px] text-[1.5rem] font-medium text-center text-gray-800 outline-none transition-all duration-300 ease-out focus:border-[#002045] focus:shadow-[0_0_0_3px_rgba(0,32,69,0.08)] focus:-translate-y-1"
								/>
							))}
						</div>

						{/* Error */}
						{error && (
							<div className="flex items-center gap-2 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-xl w-full mb-6 animate-shake" role="alert">
								<AlertCircle size={16} className="text-red-600 shrink-0" />
								<p className="text-red-600 text-[0.85rem] font-medium">{error}</p>
							</div>
						)}

						{/* Verify Button */}
						<button
							onClick={handleVerify}
							disabled={getCode().length < 6 || pending}
							className="flex items-center justify-center gap-2 w-full py-3.5 border-none rounded-[14px] bg-[#002045] text-white text-[0.85rem] font-semibold tracking-wide cursor-pointer transition-all duration-300 ease-out mb-4 hover:bg-[#003066] hover:shadow-[0_6px_24px_rgba(0,32,69,0.25)] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 active:shadow-[0_2px_8px_rgba(0,32,69,0.15)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
						>
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

			{/* ===== FOOTER ===== */}
			<footer className="flex flex-col md:flex-row items-center justify-between w-full max-w-240 px-7 py-4 mt-0 bg-white rounded-b-2xl shadow-[0_4px_12px_rgba(0,0,0,0.03)] gap-3 md:gap-0">
				<p className="text-[#002045] italic font-semibold text-[0.8rem] tracking-wide">CLARIS</p>
				<div className="flex gap-5">
					<Link href="/politica-privacidade" className="text-gray-400 text-[0.72rem] no-underline tracking-wide transition-colors duration-200 hover:text-[#002045]">Política de Privacidade</Link>
					<Link href="/termos-condicoes" className="text-gray-400 text-[0.72rem] no-underline tracking-wide transition-colors duration-200 hover:text-[#002045]">Termos de serviço</Link>
					<Link href="/contacto-suporte" className="text-gray-400 text-[0.72rem] no-underline tracking-wide transition-colors duration-200 hover:text-[#002045]">Contactos</Link>
				</div>
				<p className="text-gray-400 text-[0.72rem] tracking-wide">© 2024 CLARIS ORGANIZATION</p>
			</footer>
		</div>
	);
}

export default function CodeAuth() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center bg-[#e8eaed] text-[#002045]">
					<Loader2 className="mr-2 animate-spin" size={20} />
					<span>A carregar verificação...</span>
				</div>
			}
		>
			<CodeAuthContent />
		</Suspense>
	);
}
