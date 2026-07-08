import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Offline",
	robots: {
		index: false,
		follow: false,
	},
};

export default function OfflinePage() {
	return (
		<main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
			<section className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center">
				<p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">
					Claris offline
				</p>
				<h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
					Sem ligação à internet
				</h1>
				<p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
					Algumas páginas já visitadas podem continuar disponíveis. Quando a ligação
					voltar, actualize a página para sincronizar os dados mais recentes.
				</p>
				<div className="mt-8 flex flex-wrap gap-3">
					<Link
						href="/"
						className="inline-flex h-11 items-center justify-center rounded-md bg-blue-700 px-5 text-sm font-semibold text-white transition hover:bg-blue-800"
					>
						Voltar ao início
					</Link>
					<Link
						href="/contacto-suporte"
						className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 px-5 text-sm font-semibold transition hover:bg-white dark:border-slate-700 dark:hover:bg-slate-900"
					>
						Suporte
					</Link>
				</div>
			</section>
		</main>
	);
}
