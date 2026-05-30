"use client";

import Image from "next/image";
import Link from "next/link";
import icon from "@/assets/images/logoSem.png";

import {
	Users,
	Megaphone,
	UserPlus,
	Calendar,
	LogOut,
} from "lucide-react";

export default function Sidebar() {
	return (
		<aside className="fixed top-0 left-0 flex flex-col justify-between w-[256px] h-screen bg-[#e7ebf1] p-4">
			<div>
				{/* Logo */}
				<div className="flex items-center gap-4 mb-10">
					<Image src={icon} alt="Administrador" width={32} height={32} />
					<p className="text-[#1E3A8A] text-[20px] font-bold">
						Claris
					</p>
				</div>
				<div className="h-px bg-[#1E3A8A] w-full mb-5"/>

				{/* Menu */}
				<nav className="flex flex-col gap-3 text-[#43474E]">
					<Link
						href="/dashboard/ministerios"
						className="hover:bg-white rounded-2xl flex items-center px-6 h-11 gap-3 hover:text-[#002045]"
					>
						<Users size={20} />
						<p >Ministérios</p>
					</Link>

					<Link
						href="/dashboard/comunicados"
						className="hover:bg-white rounded-2xl flex items-center px-6 h-11 gap-3 hover:text-[#002045]"
					>
						<Megaphone size={20} />
						<p>Comunicados</p>
					</Link>

					<Link
						href="/dashboard/criarComunicado"
						className="hover:bg-white rounded-2xl flex items-center px-6 h-11 gap-3 hover:text-[#002045]"
					>
						<Megaphone size={20} />
						<p>Criar Comunicados</p>
					</Link>

					<Link
						href="/dashboard/eventos"
						className="hover:bg-white rounded-2xl flex items-center px-6 h-11 gap-3 hover:text-[#002045]"
					>
						<Calendar size={20} />
						<p>Eventos</p>
					</Link>
				</nav>
			</div>

			{/* Footer */}
			<div className="flex flex-col items-center gap-4">
				<button className="p-3 bg-[#002045] text-white rounded-2xl w-52">
					Convidar Membros
				</button>

				<button className="flex items-center gap-2 text-[#43474E]">
					<LogOut size={24} />
					<p>Sair</p>
				</button>
			</div>
		</aside>
	);
}