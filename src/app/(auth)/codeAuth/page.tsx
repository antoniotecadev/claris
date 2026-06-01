"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import Logo from "@/assets/images/lobo-SE.png";
import { useSearchParams, useRouter } from "next/navigation";
import { sendCodeAction } from "@/utils/actionSendCode";
import { Loader2, AlertCircle, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CodeAuth() {
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

		const result = await sendCodeAction(undefined, code, email);
		if (result?.error) {
			setError(result.error);
			setPending(false);
		} else {
			router.push('/mainDash');
		}
	};

	const handleResend = () => {
		if (countdown > 0) return;
		setCountdown(300);
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_28%),linear-gradient(to_bottom,#e5eef9,#dbeafe)] px-4 py-8 text-slate-900 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_26%),linear-gradient(to_bottom,#020617,#0f172a)] dark:text-slate-50">
			<div className="flex w-full max-w-240 flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl md:flex-row dark:border-white/10 dark:bg-slate-950/70">
				<div className="side1 relative min-h-75 w-full overflow-hidden bg-slate-900 p-8 md:min-h-155 md:w-[45%] self-stretch">
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
							<span>Momento de Reflexão</span>
						</div>
						<p className="max-w-85 font-serif text-xl italic leading-relaxed text-white md:text-2xl">
							"A paz é o silêncio da alma em harmonia com o eterno."
						</p>
					</div>

					<div className="relative z-10 flex justify-center gap-2">
						<span className="h-2 w-2 rounded-full bg-white/30 transition-all duration-300" />
						<span className="h-2 w-6 rounded bg-amber-200 transition-all duration-300" />
						<span className="h-2 w-2 rounded-full bg-white/30 transition-all duration-300" />
					</div>
				</div>

				<div className="w-full md:w-[55%] flex items-center justify-center bg-[linear-gradient(180deg,rgba(248,250,252,0.92),rgba(241,245,249,0.95))] p-7 self-stretch md:p-10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.96))]">
					<div className="flex w-full max-w-100 flex-col items-center">
						<div className="mb-8 w-full text-center">
							<p className="mb-2 font-serif text-[1.65rem] font-bold italic text-slate-900 dark:text-white">
								Confirme sua Identidade
							</p>
							<p className="text-[0.9rem] leading-relaxed text-slate-500 dark:text-slate-300">
								Para garantir a segurança do seu Claris, enviamos um código de verificação para: <br />
								<strong className="mt-1 block text-sky-800 dark:text-sky-300">{email}</strong>
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
								<p className="text-[0.85rem] font-medium text-red-600 dark:text-red-200">{error}</p>
							</div>
						)}

						<button onClick={handleVerify} disabled={getCode().length < 6 || pending} className="mt-8 mb-4 flex w-full items-center justify-center gap-2 rounded-[14px] border-none bg-slate-950 py-3.5 text-[0.85rem] font-semibold tracking-wide text-white transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_12px_28px_rgba(15,23,42,0.2)] active:translate-y-0 active:scale-[0.98] active:shadow-[0_2px_8px_rgba(15,23,42,0.15)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200">
							{pending ? (
								<>
									<Loader2 size={18} className="animate-spin" />
									<span>A verificar...</span>
								</>
							) : (
								<>
									<span>VERIFICAR CÓDIGO</span>
									<ArrowRight size={18} />
								</>
							)}
						</button>

						<button onClick={handleResend} disabled={countdown > 0} className="mb-8 flex w-full items-center justify-center rounded-[14px] border border-slate-200 bg-white py-3.5 text-[0.85rem] font-semibold tracking-wide text-sky-800 transition-all duration-300 ease-out hover:bg-slate-50 hover:shadow-sm active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-sky-200 dark:hover:bg-white/8">
							{countdown > 0 ? `Reenviar Código (${formatCountdown()})` : "Reenviar Código"}
						</button>

						<div className="mt-auto w-full border-t border-slate-200 pt-4 text-center dark:border-white/10">
							<p className="text-sm italic text-slate-500 dark:text-slate-300">
								"Tudo o que fizerem, façam de todo o coração." <br />
								<span className="mt-1 block font-medium not-italic text-sky-800 dark:text-sky-300">— Colossenses 3:23</span>
							</p>
						</div>
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