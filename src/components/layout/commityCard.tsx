"use client";

import { ArrowRight, ShieldCheck, Users } from "lucide-react";
import { useMessages } from "@/i18n/messages";

interface CommunityCardProps {
	name: string;
	description: string;
	logoUrl: string | null;
	membersCount: number;
	responsable: string;
	onClick: () => void;
	className?: string;
}

export default function CommunityCard({
	name,
	description,
	logoUrl,
	membersCount,
	responsable,
	onClick,
	className = "",
}: CommunityCardProps) {
	const { t } = useMessages();
	const descriptionText = description?.trim() || t("community.communityLabel");
	const initials = name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((word) => word[0])
		.join("")
		.toUpperCase();

	return (
		<article
			className={`group h-full min-h-80 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#D97706]/30 hover:shadow-xl cursor-pointer ${className}`}
			onClick={onClick}
		>
			<div className="relative h-40 overflow-hidden bg-slate-100">
				{logoUrl ? (
					<img
						src={logoUrl}
						alt={t("community.logoAlt", { name })}
						className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#002045] via-[#1E3A8A] to-[#D97706]">
						<span className="text-4xl font-bold text-white/90">
							{initials || t("community.communityLabel")[0]}
						</span>
					</div>
				)}
				<div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#00152F]/75 to-transparent" />
				<div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
					<span className="inline-flex max-w-[70%] items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
						<ShieldCheck size={12} className="shrink-0" />
						<span className="truncate">{responsable}</span>
					</span>
					{/* <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#002045] shadow-sm">
						<Users size={12} />
						{membersCount}
					</span> */}
				</div>
			</div>

			<div className="flex flex-1 flex-col p-4">
				<div className="mb-3 flex items-center justify-between gap-3">
					<div className="text-[11px] font-semibold uppercase tracking-wide text-[#D97706]">
						{t("community.communityLabel")}
					</div>
					<div className="text-right text-[11px] font-medium text-slate-400">
						{membersCount === 1 ? t("community.member") : t("community.members")}
					</div>
				</div>

				<div className="flex flex-1 flex-col">
					<h3 className="line-clamp-2 text-lg font-bold leading-snug text-[#002045]">
						{name}
					</h3>

					<p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-500">
						{descriptionText}
					</p>

					<button
						type="button"
						className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#002045] px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#1E3A8A]"
						onClick={(event) => {
							event.stopPropagation();
							onClick();
						}}
					>
						<span>{t("community.enter")}</span>
						<ArrowRight
							size={16}
							className="transition-transform duration-150 group-hover:translate-x-1"
						/>
					</button>
				</div>
			</div>
		</article>
	);
}
