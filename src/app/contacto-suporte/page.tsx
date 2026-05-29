"use client";

import { useMessages } from "@/i18n/messages";

export default function ContactoSuportePage() {
	const { t } = useMessages();

	return (
		<main className="min-h-screen bg-gray-50">
			<section className="container mx-auto px-4 md:px-6 py-12 md:py-16">
				<div className="max-w-3xl">
					<h1 className="text-3xl md:text-4xl font-bold text-[#1A365D]">
						{t("support.title")}
					</h1>
					<p className="text-gray-500 mt-2">
						{t("support.subtitle")}
					</p>

					<div className="mt-8 grid gap-6">
						<div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
							<h2 className="text-lg font-semibold text-[#1A365D]">{t("support.channelsTitle")}</h2>
							<ul className="mt-3 space-y-2 text-gray-700">
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

						<div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
							<h2 className="text-lg font-semibold text-[#1A365D]">{t("support.helpfulTitle")}</h2>
							<p className="mt-2 text-gray-700">
								{t("support.helpfulText")}
							</p>
						</div>

						<div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
							<h2 className="text-lg font-semibold text-[#1A365D]">{t("support.statusTitle")}</h2>
							<p className="mt-2 text-gray-700">
								{t("support.statusText")}
							</p>
							<button className="mt-4 text-[#2B3EA2] font-medium hover:underline">
								{t("support.statusCta")}
							</button>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
