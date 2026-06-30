"use client";

import { useMessages } from "@/i18n/messages";

export default function PoliticaPrivacidadePage() {
	const { t } = useMessages();

	return (
		<main className="min-h-screen bg-gray-50 dark:bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.16),_transparent_32%),linear-gradient(to_bottom,_#0f172a,_#020617)]">
			<section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
				<div className="max-w-3xl">
					<h1 className="text-3xl md:text-4xl font-bold dark:text-slate-50 text-[#1A365D]">
						{t("legal.privacy.title")}
					</h1>
					<p className="dark:text-slate-500 text-gray-500 mt-2">{t("legal.privacy.updated")}</p>

					<div className="mt-8 space-y-8 text-gray-700 dark:text-slate-400">
						<section>
							<h2 className="text-xl md:text-2xl font-semibold dark:text-slate-300 text-[#1A365D]">
								{t("legal.privacy.sections.overviewTitle")}
							</h2>
							<p className="mt-2">{t("legal.privacy.sections.overviewText")}</p>
						</section>

						<section>
							<h2 className="text-xl md:text-2xl font-semibold dark:text-slate-300 text-[#1A365D]">
								{t("legal.privacy.sections.dataTitle")}
							</h2>
							<ul className="mt-2 list-disc pl-5 space-y-2">
								<li>{t("legal.privacy.sections.dataItems.0")}</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl md:text-2xl font-semibold dark:text-slate-300 text-[#1A365D]">
								{t("legal.privacy.sections.usageTitle")}
							</h2>
							<ul className="mt-2 list-disc pl-5 space-y-2">
								<li>{t("legal.privacy.sections.usageItems.0")}</li>
								<li>{t("legal.privacy.sections.usageItems.1")}</li>
								<li>{t("legal.privacy.sections.usageItems.2")}</li>
								<li>{t("legal.privacy.sections.usageItems.3")}</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl md:text-2xl font-semibold dark:text-slate-300 text-[#1A365D]">
								{t("legal.privacy.sections.sharingTitle")}
							</h2>
							<p className="mt-2">{t("legal.privacy.sections.sharingText")}</p>
						</section>

						<section>
							<h2 className="text-xl md:text-2xl font-semibold dark:text-slate-300 text-[#1A365D]">
								{t("legal.privacy.sections.retentionTitle")}
							</h2>
							<p className="mt-2">{t("legal.privacy.sections.retentionText")}</p>
						</section>

						<section>
							<h2 className="text-xl md:text-2xl font-semibold dark:text-slate-300 text-[#1A365D]">
								{t("legal.privacy.sections.rightsTitle")}
							</h2>
							<ul className="mt-2 list-disc pl-5 space-y-2">
								<li>{t("legal.privacy.sections.rightsItems.0")}</li>
								<li>{t("legal.privacy.sections.rightsItems.1")}</li>
							</ul>
						</section>

						<section>
							<h2 className="text-xl md:text-2xl font-semibold dark:text-slate-300 text-[#1A365D]">
								{t("legal.privacy.sections.contactTitle")}
							</h2>
							<p className="mt-2">{t("legal.privacy.sections.contactText")}</p>
						</section>
					</div>
				</div>
			</section>
		</main>
	);
}
