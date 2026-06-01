"use client";

import { ArrowRight, Building2, Loader2, MapPin, ShieldCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/layout/SeachBar";
import type { EventCardProps } from "@/components/layout/EventCard";
import EventList from "@/components/layout/EventList";
import CommunityMembers, { Member } from "@/components/layout/CommunityMembers";
import { getCurrentUser, getMyOrganizations } from "@/utils/actionMain";
import { useMessages } from "@/i18n/messages";
import { addLocaleToPathname } from "@/i18n/routing";
import { useUserStore } from "@/stores/userStore";
import Logo from "@/assets/images/logo.png";

interface OrganizationRef {
	id?: string;
	churchId?: string;
	organizationId: string;
	name: string;
	slug?: string;
	logoUrl: string | null;
	role: string;
	description?: string | null;
	address?: string | null;
	memberCount?: number | null;
	membersCount?: number | null;
	createdAt?: string | Date;
}

interface CurrentUser {
	id?: string;
	userId?: string;
	displayName?: string | null;
	email?: string | null;
	avatarUrl?: string | null;
}

const members: Member[] = [
	{ id: "1", name: "Ana Silva", role: "Membro Fundador", avatarColor: "#2d4a7a" },
	{ id: "2", name: "Gabriel Costa", role: "Líder de Jovens", avatarUrl: "/images/gabriel.jpg" },
	{ id: "3", name: "Elena Luz", role: "Ministério de Oração", avatarColor: "#7ab4e0" },
	{ id: "4", name: "Ricardo M.", role: "Voluntário", avatarColor: "#e0c47a" },
	{ id: "5", name: "Sofia Rocha", role: "Membro", avatarUrl: "/images/sofia.jpg" },
	{ id: "6", name: "Pedro Alves", role: "Diácono", avatarColor: "#4a7c6f" },
];

const events: EventCardProps[] = [
	{
		id: "workshop-1",
		date: "15 OUT",
		time: "09:00",
		title: "Workshop: Liderança com Alma",
		description: "Explore princípios de gestão e vida baseados na integridade, propósito e compaixão em um ambiente de mentoria.",
		location: "Centro de Formação, Lisboa",
		spotsRemaining: 12,
		imageUrl: "/images/workshop.jpg",
		isFavorited: false,
		onEdit: (id) => console.log("Editar:", id),
		onDelete: (id) => console.log("Eliminar:", id),
		onParticipate: (id) => console.log("Participar:", id),
		onFavorite: (id) => console.log("Favorito:", id),
	},
	{
		id: "workshop-2",
		date: "22 OUT",
		time: "17:30",
		title: "Encontro de Comunidade",
		description: "Um tempo preparado para oração, partilha e integração dos membros.",
		location: "Auditório Principal",
		spotsRemaining: 24,
		imageUrl: "/images/workshop.jpg",
		isFavorited: false,
		onEdit: (id) => console.log("Editar:", id),
		onDelete: (id) => console.log("Eliminar:", id),
		onParticipate: (id) => console.log("Participar:", id),
		onFavorite: (id) => console.log("Favorito:", id),
	},
	{
		id: "workshop-3",
		date: "29 OUT",
		time: "10:00",
		title: "Serviço Solidário",
		description: "Organização de equipes para ações práticas de apoio à comunidade local.",
		location: "Ponto de Missão",
		spotsRemaining: 8,
		imageUrl: "/images/workshop.jpg",
		isFavorited: false,
		onEdit: (id) => console.log("Editar:", id),
		onDelete: (id) => console.log("Eliminar:", id),
		onParticipate: (id) => console.log("Participar:", id),
		onFavorite: (id) => console.log("Favorito:", id),
	},
];

export default function DashboardPage() {
	const { locale } = useMessages();
	const router = useRouter();
	const searchParams = useSearchParams();
	const selectedOrganizationId = searchParams.get("org");
	const storedUser = useUserStore((state) => state.user);
	const setUser = useUserStore((state) => state.setUser);
	const [organization, setOrganization] = useState<OrganizationRef | null>(null);
	const [currentUser, setCurrentUser] = useState<CurrentUser | null>(storedUser);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let active = true;

		async function loadCenterData() {
			setLoading(true);
			setError(null);

			const [organizationsResult, userResult] = await Promise.all([
				getMyOrganizations(),
				getCurrentUser(),
			]);

			if (!active) return;

			const organizations = Array.isArray(organizationsResult)
				? (organizationsResult as OrganizationRef[])
				: [];
			const nextUser =
				(userResult as CurrentUser | null) ?? useUserStore.getState().user;
			const nextOrganization =
				organizations.find((org) => org.organizationId === selectedOrganizationId) ??
				organizations[0] ??
				null;

			if (nextUser) {
				setCurrentUser(nextUser);

				const nextUserId =
					"userId" in nextUser ? nextUser.id ?? nextUser.userId : nextUser.id;
				if (nextUserId && nextUser.displayName && nextUser.email) {
					setUser({
						id: nextUserId,
						displayName: nextUser.displayName,
						email: nextUser.email,
						avatarUrl: nextUser.avatarUrl ?? undefined,
					});
				}
			}

			if (!nextOrganization) {
				setError("Não foi possível encontrar os dados desta organização.");
				setLoading(false);
				return;
			}

			setOrganization(nextOrganization);

			if (!selectedOrganizationId) {
				router.replace(addLocaleToPathname(`/mainCenter?org=${nextOrganization.organizationId}`, locale));
			}

			setLoading(false);
		}

		void loadCenterData();

		return () => {
			active = false;
		};
	}, [locale, router, selectedOrganizationId, setUser]);

	const memberCount = organization?.memberCount ?? organization?.membersCount ?? 0;
	const userName = currentUser?.displayName?.trim() || "Usuário";
	const userInitial = userName[0]?.toUpperCase() ?? "U";
	const organizationDescription = organization?.description?.trim() || "Centro da comunidade selecionada.";
	const organizationAddress = organization?.address?.trim() || "Endereço não informado";
	const backHref = addLocaleToPathname("/mainDash", locale);

	const stats = useMemo(
		() => [
			{ label: "Membros", value: memberCount, icon: Users },
			{ label: "Função", value: organization?.role ?? "-", icon: ShieldCheck },
			{ label: "Comunidade", value: organization?.slug ?? organization?.name ?? "-", icon: Building2 },
		],
		[memberCount, organization?.name, organization?.role, organization?.slug],
	);

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-white text-[#002045]">
				<Loader2 className="mr-2 animate-spin" size={20} />
				<span>A carregar o centro da organização...</span>
			</div>
		);
	}

	if (error || !organization) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center text-[#002045]">
				<Building2 size={34} className="text-[#D97706]" />
				<p className="text-lg font-semibold">{error ?? "Organização não encontrada."}</p>
				<Link href={backHref} className="rounded-xl bg-[#002045] px-5 py-2.5 text-sm font-semibold text-white">
					Voltar para minhas igrejas
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white text-[#002045]">
			<header className="h-20 border-b border-gray-200 px-8">
				<div className="mx-auto flex h-full max-w-7xl justify-between">
					<Link href={backHref} className="flex items-center justify-center gap-3">
						<Image src={Logo} alt="Logo" width={50} height={50} />
						<span className="font-bold text-[#1E3A8A]">CLARIS</span>
					</Link>
					<div className="flex items-center gap-3">
						<div className="hidden items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2 text-sm text-slate-600 sm:flex">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#002045] text-xs font-bold text-white">
								{userInitial}
							</div>
							<div className="leading-tight">
								<p className="font-semibold text-[#002045]">{userName}</p>
								<p className="text-xs text-slate-400">{currentUser?.email}</p>
							</div>
						</div>
						<Link href={backHref} className="flex h-10 items-center justify-center rounded-2xl bg-[#002045] px-5 text-sm font-semibold text-white">
							Voltar
						</Link>
					</div>
				</div>
			</header>

			<section className="side3 px-8 py-16">
				<div className="mx-auto flex max-w-7xl flex-col gap-8">
					<div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-3xl">
							<div className="flex flex-wrap items-center gap-3">
								<p className="w-fit rounded-2xl bg-[#FFDEA5] px-4 py-1 text-sm font-bold tracking-wide text-[#5D4201]">
									{organization.role}
								</p>
								<p className="w-fit rounded-2xl bg-white/15 px-4 py-1 text-sm font-semibold text-white backdrop-blur">
									{organization.slug}
								</p>
							</div>
							<h1 className="mt-6 text-4xl font-bold tracking-wide text-white sm:text-5xl">
								{organization.name}
							</h1>
							<p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-white/90">
								{organizationDescription}
							</p>
							<div className="mt-5 flex gap-3">
								<MapPin size={24} color="#FFDEA5" />
								<p className="text-lg font-bold tracking-wide text-white">
									{organizationAddress}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-4 rounded-2xl bg-white/95 p-4 shadow-sm">
							{organization.logoUrl ? (
								<Image
									src={organization.logoUrl}
									alt={`Logo de ${organization.name}`}
									width={64}
									height={64}
									unoptimized
									className="h-16 w-16 rounded-xl object-contain"
								/>
							) : (
								<div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#002045] text-xl font-bold text-white">
									{organization.name[0]?.toUpperCase()}
								</div>
							)}
							<div>
								<p className="text-sm font-semibold text-slate-500">Organização atual</p>
								<p className="text-lg font-bold text-[#002045]">{organization.name}</p>
							</div>
						</div>
					</div>

					<div className="grid gap-3 sm:grid-cols-3">
						{stats.map((stat) => {
							const Icon = stat.icon;
							return (
								<div key={stat.label} className="rounded-2xl border border-white/20 bg-white/95 p-4 shadow-sm">
									<div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
										<Icon size={16} className="text-[#D97706]" />
										{stat.label}
									</div>
									<p className="mt-2 truncate text-2xl font-bold text-[#002045]">{stat.value}</p>
								</div>
							);
						})}
					</div>

					<Button className="h-13 w-50 rounded-2xl bg-[#FFDEA5] font-bold text-[#5D4201] hover:bg-[#FFDEA5]/90">
						<span>Criar Evento</span>
						<ArrowRight size={20} color="#5D4201" />
					</Button>
				</div>
			</section>

			<div className="mt-3 flex items-center justify-center">
				<SearchBar />
			</div>

			<section className="mx-auto mt-10 flex max-w-7xl flex-col gap-4 px-8">
				<p className="text-[36px] italic tracking-tight text-[#002045]">Próximos Encontros</p>
				<p className="max-w-2xl text-lg tracking-wide text-[#002045]">
					Junte-se à comunidade {organization.name} em momentos de reflexão, música e serviço.
				</p>
			</section>

			<section className="mx-auto mt-6 flex max-w-7xl flex-wrap items-center justify-between gap-6 px-8">
				<EventList events={events} initialCount={3} />
			</section>

			<section className="mx-auto flex max-w-7xl items-center justify-center px-8 py-10">
				<CommunityMembers
					title={`Membros de ${organization.name}`}
					subtitle={`Você está a entrar como ${organization.role}.`}
					members={members}
					maxVisible={5}
					onViewAll={() => console.log("Ver todos")}
					onInvite={() => console.log("Convidar")}
					onMemberClick={(member) => console.log("Clicou:", member.name)}
				/>
			</section>
		</div>
	);
}
