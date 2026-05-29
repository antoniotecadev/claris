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
import { ModeToggle } from "@/components/layout/ModeToggle";
import LanguageSelector from "@/components/layout/LanguageSelector";
import { useMessages } from "@/i18n/messages";
import { addLocaleToPathname } from "@/i18n/routing";

interface OrganizationRef {
	id: string;
	churchId: string;
	organizationId: string;
	name: string;
	slug: string;
	logoUrl: string | null;
	role: string;
	description: string;
	address: string;
	memberCount: number;
	createdAt: string | Date;
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



export default function MainDashClient() {
	const { locale, t } = useMessages();
	const [organizations, setOrganizations] = useState<OrganizationRef[]>([]);
	const [churchOptions, setChurchOptions] = useState<ChurchOption[]>([]);
	const [churches, setChurches] = useState<OrganizationRef[]>([]);
	const [organizationLength, setOrganizationLength] = useState(0);
	const [loadingChurches, setLoadingChurches] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const user = useUserStore((state: { user: any; }) => state.user);
	async function requestToJoin(organizationId: string) {
		try {
			await api.post(`/organizations/${organizationId}/memberships/request`, {});
			alert(t("dashboard.main.joinSuccess"));
		} catch (error) {
			alert(error instanceof Error ? error.message : t("dashboard.main.joinError"));
		}
	}

	const [settingsOpen, setSettingsOpen] = useState(false);
	const userOrganizationIds = new Set(
		organizations.map((organization) => organization.organizationId ?? organization.id),
	);
	const availableChurches = churches.filter((church) => {
		const churchId = church.organizationId ?? church.id;
		return !userOrganizationIds.has(churchId);
	});

	const normalizedSearchTerm = searchTerm.trim().toLowerCase();
	const matchesSearchTerm = (value: string | null | undefined) => {
		if (!normalizedSearchTerm) return true;
		return (value ?? "").toLowerCase().includes(normalizedSearchTerm);
	};

	const filteredOrganizations = organizations;

	const filteredAvailableChurches = availableChurches.filter((church) => {
		return (
			matchesSearchTerm(church.name) ||
			matchesSearchTerm(church.slug) ||
			matchesSearchTerm(church.description)
		);
	});

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
			const res2 = await api.get<{ organizations: OrganizationRef[]; organizationLength?: number }>("/organizations");
			const orgs = res2.organizations ?? [];
			setChurches(orgs);
			setOrganizationLength(res2.organizationLength ?? orgs.length);
			console.log("My Organizations:", res);
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

					</div>
					<div className="flex justify-between gap-3">
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
							<ModeToggle />
						</div>
						<div className="flex items-center justify-center">
							<LanguageSelector />
						</div>
					</div>

				</header>

				<nav className="flex flex-col mt-10">
					<p className="text-[#1A1C1C] tracking-wide text-[12px]">{t("dashboard.main.welcome")}</p>
					<p className="text-[#002045] text-[72px] font-bold">
						{t("dashboard.main.title")}
					</p>

					<div className="flex items-center justify-between">
						<p className="text-[#475F83] text-[20px] w-120">
							{t("dashboard.main.subtitle")}
						</p>
					</div>

					{/* Minhas igrejas */}
					<div className="flex mt-10 items-center justify-start">
						<p className="text-[#002045] font-semibold mr-4">{t("dashboard.main.myChurches")}</p>
						<div className="h-px bg-zinc-300 flex-1" />
					</div>

					{organizations.length === 0 ? (
						<div className="py-16 flex flex-col items-center justify-center">
							<p className="text-[#475F83] text-lg">{t("dashboard.main.empty.title")}</p>
							<p className="text-[#9CA3AF] text-sm mt-2">{t("dashboard.main.empty.subtitle")}</p>
						</div>
					) : filteredOrganizations.length === 0 ? (
						<div className="py-16 flex flex-col items-center justify-center">
							<p className="text-[#475F83] text-lg">{t("dashboard.main.searchEmpty.title")}</p>
							<p className="text-[#9CA3AF] text-sm mt-2">{t("dashboard.main.searchEmpty.subtitle")}</p>
						</div>
					) : (
						<div className="py-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							{filteredOrganizations.map((org) => (
								<CommunityCard
									key={org.organizationId}
									name={org.name}
									description={org.description}
									logoUrl={org.logoUrl}
									membersCount={0}
									responsable={org.role}
									onClick={() => {
										window.location.href = addLocaleToPathname(
											`/dashboard?org=${org.organizationId}`,
											locale
										);
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

						<p className="text-white text-4xl italic">{t("dashboard.main.banner.title")}</p>
						<p className="text-[#DBEAFE] w-120 mt-4">
							{t("dashboard.main.banner.subtitle")}
						</p>
						<DialogDemo
							churches={churchOptions}
							loadingChurches={loadingChurches}
							onOpen={loadChurches}
							setOrganizations={setOrganizations}
						/>

					</section>

					{/* Explorar igrejas */}
					<div className="flex justify-between items-center my-10">
						<div className="flex flex-col">
							<p className="text-[#002045] text-[30px]">
								{t("dashboard.main.explore.title", { count: filteredAvailableChurches.length })}
							</p>
							<p className="text-[#475F83] text-[24px]">
								{t("dashboard.main.explore.subtitle")}
							</p>
						</div>
						<div className="flex bg-[#F3F3F3] rounded-2xl p-1 text-[#74777F] items-center justify-center">
							<input
								type="text"
								placeholder={t("dashboard.main.explore.searchPlaceholder")}
								value={searchTerm}
								onChange={(event) => setSearchTerm(event.target.value)}
								className="bg-[#F3F3F3] w-62.5 h-5.6 focus:outline-none px-2"
							/>
							<button
								type="button"
								onClick={() => setSearchTerm("")}
								className="bg-[#1E3A8A] text-white rounded-2xl px-4 py-2 ml-2"
							>
								{t("dashboard.main.explore.searchCta")}
							</button>
						</div>
					</div>

					<div className="flex gap-8 pb-10">
						{filteredAvailableChurches.length === 0 ? (
							<p className="text-[#475F83]">{t("dashboard.main.explore.empty")}</p>
						) : (
							filteredAvailableChurches.map((church) => (
								<CommunityJoin
									key={church.id}
									name={church.name}
									slug={church.slug}
									address={church.address}
									description={church.description}
									logoUrl={church.logoUrl}
									createdAt={church.createdAt}
									church={{ id: church.churchId ?? church.id, name: church.name }}
									membersCount={church.memberCount}
									onClick={() => requestToJoin(church.id)}
								/>
							))
						)}
					</div>
				</nav>
			</div>
		</div>
	);
}