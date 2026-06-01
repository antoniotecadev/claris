import Image from "next/image";
import Logo from "@/assets/images/lobo-SE.png";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Login() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_28%),linear-gradient(to_bottom,#e5eef9,#dbeafe)] px-4 py-8 text-slate-900 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_26%),linear-gradient(to_bottom,#020617,#0f172a)] dark:text-slate-50">
			<div className="flex w-full max-w-240 flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl md:flex-row dark:border-white/10 dark:bg-slate-950/70">
				<div className="side2 relative min-h-75 w-full overflow-hidden bg-slate-900 p-8 md:min-h-175 md:w-[45%] self-stretch">
					<div className="absolute inset-0 bg-linear-to-b from-[rgba(2,6,23,0.2)] via-[rgba(2,6,23,0.56)] to-[rgba(2,6,23,0.84)] pointer-events-none z-0" />
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.10),transparent_30%)]" />

					<div className="relative z-10 flex items-center gap-2.5">
						<Image src={Logo} alt="Claris Logo" className="w-16 h-auto" />
						<p className="text-white text-4xl font-semibold tracking-wider">CLARIS</p>
					</div>

					<div className="relative z-10 flex flex-col items-center gap-3.5 text-center">
						<div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/30 bg-white/10 px-3.5 py-1.5 text-xs tracking-wide text-amber-100 backdrop-blur-sm animate-pulse">
							<Sparkles size={14} />
							<span>Escrituras para hoje</span>
						</div>
						<p className="text-[50px] italic text-center font-serif text-white leading-tight">"Que tudo seja feito com decência e ordem"</p>
						<p className="text-[24px] text-sky-200/80">— 1 Coríntios 14:40</p>
					</div>
					<div className="relative z-10 flex justify-center gap-2">
						<span className="h-2 w-6 rounded bg-amber-200 transition-all duration-300" />
						<span className="h-2 w-2 rounded-full bg-white/30 transition-all duration-300" />
						<span className="h-2 w-2 rounded-full bg-white/30 transition-all duration-300" />
					</div>
				</div>

				<div className="w-full md:w-[55%] flex flex-col justify-center bg-[linear-gradient(180deg,rgba(248,250,252,0.92),rgba(241,245,249,0.95))] p-7 self-stretch md:p-10 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.96))]">
					<div className="mx-auto flex w-full max-w-4xl flex-col px-2 md:px-0">
						<p className="mb-2 font-serif text-[36px] italic text-slate-900 dark:text-white">Comece sua jornada de gestão.</p>
						<p className="mb-8 text-slate-500 dark:text-slate-300">Crie uma conta administrativa para gerenciar a presença digital da sua igreja.</p>

						<div className="mb-6 flex gap-3">
							<p className="rounded-2xl bg-amber-200 px-4 text-slate-900 dark:bg-amber-300">1</p>
							<p className="text-sky-800 dark:text-sky-300">Dados pessoais</p>
						</div>

						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
							<div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
								<label className="mb-1 block text-slate-500 dark:text-slate-300">Nome completo</label>
								<input type="text" required placeholder="ex. Delson Pedro" className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500" />

								<label className="mb-1 block text-slate-500 dark:text-slate-300">Senha</label>
								<input type="password" required placeholder="........" className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500" />

								<label className="mb-1 block text-slate-500 dark:text-slate-300">Confirmar senha</label>
								<input type="password" required placeholder="........" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500" />
							</div>

							<div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
								<label className="mb-1 block text-slate-500 dark:text-slate-300">E-mail</label>
								<input type="email" required placeholder="ex. delsonpedro@church.com" className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500" />

								<label className="mb-1 block text-slate-500 dark:text-slate-300">Telefone</label>
								<input type="text" required placeholder="9xx xxx xxx" className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500" />

								<label className="mb-1 block text-slate-500 dark:text-slate-300">Foto</label>
								<input type="file" accept="image/png" className="w-full rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-3 text-slate-600 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-300" />
							</div>
						</div>

						<div className="mt-6 mb-6 flex gap-3">
							<p className="rounded-2xl bg-amber-200 px-4 text-slate-900 dark:bg-amber-300">2</p>
							<p className="text-sky-800 dark:text-sky-300">Dados da igreja</p>
						</div>

						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
							<div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
								<label className="mb-1 block text-slate-500 dark:text-slate-300">Nome da igreja</label>
								<input type="text" required placeholder="ex. Jesus Cristo" className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500" />

								<label className="mb-1 block text-slate-500 dark:text-slate-300">Localização</label>
								<input type="text" required placeholder="município, bairro .." className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500" />
							</div>

							<div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
								<label className="mb-1 block text-slate-500 dark:text-slate-300">E-mail da igreja</label>
								<input type="text" required placeholder="ex. contato@church.com" className="mb-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400 focus:border-sky-700 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-100 dark:placeholder:text-slate-500" />

								<label className="mb-1 block text-slate-500 dark:text-slate-300">Logo</label>
								<input type="file" accept="image/png" className="w-full rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-3 text-slate-600 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-300" />
							</div>
						</div>

						<div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<button type="submit" className="inline-flex items-center justify-center gap-4 rounded-2xl bg-slate-950 px-6 py-4 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_18px_30px_rgba(15,23,42,0.18)] dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200">
								<p>CRIAR CONTA</p>
								<ArrowRight size={20} />
							</button>
							<p className="text-sm text-slate-500 dark:text-slate-300">Já tens uma conta na Claris? <span className="font-semibold text-sky-800 dark:text-sky-300">Entrar</span></p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}





