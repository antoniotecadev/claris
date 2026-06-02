"use client";

import Image from "next/image";
import icon from "@/assets/images/logoSem.png";
import { UserPlus, Bell, Settings, Menu } from "lucide-react";
import { useState } from "react";
import MembersInvitesDialog from "./membersInvitesDialog";

export default function HeaderWithDialog() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	return (
		<>
			<nav className="bg-white border-b dark:bg-neutral-800 border-gray-200 sticky top-0 z-40">
				<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
					{/* Logo */}
					<div className="flex items-center gap-3">
						<Image src={icon} alt="Logo" width={36} height={36} />
						<h1 className="text-2xl font-bold text-[#1E3A8A] dark:text-white">CLARIS</h1>
					</div>

					{/* Right Icons */}
					<div className="flex items-center gap-4">
						{/* Members & Invites Button */}
						<button
							onClick={() => setIsDialogOpen(true)}
							className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors dark:bg-neutral-600 text-gray-700 font-medium text-sm"
							title="Membros & Convites"
						>
							<UserPlus size={20} className="text-[#1E3A8A]" />
							<span className="hidden sm:inline">Convites</span>
						</button>

						{/* Notifications */}
						<button
							className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
							title="Notificações"
						>
							<Bell size={20} />
						</button>

						{/* Settings */}
						<button
							className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
							title="Configurações"
						>
							<Settings size={20} />
						</button>

						{/* Profile Avatar */}
						<div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1E3A8A] text-white font-semibold">
							A
						</div>
					</div>
				</div>
			</nav>

			{/* Dialog Modal */}
			{isDialogOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
					<div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
						{/* Close Button */}
						<div className="flex items-center justify-between p-6 border-b border-gray-200">
							<h2 className="text-2xl font-bold text-gray-900">Membros & Convites</h2>
							<button
								onClick={() => setIsDialogOpen(false)}
								className="text-gray-500 hover:text-gray-700 transition-colors"
							>
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						{/* Dialog Content */}
						<div className="p-6">
							<MembersInvitesDialog onClose={() => setIsDialogOpen(false)} />
						</div>
					</div>
				</div>
			)}
		</>
	);
}
