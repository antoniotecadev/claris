"use client";

import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useMessages } from "@/i18n/messages";

type FeedbackToastVariant = "success" | "error" | "info";

type FeedbackToastProps = {
	open: boolean;
	title: string;
	description?: string;
	variant?: FeedbackToastVariant;
	onClose: () => void;
};

const toastStyles = {
	success: {
		icon: CheckCircle2,
		iconClassName: "text-emerald-600",
		accentClassName: "bg-emerald-500",
	},
	error: {
		icon: AlertCircle,
		iconClassName: "text-red-600",
		accentClassName: "bg-red-500",
	},
	info: {
		icon: Info,
		iconClassName: "text-[#1E3A8A]",
		accentClassName: "bg-[#1E3A8A]",
	},
};

export function FeedbackToast({
	open,
	title,
	description,
	variant = "info",
	onClose,
}: FeedbackToastProps) {
	const { t } = useMessages();
	if (!open) return null;

	const style = toastStyles[variant];
	const Icon = style.icon;

	return (
		<div className="fixed right-4 top-4 z-70 w-[calc(100vw-2rem)] max-w-sm animate-in slide-in-from-top-2 fade-in duration-200 sm:right-6 sm:top-6">
			<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
				<div className={`h-1 w-full ${style.accentClassName}`} />
				<div className="flex gap-3 p-4">
					<div className="mt-0.5 shrink-0">
						<Icon size={20} className={style.iconClassName} />
					</div>
					<div className="min-w-0 flex-1">
						<p className="text-sm font-semibold text-[#002045]">{title}</p>
						{description ? (
							<p className="mt-1 text-sm leading-5 text-[#475F83]">{description}</p>
						) : null}
					</div>
					<button
						type="button"
						onClick={onClose}
						className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#002045]"
						aria-label={t("notifications.close")}
					>
						<X size={16} />
					</button>
				</div>
			</div>
		</div>
	);
}
