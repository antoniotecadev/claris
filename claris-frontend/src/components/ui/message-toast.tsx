"use client";

import { X } from "lucide-react";
import { useMessages } from "@/i18n/messages";

type MessageToastProps = {
	open: boolean;
	senderName: string;
	avatarUrl?: string;
	message: string;
	onClose: () => void;
	onClick?: () => void;
};

function getInitials(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((word) => word[0])
		.join("")
		.toUpperCase();
}

function truncateMessage(text: string, maxLength = 100) {
	const trimmed = text.trim();
	if (trimmed.length <= maxLength) return trimmed;
	return `${trimmed.slice(0, maxLength).trimEnd()}…`;
}

export function MessageToast({
	open,
	senderName,
	avatarUrl,
	message,
	onClose,
	onClick,
}: MessageToastProps) {
	const { t } = useMessages();
	if (!open) return null;

	const handleClick = () => {
		onClick?.();
		onClose();
	};

	return (
		<div className="fixed right-4 top-4 z-70 w-[calc(100vw-2rem)] max-w-sm animate-in slide-in-from-top-2 fade-in duration-200 sm:right-6 sm:top-6">
			<div
				role={onClick ? "button" : undefined}
				tabIndex={onClick ? 0 : undefined}
				onClick={onClick ? handleClick : undefined}
				onKeyDown={
					onClick
						? (event) => {
								if (event.key === "Enter" || event.key === " ") {
									event.preventDefault();
									handleClick();
								}
							}
						: undefined
				}
				className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl ${onClick ? "cursor-pointer transition-shadow hover:shadow-xl" : ""}`}
			>
				<div className="h-1 w-full bg-[#1E3A8A]" />
				<div className="flex gap-3 p-4">
					<div className="shrink-0">
						{avatarUrl ? (
							<img
								src={avatarUrl}
								alt={senderName}
								className="h-11 w-11 rounded-full object-cover ring-2 ring-white"
							/>
						) : (
							<div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-light text-xs font-bold text-[#1E3A8A] ring-2 ring-white">
								{getInitials(senderName)}
							</div>
						)}
					</div>
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-semibold text-brand-primary">{senderName}</p>
						<p className="mt-1 line-clamp-2 text-sm leading-5 text-brand-muted">
							{truncateMessage(message)}
						</p>
					</div>
					<button
						type="button"
						onClick={(event) => {
							event.stopPropagation();
							onClose();
						}}
						className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-primary"
						aria-label={t("notifications.close")}
					>
						<X size={16} />
					</button>
				</div>
			</div>
		</div>
	);
}
