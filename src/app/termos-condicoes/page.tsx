"use client";

import { useMessages } from "@/i18n/messages";

export default function TermosCondicoesPage() {
	const { t } = useMessages();

	return (
		<main className="min-h-screen bg-gray-50 dark:bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.16),_transparent_32%),linear-gradient(to_bottom,_#0f172a,_#020617)]">
			<section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
				<div className="max-w-3xl">
					<h1 className="text-3xl md:text-4xl font-bold dark:text-slate-50 text-[#1A365D]">
						{t("legal.terms.title")}
					</h1>
					<p className="text-gray-500 dark:text-slate-500 mt-2">{t("legal.terms.updated")}</p>

					<div className="mt-8 space-y-8 text-gray-700 dark:text-slate-400">
						<section>
							<h2 className="text-xl md:text-2xl font-semibold dark:text-slate-300 text-[#1A365D]">
								{t("legal.terms.sections.acceptTitle")}
							</h2>
							<p className="mt-2">{t("legal.terms.sections.acceptText")}</p>
						</section>

						<section>
							<h2 className="text-xl md:text-2xl font-semibold dark:text-slate-300 text-[#1A365D]">
								{t("legal.terms.sections.useTitle")}
							</h2>
							<ul className="mt-2 list-disc pl-5 space-y-2">
								<li>{t("legal.terms.sections.useItems.0")}</li>
								<li>{t("legal.terms.sections.useItems.1")}</li>
								<li>{t("legal.terms.sections.useItems.2")}</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl md:text-2xl font-semibold dark:text-slate-300 text-[#1A365D]">
								{t("legal.terms.sections.contentTitle")}
							</h2>
							<p className="mt-2">{t("legal.terms.sections.contentText")}</p>
						</section>

						<section>
							<h2 className="text-xl md:text-2xl font-semibold dark:text-slate-300 text-[#1A365D]">
								{t("legal.terms.sections.suspensionTitle")}
							</h2>
							<p className="mt-2">{t("legal.terms.sections.suspensionText")}</p>
						</section>

						<section>
							<h2 className="text-xl md:text-2xl font-semibold dark:text-slate-300 text-[#1A365D]">
								{t("legal.terms.sections.liabilityTitle")}
							</h2>
							<p className="mt-2">{t("legal.terms.sections.liabilityText")}</p>
						</section>

						<section>
							<h2 className="text-xl md:text-2xl font-semibold dark:text-slate-300 text-[#1A365D]">
								{t("legal.terms.sections.contactTitle")}
							</h2>
							<p className="mt-2">{t("legal.terms.sections.contactText")}</p>
						</section>
					</div>
				</div>
			</section>
		</main>
	);
}
