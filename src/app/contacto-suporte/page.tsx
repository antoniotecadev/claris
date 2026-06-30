"use client";

import { useMessages } from "@/i18n/messages";

export default function ContactoSuportePage() {
	const { t } = useMessages();

	return (
		<main className="min-h-screen bg-gray-50 dark:bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.16),_transparent_32%),linear-gradient(to_bottom,_#0f172a,_#020617)]">
			<section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
				<div className="max-w-3xl">
					<h1 className="text-3xl md:text-4xl font-bold dark:text-slate-50 text-[#1A365D]">
						{t("support.title")}
					</h1>
					<p className="text-gray-500 dark:text-slate-500 mt-2">
						{t("support.subtitle")}
					</p>

					<div className="mt-8 grid gap-6">
						<div className="bg-white dark:bg-slate-900 rounded-xl border dark:border-slate-800 border-gray-200 p-6 shadow-sm">
							<h2 className="text-lg font-semibold dark:text-slate-200 text-[#1A365D]">{t("support.channelsTitle")}</h2>
							<ul className="mt-3 space-y-2 text-gray-700 dark:text-slate-500">
								<li>
									<span className="font-medium">{t("support.channelsEmail")}</span> suporte@claris.app
								</li>
								<li>
									<span className="font-medium">{t("support.channelsPhone")}</span> +351 21 000 0000
								</li>
								<li>
									<span className="font-medium">{t("support.channelsHours")}</span> {t("support.channelsHoursValue")}
								</li>
							</ul>
						</div>

						<div className="bg-white rounded-xl border  dark:bg-slate-900 dark:border-slate-800 border-gray-200 p-6 shadow-sm">
							<h2 className="text-lg font-semibold dark:text-slate-200 text-[#1A365D]">{t("support.helpfulTitle")}</h2>
							<p className="mt-2 text-gray-700 dark:text-slate-500">
								{t("support.helpfulText")}
							</p>
						</div>

						<div className="bg-white rounded-xl border  dark:bg-slate-900 dark:border-slate-800 border-gray-200 p-6 shadow-sm">
							<h2 className="text-lg font-semibold dark:text-slate-200 text-[#1A365D]">{t("support.statusTitle")}</h2>
							<p className="mt-2 text-gray-700 dark:text-slate-500">
								{t("support.statusText")}
							</p>
							<button className="mt-4 text-[#2B3EA2] dark:text-slate-300 font-medium hover:underline">
								{t("support.statusCta")}
							</button>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
