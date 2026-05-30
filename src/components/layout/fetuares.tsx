"use client";

import Image from "next/image";
import { Church, CalendarDays, MessageSquare, MousePointerClick } from "lucide-react";

import Simple from "./Simple";
import { useMessages } from "@/i18n/messages";
import Igreja from "@/assets/images/photo-church.jpg";
import Pholes from "@/assets/images/photo-fone.jpg";
import pessoas from "@/assets/images/photo-hand.jpg";
import Igreja1 from "@/assets/images/photo-church1.jpg";

const featureImages = {
	members:
		Igreja,
	calendar:
		pessoas,
	donations:
		Igreja1,
	communication:
		Pholes,
};

export default function Fun() {
	const { t } = useMessages();
	const communicationQuoteSource = t("features.communicationQuoteSource");

	return (
		<div className="bg-white py-4">
			<div className="container mx-auto px-4">
				<div className="flex flex-col items-center space-y-4 py-14 text-center md:py-16">
					<h5 className="text-2xl font-bold text-[#1A365D] md:text-4xl">
						{t("features.title")}
					</h5>
					<div className="h-1 w-24 bg-amber-300" />
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					<div className="group flex min-h-90 flex-col overflow-hidden rounded-2xl bg-[#F1F5F9] p-6 shadow-sm ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 md:p-8">
						<div className="flex flex-1 flex-col gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#BDD6FF]">
								<Church size={24} className="text-[#1A365D]" />
							</div>

							<p className="text-xl font-semibold text-[#1A365D] md:text-2xl">
								{t("features.membersTitle")}
							</p>

							<p className="text-base leading-relaxed text-[#475569] md:text-lg">
								{t("features.membersDescription")}
							</p>
						</div>

						<div className="relative mt-6 min-h-55 overflow-hidden rounded-xl bg-white/60">
							<Image
								src={featureImages.members}
								alt="Igreja vista por fora"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover object-center transition duration-500 group-hover:scale-105"
							/>
						</div>
					</div>

					<div className="group flex min-h-90 flex-col overflow-hidden rounded-2xl bg-[#1A365D] p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 md:p-8">
						<div className="flex flex-1 flex-col gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DBEAFE]">
								<CalendarDays size={24} className="text-[#1A365D]" />
							</div>

							<p className="text-xl font-semibold text-white md:text-2xl">
								{t("features.calendarTitle")}
							</p>

							<p className="text-base leading-relaxed text-[#DBEAFE] md:text-lg">
								{t("features.calendarDescription")}
							</p>
						</div>

						<div className="relative mt-6 min-h-55 overflow-hidden rounded-xl bg-white/10">
							<Image
								src={featureImages.calendar}
								alt="Pessoas reunidas em evento da igreja"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover object-center transition duration-500 group-hover:scale-105"
							/>
						</div>
					</div>

					<div className="group flex min-h-90 flex-col overflow-hidden rounded-2xl bg-[#F8FAFC] p-6 shadow-sm ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 md:p-8">
						<div className="flex flex-1 flex-col gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFDEA5]">
								<MousePointerClick size={24} className="text-[#5D4201]" />
							</div>

							<p className="text-xl font-semibold text-[#1A365D] md:text-2xl">
								{t("features.donationsTitle")}
							</p>

							<p className="text-base leading-relaxed text-[#475569] md:text-lg">
								{t("features.donationsDescription")}
							</p>
						</div>

						<div className="relative mt-6 min-h-55 overflow-hidden rounded-xl bg-white/70">
							<Image
								src={featureImages.donations}
								alt="Pessoa levantando a mao para participar"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover object-center transition duration-500 group-hover:scale-105"
							/>
						</div>
					</div>

					<div className="group flex min-h-90 flex-col overflow-hidden rounded-2xl bg-[#F1F5F9] p-6 shadow-sm ring-1 ring-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 md:p-8">
						<div className="flex flex-1 flex-col gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#BDD6FF]">
								<MessageSquare size={24} className="text-[#1A365D]" />
							</div>

							<p className="text-xl font-semibold text-[#1A365D] md:text-2xl">
								{t("features.communicationTitle")}
							</p>

							<p className="text-base leading-relaxed text-[#475569] md:text-lg">
								{t("features.communicationDescription")}
							</p>

							<p className="mt-auto text-sm italic text-[#94A3B8] md:text-base">
								&quot;{t("features.communicationQuote")}&quot;
								{communicationQuoteSource ? ` ${communicationQuoteSource}` : ""}
							</p>
						</div>

						<div className="relative mt-6 min-h-[220px] overflow-hidden rounded-xl bg-white/70">
							<Image
								src={featureImages.communication}
								alt="Pessoa usando telemovel para trocar mensagens"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								className="object-cover object-center transition duration-500 group-hover:scale-105"
							/>
						</div>
					</div>
				</div>

				<Simple />
			</div>
		</div>
	);
}
