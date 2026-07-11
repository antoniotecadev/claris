"use client";

import { Church, CalendarDays, MessageSquare, MousePointerClick } from "lucide-react";


import { useMessages } from "@/i18n/messages";
import Igreja from "@/assets/images/photo-church.webp";
import Igreja1 from "@/assets/images/photo-church1.webp";
import { FeatureCard } from "./Featurecard";

const featureImages = {
	members:
		Igreja,
	calendar:
		"/assets/photo-hand.avif",
	donations:
		Igreja1,
	communication:
		"/assets/photo-fone.avif",
};

export default function Fun() {
	const { t } = useMessages();
	const communicationQuoteSource = t("features.communicationQuoteSource");

	return (
		<div className="bg-white py-4 dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_32%),linear-gradient(to_bottom,#0f172a,#020617)]">
			<div className="container mx-auto px-4">
				<div className="flex flex-col items-center space-y-4 py-14 text-center md:py-16">
					<h5 className="text-2xl font-bold text-[#1A365D] dark:text-slate-50 md:text-4xl">
						{t("features.title")}
					</h5>
					<div className="h-1 w-24 bg-amber-300" />
				</div>

				<div className="grid gap-6 lg:grid-cols-2">

					<FeatureCard
						icon={Church}
						title={t("features.membersTitle")}
						description={t("features.membersDescription")}
						image={{ src: featureImages.members, alt: "Igreja vista por fora" }}
					/>

					<FeatureCard
						icon={CalendarDays}
						title={t("features.calendarTitle")}
						description={t("features.calendarDescription")}
						image={{ src: featureImages.calendar, alt: "Pessoas reunidas em evento da igreja" }}
					/>

					<FeatureCard
						icon={MousePointerClick}
						title={t("features.donationsTitle")}
						description={t("features.donationsDescription")}
						image={{ src: featureImages.donations, alt: "Pessoa levantando a mão para participar" }}
					/>

					<FeatureCard
						icon={MessageSquare}
						title={t("features.communicationTitle")}
						description={t("features.communicationDescription")}
						quote={t("features.communicationQuote")}
						quoteSource={communicationQuoteSource}
						image={{ src: featureImages.communication, alt: "Pessoa usando telefone para trocar mensagens" }}
					/>
				</div>


			</div>
		</div>
	);
}
