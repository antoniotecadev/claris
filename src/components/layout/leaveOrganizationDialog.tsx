"use client";

import { useState } from "react";
import { Loader2, LogOut, AlertCircle } from "lucide-react";
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
						Sair da Igreja
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
							<DialogTitle className="text-lg">Sair de {organizationName}</DialogTitle>
							<DialogDescription className="mt-1">
								Esta ação é irreversível
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<p className="text-sm text-slate-600">
						Tem a certeza que deseja sair de <strong>{organizationName}</strong>?
					</p>

					{isAdmin && (
						<div className="rounded-lg bg-amber-50 p-3 border border-amber-200">
							<p className="text-xs font-semibold text-amber-900 mb-1">
								⚠️ Atenção: Você é administrador
							</p>
							<p className="text-xs text-amber-800 leading-5">
								Como administrador, ao sair a organização pode ficar sem gestão. Certifique-se de atribuir outro administrador antes de sair.
							</p>
						</div>
					)}

					<p className="text-xs text-slate-500">
						Depois de sair, deixará de ter acesso aos eventos, mensagens e membros desta organização.
					</p>
				</div>

				<DialogFooter className="flex gap-3 sm:justify-end">
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Cancelar
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
								A sair...
							</>
						) : (
							<>
								<LogOut size={16} className="mr-2" />
								Sair
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
