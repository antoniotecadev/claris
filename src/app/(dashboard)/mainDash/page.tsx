"use client";
import Image from "next/image";
import icon from "@/assets/images/logoSem.png";
import heroImg from "@/assets/images/create.png";
import Link from "next/link";
import { Search, Bell, Settings } from "lucide-react";
import CommunityCard from "@/components/layout/commityCard";
import CommunityJoin from "@/components/layout/commityJoin";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import SettingsPanel from "@/components/layout/setting";
import { DialogDemo } from "@/components/layout/createChurchDialogo";
import type { ChurchOption } from "@/components/layout/OrganizatioSelect";

interface OrganizationRef {
	organizationId: string;
	name: string;
	slug: string;
	logoUrl: string | null;
	role: string;
	description: string;
	address: string;
}

interface Church {
	id: string;
	name: string;
	description: string;
	logoUrl: string | null;
	membersCount: number;
}

interface Props {
	organizations: OrganizationRef[];
	churches: Church[];
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
	return (
		<Link
			href={href}
			className="text-[#475569] border-b-2 border-transparent hover:text-[#D97706] hover:font-bold hover:border-[#D97706] transition-all duration-300 text-center"
		>
			{children}
		</Link>
	);
}

export default function MainDashClient() {
	const [organizations, setOrganizations] = useState<OrganizationRef[]>([]);
	const [churchOptions, setChurchOptions] = useState<ChurchOption[]>([]);
	const [loadingChurches, setLoadingChurches] = useState(false);
	const user = useUserStore((state: { user: any; }) => state.user);
	async function requestToJoin(organizationId: string) {
		try {
			await api.post(`/organizations/${organizationId}/memberships/request`, {});
			alert("Pedido enviado com sucesso");
		} catch (error) {
			alert(error instanceof Error ? error.message : "Erro ao enviar pedido.");
		}
	}

	const [settingsOpen, setSettingsOpen] = useState(false);

	const loadChurches = async () => {
		if (loadingChurches || churchOptions.length > 0) return;
		setLoadingChurches(true);
		try {
			const res = await api.get<{ churches: ChurchOption[] }>("/church");
			setChurchOptions(res.churches ?? []);
		} finally {
			setLoadingChurches(false);
		}
	};

	const loadOrganizations = async () => {
		if (loadingChurches || churchOptions.length > 0) return;
		setLoadingChurches(true);
		try {
			const res = await api.get<{ organizations: OrganizationRef[] }>("/organizations/my");
			setOrganizations(res.organizations ?? []);
			console.log(res.organizations);
		} finally {
			setLoadingChurches(false);
		}
	};


	useEffect(() => {
		loadOrganizations();
	}, []);
	return (
		<div className="bg-white">
			<SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
			<div className="container m-auto">
				{/* Header */}
				<header className="flex gap-4 justify-between py-3 border-b border-zinc-200">
					<div className="items-center justify-center flex gap-9">
						<div className="flex justify-center items-center gap-2">
							<Image src={icon} alt="Logo" width={30} />
							<h1 className="text-2xl text-[#1E3A8A]">CLARIS</h1>
						</div>
						<div className="hidden sm:flex gap-6">
							<NavLink href="#first">Descobrir</NavLink>
							<NavLink href="#preco">Minha igreja</NavLink>
							<NavLink href="#third">Comunidade</NavLink>
						</div>
					</div>
					<div className="flex justify-between gap-3">
						<div className="flex bg-[#F3F3F3] rounded-2xl p-2 text-[#74777F]">
							<Search size={14} className="w-6 p-1 h-6 bg-[#F3F3F3]" />
							<input
								type="text"
								placeholder="encontrar a tua igreja..."
								className="bg-[#F3F3F3] w-62.5 h-6 focus:outline-none"
							/>
						</div>
						<div className="flex items-center justify-center">
							<Bell size={14} className="text-[#1E3A8A] w-6 h-7" />
						</div>
						<button
							onClick={() => setSettingsOpen(true)}
							className="flex items-center justify-center hover:cursor-pointer "
						>
							<Settings size={14} className="text-[#1E3A8A] w-6 h-7 cursor-pointer hover:text-[#D97706] transition-colors" />
						</button>
						<div className="flex items-center justify-center">
							<div className="w-8 h-8 bg-[#1E3A8A] rounded-2xl" />
						</div>
					</div>

				</header>

				<nav className="flex flex-col mt-10">
					<p className="text-[#1A1C1C] tracking-wide text-[12px]">BEM VINDO DE VOLTA</p>
					<p className="text-[#002045] text-[72px] font-bold">
						Escolhe a sua<br />Igreja
					</p>

					<div className="flex items-center justify-between">
						<p className="text-[#475F83] text-[20px] w-120">
							Reconecte-se com o seu lar espiritual ou explore novas comunidades de fé e devoção.
						</p>
						<div className="flex bg-[#F3F3F3] rounded-2xl p-1 text-[#74777F] items-center justify-center">
							<input
								type="text"
								placeholder="encontrar a tua igreja..."
								className="bg-[#F3F3F3] w-62.5 h-5.6 focus:outline-none px-2"
							/>
							<button className="bg-[#1E3A8A] text-white rounded-2xl px-4 py-2 ml-2">
								Pesquisar
							</button>
						</div>
					</div>

					{/* Minhas igrejas */}
					<div className="flex mt-10 items-center justify-start">
						<p className="text-[#002045] font-semibold mr-4">MINHAS IGREJAS</p>
						<div className="h-px bg-zinc-300 flex-1" />
					</div>

					{organizations.length === 0 ? (
						<div className="py-16 flex flex-col items-center justify-center">
							<p className="text-[#475F83] text-lg">Não pertence a nenhuma igreja ainda.</p>
							<p className="text-[#9CA3AF] text-sm mt-2">Crie uma nova ou explore as disponíveis.</p>
						</div>
					) : (
						<div className="py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							{organizations.map((org) => (
								<CommunityCard
									key={org.organizationId}
									name={org.name}
									description={org.slug}
									logoUrl={org.logoUrl}
									membersCount={0}
									responsable={org.role}
									onClick={() => {
										window.location.href = `/dashboard?org=${org.organizationId}`;
									}}
								/>
							))}
						</div>
					)}

					{/* Banner criar igreja */}
					<section
						style={{
							backgroundImage: `linear-gradient(to right, rgba(26,54,93,0.98) 10%, rgba(26,54,93,0.80) 50%, rgba(26,54,93,0.60) 100%), url(${heroImg.src})`,
						}}
						className="bg-center bg-cover mt-10 mb-10 rounded-2xl flex flex-col p-20"
					>

						<p className="text-white text-4xl italic">Manifesta a tua visão</p>
						<p className="text-[#DBEAFE] w-120 mt-4">
							Crie a sua igreja e comece hoje a construir uma comunidade de fé vibrante e acolhedora.
						</p>
						<DialogDemo
							churches={churchOptions}
							loadingChurches={loadingChurches}
							onOpen={loadChurches}
						/>

					</section>

					{/* Explorar igrejas */}
					<div className="flex justify-between items-center mt-10">
						<div className="flex flex-col">
							<p className="text-[#002045] text-[30px]">Explorar novas igrejas</p>
							<p className="text-[#475F83] text-[24px]">
								Congregações perto de si ou alinhadas com a sua jornada.
							</p>
						</div>
						<p className="text-[#002045] text-[24px] cursor-pointer">ver todas recomendações</p>
					</div>

					{/* <div className="flex gap-8 pb-10">
						{churches.length === 0 ? (
							<p className="text-[#475F83]">Nenhuma igreja disponível.</p>
						) : (
							churches.map((church) => (
								<CommunityJoin
									key={church.id}
									name={church.name}
									local="Lisboa, Portugal"
									logoUrl={church.logoUrl}
									membersCount={church.membersCount}
									onClick={() => requestToJoin(church.id)}
								/>
							))
						)}
					</div> */}
				</nav>
			</div>
		</div>
	);
}