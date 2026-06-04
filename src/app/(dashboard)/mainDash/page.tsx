"use client";
import Image from "next/image";
import Link from "next/link";
import icon from "@/assets/images/logoSem.png";
import heroImg from "@/assets/images/create.png";
import { Bell, Building2, Compass, Search, Settings, Sparkles, X } from "lucide-react";
import CommunityCard from "@/components/layout/commityCard";
import CommunityJoin from "@/components/layout/commityJoin";
import { api } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { DialogDemo } from "@/components/layout/createChurchDialogo";
import type { ChurchOption } from "@/components/layout/OrganizatioSelect";
import { ModeToggle } from "@/components/layout/ModeToggle";
import LanguageSelector from "@/components/layout/LanguageSelector";
import { useMessages } from "@/i18n/messages";
import { addLocaleToPathname } from "@/i18n/routing";
import { switchOrganization } from "@/utils/actionMain";
import { FeedbackToast } from "@/components/ui/feedback-toast";

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

type ToastState = {
	title: string;
	description?: string;
	variant: "success" | "error" | "info";
} | null;

export default function MainDashClient() {
	const { locale, t } = useMessages();
	const router = useRouter();
	const [organizations, setOrganizations] = useState<OrganizationRef[]>([]);
	const [churchOptions, setChurchOptions] = useState<ChurchOption[]>([]);
	const [churches, setChurches] = useState<OrganizationRef[]>([]);
	const [loadingChurches, setLoadingChurches] = useState(false);
	const [switchingOrganizationId, setSwitchingOrganizationId] = useState<string | null>(null);
	const [pendingJoinChurch, setPendingJoinChurch] = useState<OrganizationRef | null>(null);
	const [joiningChurch, setJoiningChurch] = useState(false);
	const [joinError, setJoinError] = useState<string | null>(null);
	const [toast, setToast] = useState<ToastState>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const user = useUserStore((state) => state.user);
	const setUser = useUserStore((state) => state.setUser);

	async function requestToJoin() {
		if (!pendingJoinChurch || joiningChurch) return;

		setJoiningChurch(true);
		setJoinError(null);
		try {
			const organizationId = pendingJoinChurch.organizationId ?? pendingJoinChurch.id;
			await api.post(`/organizations/${organizationId}/memberships/join`, {});
			await loadOrganizations();
			setChurches((currentChurches) =>
				currentChurches.filter((church) => (church.organizationId ?? church.id) !== organizationId),
			);
			setPendingJoinChurch(null);
			setToast({
				title: t("dashboard.main.joinSuccess"),
				variant: "success",
			});
		} catch (error) {
			setJoinError(error instanceof Error ? error.message : t("dashboard.main.joinError"));
		} finally {
			setJoiningChurch(false);
		}
	}

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

	const loadOrganizations = useCallback(async () => {
		setLoadingChurches(true);
		try {
			const res = await api.get<{ organizations: OrganizationRef[] }>("/organizations/my");
			setOrganizations(res.organizations ?? []);
			const res2 = await api.get<{ organizations: OrganizationRef[]; organizationLength?: number }>("/organizations");
			const orgs = res2.organizations ?? [];
			setChurches(orgs);
		} finally {
			setLoadingChurches(false);
		}
	}, []);

	const handleOrganizationClick = async (organizationId: string) => {
		if (switchingOrganizationId) return;
		setSwitchingOrganizationId(organizationId);

		try {
			const data = await switchOrganization(organizationId);
			const switchedUser = data?.user;
			const switchedUserId = switchedUser?.id ?? switchedUser?.userId;

			if (switchedUserId && switchedUser?.displayName && switchedUser?.email) {
				setUser({
					id: switchedUserId,
					displayName: switchedUser.displayName,
					email: switchedUser.email,
					avatarUrl: switchedUser.avatarUrl ?? undefined,
				});
			}

			router.push(addLocaleToPathname(`/mainCenter?org=${organizationId}`, locale));
		} catch (error) {
			setToast({
				title: t("dashboard.main.openOrganizationError"),
				description: error instanceof Error ? error.message : undefined,
				variant: "error",
			});
		} finally {
			setSwitchingOrganizationId(null);
		}
	};


	useEffect(() => {
		const timeoutId = window.setTimeout(() => {
			void loadOrganizations();
		}, 0);

		return () => window.clearTimeout(timeoutId);
	}, [loadOrganizations]);

	useEffect(() => {
		if (!toast) return;

		const timeoutId = window.setTimeout(() => {
			setToast(null);
		}, 4200);

		return () => window.clearTimeout(timeoutId);
	}, [toast]);

	const displayName = user?.displayName?.trim();
	const firstName = displayName?.split(" ")[0];

	return (
		<div className="min-h-screen bg-[#F7F9FC] text-[#002045]">
			<FeedbackToast
				open={Boolean(toast)}
				title={toast?.title ?? ""}
				description={toast?.description}
				variant={toast?.variant}
				onClose={() => setToast(null)}
			/>
			{pendingJoinChurch && (
				<div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
					<div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
						<h2 className="text-lg font-semibold text-[#002045]">
							{t("dashboard.main.joinConfirm.title", { name: pendingJoinChurch.name })}
						</h2>

						<p className="mt-2 text-sm leading-6 text-[#475F83]">
							{t("dashboard.main.joinConfirm.description")}
						</p>

						{joinError && (
							<p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
								{joinError}
							</p>
						)}

						<div className="mt-6 flex gap-3">
							<button
								type="button"
								onClick={() => {
									if (joiningChurch) return;
									setPendingJoinChurch(null);
									setJoinError(null);
								}}
								className="flex-1 rounded-xl border border-zinc-200 py-3 text-sm font-medium hover:bg-zinc-50"
							>
								{t("common.cancel")}
							</button>

							<button
								type="button"
								onClick={requestToJoin}
								disabled={joiningChurch}
								className="flex-1 rounded-xl bg-[#002045] py-3 text-sm font-medium text-white hover:bg-[#1E3A8A] disabled:opacity-60"
							>
								{joiningChurch
									? t("dashboard.main.joinConfirm.joining")
									: t("dashboard.main.joinConfirm.confirm")}
							</button>
						</div>
					</div>
				</div>
			)}
			<div className="mx-auto flex w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
				<header className="sticky top-0 z-30 -mx-4 border-b border-white/70 bg-[#F7F9FC]/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
					<div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
						<div className="flex items-center gap-3">
							<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
								<Image src={icon} alt="Logo" width={30} />
							</div>
							<div>
								<h1 className="text-xl font-bold tracking-wide text-[#1E3A8A]">CLARIS</h1>
								<p className="hidden text-xs text-slate-500 sm:block">
									{user?.email ?? t("dashboard.main.welcome")}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2 sm:gap-3">
							<button
								type="button"
								className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#1E3A8A] shadow-sm transition-colors hover:border-[#D97706]/40 hover:text-[#D97706]"
								aria-label="Notifications"
							>
								<Bell size={18} />
							</button>
							<Link
								href={addLocaleToPathname("/settings", locale)}
								className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#1E3A8A] shadow-sm transition-colors hover:border-[#D97706]/40 hover:text-[#D97706]"
								aria-label="Settings"
							>
								<Settings size={18} />
							</Link>
							<ModeToggle />
							<LanguageSelector />
						</div>
					</div>
				</header>

				<main className="flex flex-col gap-8 py-8">
					<section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
						<div className="flex min-h-80 flex-col justify-between rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
							<div>
								<div className="inline-flex items-center gap-2 rounded-full bg-[#1E3A8A]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E3A8A]">
									<Sparkles size={14} />
									{firstName ? `${t("dashboard.main.welcome")}, ${firstName}` : t("dashboard.main.welcome")}
								</div>
								<h2 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-[#002045] sm:text-5xl lg:text-6xl">
									{t("dashboard.main.title")}
								</h2>
								<p className="mt-4 max-w-2xl text-base leading-7 text-[#475F83] sm:text-lg">
									{t("dashboard.main.subtitle")}
								</p>
							</div>

							<div className="mt-8 grid gap-3 sm:grid-cols-2">
								<div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4">
									<div className="flex items-center gap-2 text-sm font-medium text-slate-500">
										<Building2 size={16} className="text-[#1E3A8A]" />
										{t("dashboard.main.myChurches")}
									</div>
									<p className="mt-2 text-3xl font-bold text-[#002045]">{organizations.length}</p>
								</div>
								<div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4">
									<div className="flex items-center gap-2 text-sm font-medium text-slate-500">
										<Compass size={16} className="text-[#D97706]" />
										{t("dashboard.main.explore.searchCta")}
									</div>
									<p className="mt-2 text-3xl font-bold text-[#002045]">{availableChurches.length}</p>
								</div>
							</div>
						</div>

						<section
							style={{
								backgroundImage: `linear-gradient(to right, rgba(0,32,69,0.96) 10%, rgba(30,58,138,0.82) 54%, rgba(217,119,6,0.45) 100%), url(${heroImg.src})`,
							}}
							className="flex min-h-80 flex-col justify-between overflow-hidden rounded-3xl bg-cover bg-center p-6 shadow-sm sm:p-8"
						>
							<div>
								<p className="text-sm font-semibold uppercase tracking-wide text-[#FFDEA5]">
									{t("dashboard.main.banner.title")}
								</p>
								<p className="mt-4 max-w-md text-3xl font-bold leading-tight text-white">
									{t("dashboard.main.banner.subtitle")}
								</p>
							</div>
							<DialogDemo
								churches={churchOptions}
								loadingChurches={loadingChurches}
								onOpen={loadChurches}
								setOrganizations={setOrganizations}
							/>
						</section>
					</section>

					<section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<p className="text-xs font-semibold uppercase tracking-wide text-[#D97706]">
									{t("dashboard.main.myChurches")}
								</p>
								<h3 className="mt-1 text-2xl font-bold text-[#002045]">
									{organizations.length} {t("community.communityLabel").toLowerCase()}
								</h3>
							</div>
							<div className="h-px bg-slate-200 sm:w-1/3" />
						</div>

						{organizations.length === 0 ? (
							<div className="mt-6 flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
								<Building2 size={32} className="text-[#1E3A8A]/50" />
								<p className="mt-4 text-lg font-semibold text-[#475F83]">{t("dashboard.main.empty.title")}</p>
								<p className="mt-2 text-sm text-slate-400">{t("dashboard.main.empty.subtitle")}</p>
							</div>
						) : filteredOrganizations.length === 0 ? (
							<div className="mt-6 flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
								<p className="text-lg font-semibold text-[#475F83]">{t("dashboard.main.searchEmpty.title")}</p>
								<p className="mt-2 text-sm text-slate-400">{t("dashboard.main.searchEmpty.subtitle")}</p>
							</div>
						) : (
							<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
								{filteredOrganizations.map((org) => (
									<CommunityCard
										key={org.organizationId}
										name={org.name}
										description={org.description}
										logoUrl={org.logoUrl}
										membersCount={org.memberCount ?? 0}
										responsable={org.role}
										onClick={() => handleOrganizationClick(org.organizationId)}
										className={
											switchingOrganizationId === org.organizationId
												? "pointer-events-none opacity-70"
												: ""
										}
									/>
								))}
							</div>
						)}
					</section>

					<section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
						<div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
							<div>
								<p className="text-xs font-semibold uppercase tracking-wide text-[#D97706]">
									{t("dashboard.main.explore.searchCta")}
								</p>
								<h3 className="mt-1 text-2xl font-bold text-[#002045]">
									{t("dashboard.main.explore.title", { count: filteredAvailableChurches.length })}
								</h3>
								<p className="mt-2 max-w-2xl text-sm leading-6 text-[#475F83] sm:text-base">
									{t("dashboard.main.explore.subtitle")}
								</p>
							</div>

							<div className="flex w-full max-w-md items-center rounded-2xl border border-slate-200 bg-white p-1.5 text-[#74777F] shadow-sm transition-colors focus-within:border-[#1E3A8A]/40 focus-within:shadow-md lg:w-auto">
								<div className="flex min-w-0 flex-1 items-center gap-2 px-3">
									<Search size={18} className="shrink-0 text-[#1E3A8A]" />
									<input
										type="search"
										placeholder={t("dashboard.main.explore.searchPlaceholder")}
										value={searchTerm}
										onChange={(event) => setSearchTerm(event.target.value)}
										className="h-10 min-w-0 flex-1 bg-transparent text-sm text-[#002045] placeholder:text-slate-400 focus:outline-none"
									/>
								</div>
								{searchTerm ? (
									<button
										type="button"
										onClick={() => setSearchTerm("")}
										aria-label={t("dashboard.main.explore.clearSearch")}
										className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-[#002045]"
									>
										<X size={16} />
									</button>
								) : null}
								<div className="hidden h-8 w-px bg-slate-200 sm:block" />
								<div className="hidden px-3 text-xs font-semibold text-[#1E3A8A] sm:block">
									{filteredAvailableChurches.length}
								</div>
							</div>
						</div>

						<div className="mt-6 grid gap-4 lg:grid-cols-2">
							{filteredAvailableChurches.length === 0 ? (
								<div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-[#475F83]">
									{t("dashboard.main.explore.empty")}
								</div>
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
										onClick={() => {
											setJoinError(null);
											setPendingJoinChurch(church);
										}}
										className="max-w-none"
									/>
								))
							)}
						</div>
					</section>
				</main>
			</div>
		</div>
	);
}
