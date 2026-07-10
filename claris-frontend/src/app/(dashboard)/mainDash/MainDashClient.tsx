"use client";
import Link from "next/link";
import icon from "@/assets/images/logoSem.png";
import iconDark from "@/assets/images/lobo-SE.png";
import heroImg from "@/assets/images/create.png";
import { Bell, Building2, Compass, Search, Settings, Sparkles, X } from "lucide-react";
import CommunityCard from "@/components/layout/commityCard";
import CommunityJoin from "@/components/layout/commityJoin";
import { api } from "@/lib/api";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { DashboardStatCard } from "@/components/layout/DashboardStatCard";

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
	const cancelJoinButtonRef = useRef<HTMLButtonElement>(null);
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

	const filteredAvailableChurches = availableChurches.filter((organization) => {
		return (
			matchesSearchTerm(organization.name) ||
			matchesSearchTerm(organization.church.name)
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
		} catch (error) {
			const status = error instanceof Error ? (error as Error & { status?: number }).status : undefined;

			if (status === 401) {
				router.replace(addLocaleToPathname("/login", locale));
				return;
			}

			setToast({
				title: "Não foi possível carregar as igrejas.",
				description: error instanceof Error ? error.message : undefined,
				variant: "error",
			});
		} finally {
			setLoadingChurches(false);
		}
	}, [locale, router]);

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

	useEffect(() => {
		if (!pendingJoinChurch) {
			return;
		}

		cancelJoinButtonRef.current?.focus();

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setPendingJoinChurch(null);
				setJoinError(null);
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [pendingJoinChurch]);

	const displayName = user?.displayName?.trim();
	const firstName = displayName?.split(" ")[0];

	return (
		<div className="min-h-screen bg-brand-bg text-brand-primary dark:bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.16),transparent_32%),linear-gradient(to_bottom,#0f172a,#020617)]" >
			<FeedbackToast
				open={Boolean(toast)}
				title={toast?.title ?? ""}
				description={toast?.description}
				variant={toast?.variant}
				onClose={() => setToast(null)}
			/>
			{pendingJoinChurch && (
				<div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
					<div
						role="dialog"
						aria-modal="true"
						aria-labelledby="join-church-title"
						aria-describedby="join-church-description"
						tabIndex={-1}
						className="w-full max-w-sm rounded-2xl dark:bg-slate-900 bg-white p-6 shadow-2xl"
					>
						<h2 id="join-church-title" className="text-lg font-semibold text-brand-primary dark:text-slate-50">
							{t("dashboard.main.joinConfirm.title", { name: pendingJoinChurch.name })}
						</h2>

						<p id="join-church-description" className="mt-2 text-sm leading-6 text-brand-muted dark:text-slate-300">
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
								ref={cancelJoinButtonRef}
								onClick={() => {
									if (joiningChurch) return;
									setPendingJoinChurch(null);
									setJoinError(null);
								}}
								className="flex-1 rounded-xl border border-zinc-200 dark:bg-slate-50 py-3 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-slate-200"
							>
								{t("common.cancel")}
							</button>

							<button
								type="button"
								onClick={requestToJoin}
								disabled={joiningChurch}
								className="flex-1 rounded-xl bg-brand-primary py-3 text-sm font-medium text-white hover:bg-[#1E3A8A] disabled:opacity-60"
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
				<header className="sticky top-0 z-30 -mx-4 border-b border-white/70 dark:border-slate-700 bg-brand-bg/85 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8
				dark:bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.16),transparent_32%),linear-gradient(to_bottom,#0f172a,#020617)]">
					<div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
						<div className="flex items-center gap-3">
							<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white dark:bg-[#00000000] shadow-sm ring-1 ring-slate-200 dark:ring-slate-800">
								<img src={icon.src} alt={t("common.logoAlt")} className="block dark:hidden w-[30px] h-[30px]" />
								{/* Imagem para Modo Escuro */}
								<img src={iconDark.src} alt={t("common.logoAlt")} className="hidden dark:block w-[30px] h-[30px]" />
							</div>
							<div>
								<h1 className="text-xl font-bold tracking-wide text-[#1E3A8A] dark:text-slate-50">CLARIS</h1>
								<p className="hidden text-xs text-slate-500 dark:text-slate-200 sm:block">
									{user?.email ?? t("dashboard.main.welcome")}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2 sm:gap-3 dark:text-slate-50">

							<Link
								href={addLocaleToPathname("/settings", locale)}
								className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#00000000]  text-blue-900  shadow-sm transition-colors hover:border-accent-orange/40 hover:text-[#f1b064] dark:hover:text-slate-200"
								aria-label={t("settings.title")}
							>
								<Settings size={16} />
							</Link>
							<ModeToggle />
							<LanguageSelector />
						</div>
					</div>
				</header>

				<main className="flex flex-col gap-8 py-8">
					<section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
						<div className="flex min-h-80 flex-col justify-between rounded-3xl  dark:bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.16),transparent_32%),linear-gradient(to_bottom,#0f172a,#020617)] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 sm:p-8">
							<div>
								<div className="inline-flex items-center gap-2 rounded-full bg-[#1E3A8A]/10 dark:bg-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E3A8A] dark:text-slate-50">
									<Sparkles size={14} />
									{firstName ? `${t("dashboard.main.welcome")}, ${firstName}` : t("dashboard.main.welcome")}
								</div>
								<h2 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-brand-primary dark:text-slate-50 sm:text-5xl lg:text-6xl">
									{t("dashboard.main.title")}
								</h2>
								<p className="mt-4 max-w-2xl text-base leading-7 text-brand-muted dark:text-slate-500 sm:text-lg">
									{t("dashboard.main.subtitle")}
								</p>
							</div>
							{/*  */}
							<div className="mt-8 grid gap-3 sm:grid-cols-2 ">
								<DashboardStatCard
									title={t("dashboard.main.myChurches")}
									value={organizations.length}
									icon={<Building2 size={16} className="text-[#1E3A8A]" />}
								/>

								<DashboardStatCard
									title={t("dashboard.main.explore.searchCta")}
									value={availableChurches.length}
									icon={<Compass size={16} className="text-accent-orange" />}
								/>
							</div>
						</div>

						<section
							style={{
								backgroundImage: `linear-gradient(to right, rgba(0,32,69,0.96) 10%, rgba(30,58,138,0.82) 54%, rgba(217,119,6,0.45) 100%), url(${heroImg.src})`,
							}}
							className="flex min-h-80 flex-col justify-between overflow-hidden rounded-3xl bg-cover bg-center p-6 shadow-sm  sm:p-8"
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
								onSuccess={() => loadOrganizations()}
								onToast={(p) => setToast(p)}
								setOrganizations={setOrganizations}
							/>
						</section>
					</section>

					<section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 sm:p-6 dark:bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.16),transparent_32%),linear-gradient(to_bottom,#0f172a,#020617)]">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<p className="text-xs font-semibold uppercase tracking-wide text-accent-orange">
									{t("dashboard.main.myChurches")}
								</p>
								<h3 className="mt-1 text-2xl font-bold text-brand-primary dark:text-slate-50">
									{organizations.length} {t("community.communityLabel").toLowerCase()}
								</h3>
							</div>
							<div className="h-px bg-slate-200 dark:bg-slate-800 sm:w-1/3" />
						</div>

						{organizations.length === 0 ? (
							<div className="mt-6 flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 dark:bg-slate-900 bg-slate-50 px-6 py-12 text-center ">
								<Building2 size={32} className="text-[#1E3A8A]/50 dark:text-slate-50" />
								<p className="mt-4 text-lg font-semibold dark:text-slate-200 text-brand-muted">{t("dashboard.main.empty.title")}</p>
								<p className="mt-2 text-sm text-slate-400 dark:text-slate-400">{t("dashboard.main.empty.subtitle")}</p>
							</div>
						) : filteredOrganizations.length === 0 ? (
							<div className="mt-6 flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
								<p className="text-lg font-semibold text-brand-muted">{t("dashboard.main.searchEmpty.title")}</p>
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

					<section className="rounded-3xl bg-white dark:bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.16),transparent_32%),linear-gradient(to_bottom,#0f172a,#020617)] dark:ring-slate-800 p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
						<div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
							<div>
								<p className="text-xs font-semibold uppercase tracking-wide text-accent-orange">
									{t("dashboard.main.explore.searchCta")}
								</p>
								<h3 className="mt-1 text-2xl font-bold text-brand-primary dark:text-slate-50">
									{t("dashboard.main.explore.title", { count: filteredAvailableChurches.length })}
								</h3>
								<p className="mt-2 max-w-2xl text-sm leading-6 text-brand-muted dark:text-slate-400 sm:text-base">
									{t("dashboard.main.explore.subtitle")}
								</p>
							</div>

							<div className="flex w-full max-w-md items-center rounded-2xl border dark:border-slate-800 border-slate-200 dark:bg-slate-900 bg-white p-1.5 text-[#74777F] shadow-sm transition-colors focus-within:border-[#1E3A8A]/40 focus-within:shadow-md lg:w-auto">
								<div className="flex min-w-0 flex-1 items-center gap-2 px-3">
									<Search size={18} className="shrink-0 text-[#1E3A8A] dark:text-slate-50" />
									<input
										type="search"
										aria-label={t("dashboard.main.explore.searchPlaceholder")}
										placeholder={t("dashboard.main.explore.searchPlaceholder")}
										value={searchTerm}
										onChange={(event) => setSearchTerm(event.target.value)}
										className="h-10 min-w-0 flex-1 bg-transparent text-sm text-brand-primary dark:text-slate-50 placeholder:text-slate-400 focus:outline-none"
									/>
								</div>
								{searchTerm ? (
									<button
										type="button"
										onClick={() => setSearchTerm("")}
										aria-label={t("dashboard.main.explore.clearSearch")}
										className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition-color dark:hover:bg-slate-800 hover:bg-slate-100 dark:hover:text-slate-400 hover:text-brand-primary"
									>
										<X size={16} />
									</button>
								) : null}
								<div className="hidden h-8 w-px bg-slate-200 dark:bg-slate-800 sm:block" />
								<div className="hidden px-3 text-xs font-semibold text-[#1E3A8A] sm:block dark:text-slate-50">
									{filteredAvailableChurches.length}
								</div>
							</div>
						</div>

						<div className="mt-6 grid gap-4 lg:grid-cols-2">
							{filteredAvailableChurches.length === 0 ? (
								<div className="rounded-2xl border border-dashed dark:border-slate-800 border-slate-300 dark:bg-slate-900 bg-slate-50 px-6 py-10 text-center text-brand-muted dark:text-slate-300">
									{t("dashboard.main.explore.empty")}
								</div>
							) : (
								filteredAvailableChurches.map((organization) => (
									<CommunityJoin
										key={organization.id}
										name={organization.name}
										slug={organization.slug}
										address={organization.address}
										description={organization.description}
										logoUrl={organization.logoUrl}
										createdAt={organization.createdAt}
										church={{ id: organization.churchId ?? organization.id, name: organization.church.name }}
										membersCount={organization.memberCount}
										onClick={() => {
											setJoinError(null);
											setPendingJoinChurch(organization);
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
