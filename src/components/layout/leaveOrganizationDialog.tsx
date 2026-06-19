"use client";

import { useState } from "react";
import { Loader2, LogOut, AlertCircle } from "lucide-react";
import { useMessages } from "@/i18n/messages";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface LeaveOrganizationDialogProps {
	organizationName: string;
	isAdmin: boolean;
	onConfirm: () => Promise<void>;
	children?: React.ReactNode;
}

export function LeaveOrganizationDialog({
	organizationName,
	isAdmin,
	onConfirm,
	children,
}: LeaveOrganizationDialogProps) {
	const { t } = useMessages();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleConfirm = async () => {
		setLoading(true);
		try {
			await onConfirm();
			setOpen(false);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{children ?? (
					<button
						type="button"
						className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
					>
						<LogOut size={16} />
						{t("organization.leave.trigger")}
					</button>
				)}
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
							<AlertCircle size={20} className="text-red-600" />
						</div>
						<div>
							<DialogTitle className="text-lg">{t("organization.leave.title", { name: organizationName })}</DialogTitle>
							<DialogDescription className="mt-1">
								{t("organization.leave.description")}
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<p className="text-sm text-slate-600">
						{t("organization.leave.confirmQuestion", { name: organizationName })}
					</p>

					{isAdmin && (
						<div className="rounded-lg bg-amber-50 p-3 border border-amber-200">
							<p className="text-xs font-semibold text-amber-900 mb-1">
								{t("organization.leave.adminWarning")}
							</p>
							<p className="text-xs text-amber-800 leading-5">
								{t("organization.leave.adminWarningDetail")}
							</p>
						</div>
					)}

					<p className="text-xs text-slate-500">
						{t("organization.leave.accessWarning")}
					</p>
				</div>

				<DialogFooter className="flex gap-3 sm:justify-end">
					<DialogClose asChild>
						<Button type="button" variant="outline">
							{t("organization.leave.cancel")}
						</Button>
					</DialogClose>
					<Button
						type="button"
						onClick={handleConfirm}
						disabled={loading}
						className="bg-red-600 hover:bg-red-700 text-white"
					>
						{loading ? (
							<>
								<Loader2 size={16} className="animate-spin mr-2" />
								{t("organization.leave.leaving")}
							</>
						) : (
							<>
								<LogOut size={16} className="mr-2" />
								{t("organization.leave.confirm")}
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
