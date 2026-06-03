"use client";

import {
	Building2,
	CalendarDays,
	ChevronLeft,
	Loader2,
	MapPin,
	MessageCircle,
	Plus,
	Send,
	ShieldCheck,
	Users,
	X,
} from "lucide-react";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
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
import { api } from "@/lib/api";
import Logo from "@/assets/images/logo.png";
import { FeedbackToast } from "@/components/ui/feedback-toast";
import { CreateEventDialog } from "@/components/layout/createEvent";
import { EditEventDialog } from "@/components/layout/editEvent";
import type { EditEventData } from "@/components/layout/editEvent";

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

type MembershipUser = {
	id?: string;
	userId?: string;
	displayName?: string | null;
	name?: string | null;
	email?: string | null;
	avatarUrl?: string | null;
};

type MembershipResponseItem = {
	id?: string;
	memberId?: string;
	userId?: string;
	displayName?: string | null;
	name?: string | null;
	email?: string | null;
	role?: string | null;
	avatarUrl?: string | null;
	user?: MembershipUser | null;
};

type MembershipsResponse =
	| MembershipResponseItem[]
	| {
			result?: MembershipResponseItem[] | { members?: MembershipResponseItem[] };
			members?: MembershipResponseItem[];
	  };

type ApiEvent = {
	id: string;
	title: string;
	description: string | null;
	date: string;
	location: string | null;
	photoUrl: string | null;
	createdAt?: string;
	interests?: { id: string }[];
	_count?: {
		interests?: number;
		comments?: number;
	};
};

type EventsResponse =
	| ApiEvent[]
	| {
			result?: ApiEvent[] | { events?: ApiEvent[] };
			events?: ApiEvent[];
	  };

type UpdateEventPayload = {
	title?: string;
	description?: string;
	location?: string;
};

type ToastState = {
	title: string;
	description?: string;
	variant: "success" | "error" | "info";
} | null;

type ChatMessage = {
	id: string;
	text: string;
	sender: "me" | "member";
	createdAt: Date;
};

function unwrapMembershipsResponse(response: MembershipsResponse): MembershipResponseItem[] {
	if (Array.isArray(response)) return response;
	if (Array.isArray(response.members)) return response.members;
	if (Array.isArray(response.result)) return response.result;
	if (response.result && Array.isArray(response.result.members)) return response.result.members;
	return [];
}

function unwrapEventsResponse(response: EventsResponse): ApiEvent[] {
	if (Array.isArray(response)) return response;
	if (Array.isArray(response.events)) return response.events;
	if (Array.isArray(response.result)) return response.result;
	if (response.result && Array.isArray(response.result.events)) return response.result.events;
	return [];
}

function mapMembershipToMember(membership: MembershipResponseItem): Member {
	const user = membership.user;
	const name =
		user?.displayName?.trim() ||
		user?.name?.trim() ||
		membership.displayName?.trim() ||
		membership.name?.trim() ||
		user?.email ||
		membership.email ||
		"Membro";

	return {
		id: membership.id ?? membership.memberId ?? user?.id ?? user?.userId ?? membership.userId ?? name,
		name,
		role: membership.role ?? "Membro",
		email: user?.email ?? membership.email ?? undefined,
		avatarUrl: user?.avatarUrl ?? membership.avatarUrl ?? undefined,
	};
}

const ADMIN_ROLES = new Set(["ADMIN", "SUPER_ADMIN"]);
const EVENT_IMAGE_FALLBACK = "/igreja.png";

function formatEventDate(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return { date: "--", time: "--:--" };

	const day = String(date.getDate()).padStart(2, "0");
	const month = new Intl.DateTimeFormat("pt-PT", { month: "short" })
		.format(date)
		.replace(".", "")
		.toUpperCase();
	const time = new Intl.DateTimeFormat("pt-PT", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(date);

	return { date: `${day} ${month}`, time };
}

function mapApiEventToCard(event: ApiEvent): EventCardProps {
	const eventDate = formatEventDate(event.date);

	return {
		id: event.id,
		date: eventDate.date,
		time: eventDate.time,
		title: event.title,
		description: event.description?.trim() || "Sem descrição disponível.",
		location: event.location?.trim() || "Local a definir",
		spotsRemaining: event._count?.interests ?? 0,
		imageUrl: event.photoUrl || EVENT_IMAGE_FALLBACK,
		isFavorited: Boolean(event.interests?.length),
	};
}

function getMemberInitials(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((word) => word[0])
		.join("")
		.toUpperCase();
}

function formatChatTime(date: Date) {
	return new Intl.DateTimeFormat("pt-PT", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(date);
}

function MemberChatPanel({
	member,
	messages,
	draft,
	onDraftChange,
	onSendMessage,
	onClose,
}: {
	member: Member | null;
	messages: ChatMessage[];
	draft: string;
	onDraftChange: (value: string) => void;
	onSendMessage: () => void;
	onClose: () => void;
}) {
	if (!member) {
		return (
			<aside className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm">
				<div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8EEF8] text-[#1E3A8A]">
					<MessageCircle size={24} />
				</div>
				<h3 className="mt-4 text-lg font-bold text-[#002045]">Iniciar conversa</h3>
				<p className="mt-2 max-w-xs text-sm leading-6 text-[#475F83]">
					Clique em um membro da comunidade para abrir o chat com essa pessoa.
				</p>
			</aside>
		);
	}

	return (
		<aside className="flex min-h-105 flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
			<header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
				<div className="flex min-w-0 items-center gap-3">
					{member.avatarUrl ? (
						<img
							src={member.avatarUrl}
							alt={member.name}
							className="h-11 w-11 rounded-full object-cover ring-2 ring-white"
						/>
					) : (
						<div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#002045] text-sm font-bold text-white">
							{getMemberInitials(member.name)}
						</div>
					)}
					<div className="min-w-0">
						<h3 className="truncate text-base font-bold text-[#002045]">{member.name}</h3>
						<p className="truncate text-xs font-semibold uppercase tracking-wide text-[#D97706]">
							{member.role}
						</p>
					</div>
				</div>
				<button
					type="button"
					onClick={onClose}
					aria-label="Fechar chat"
					className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-[#002045] hover:text-[#002045]"
				>
					<X size={16} />
				</button>
			</header>

			<div className="flex flex-1 flex-col gap-3 bg-[#F7F9FC] px-5 py-5">
				{messages.length ? (
					messages.map((message) => (
						<div
							key={message.id}
							className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
						>
							<div
								className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-6 shadow-sm ${
									message.sender === "me"
										? "rounded-br-md bg-[#002045] text-white"
										: "rounded-bl-md bg-white text-[#1a2a3a] ring-1 ring-slate-200"
								}`}
							>
								<p>{message.text}</p>
								<p
									className={`mt-1 text-[10px] font-semibold ${
										message.sender === "me" ? "text-white/65" : "text-slate-400"
									}`}
								>
									{formatChatTime(message.createdAt)}
								</p>
							</div>
						</div>
					))
				) : (
					<div className="flex flex-1 items-center justify-center text-center">
						<p className="max-w-xs text-sm leading-6 text-[#475F83]">
							A conversa com {member.name} está pronta. Escreva a primeira mensagem.
						</p>
					</div>
				)}
			</div>

			<form
				className="flex items-end gap-2 border-t border-slate-100 bg-white p-4"
				onSubmit={(event) => {
					event.preventDefault();
					onSendMessage();
				}}
			>
				<textarea
					value={draft}
					onChange={(event) => onDraftChange(event.target.value)}
					placeholder={`Mensagem para ${member.name.split(" ")[0]}...`}
					rows={1}
					className="max-h-28 min-h-11 flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#1a2a3a] outline-none transition-colors placeholder:text-slate-400 focus:border-[#002045] focus:bg-white"
				/>
				<button
					type="submit"
					disabled={!draft.trim()}
					aria-label="Enviar mensagem"
					className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#002045] text-white transition-colors hover:bg-[#1E3A8A] disabled:cursor-not-allowed disabled:bg-slate-300"
				>
					<Send size={17} />
				</button>
			</form>
		</aside>
	);
}

function DashboardPageContent() {
	const { locale } = useMessages();
	const router = useRouter();
	const searchParams = useSearchParams();
	const selectedOrganizationId = searchParams.get("org");
	const setUser = useUserStore((state) => state.setUser);
	const [organization, setOrganization] = useState<OrganizationRef | null>(null);
	const [organizationMembers, setOrganizationMembers] = useState<Member[]>([]);
	const [membersError, setMembersError] = useState<string | null>(null);
	const [organizationEvents, setOrganizationEvents] = useState<EventCardProps[]>([]);
	const [rawEvents, setRawEvents] = useState<ApiEvent[]>([]);
	const [eventsError, setEventsError] = useState<string | null>(null);
	const [interestPendingEventIds, setInterestPendingEventIds] = useState<Set<EventCardProps["id"]>>(
		() => new Set(),
	);
	const [toast, setToast] = useState<ToastState>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [editingEvent, setEditingEvent] = useState<EditEventData | null>(null);
	const [selectedChatMember, setSelectedChatMember] = useState<Member | null>(null);
	const [chatDraft, setChatDraft] = useState("");
	const [chatMessagesByMember, setChatMessagesByMember] = useState<Record<string, ChatMessage[]>>({});

	const loadOrganizationEvents = useCallback(async (organizationId: string) => {
		const response = await api.get<EventsResponse>(
			`/organizations/${organizationId}/events`,
		);

		const raw = unwrapEventsResponse(response);
		setRawEvents(raw);
		return raw.map(mapApiEventToCard);
	}, []);

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
				setOrganizationMembers([]);
				setMembersError(null);
				setOrganizationEvents([]);
				setEventsError(null);
				setLoading(false);
				return;
			}

			setOrganization(nextOrganization);
			setOrganizationMembers([]);
			setMembersError(null);
			setOrganizationEvents([]);
			setEventsError(null);

			const [membershipsResult, eventsResult] = await Promise.allSettled([
				api.get<MembershipsResponse>(
					`/organizations/${nextOrganization.organizationId}/memberships`,
				),
				loadOrganizationEvents(nextOrganization.organizationId),
			]);

			if (!active) return;

			if (membershipsResult.status === "fulfilled") {
				setOrganizationMembers(
					unwrapMembershipsResponse(membershipsResult.value).map(mapMembershipToMember),
				);
			} else {
				setMembersError(
					membershipsResult.reason instanceof Error
						? membershipsResult.reason.message
						: "Não foi possível carregar os membros desta organização.",
				);
			}

			if (eventsResult.status === "fulfilled") {
				setOrganizationEvents(eventsResult.value);
			} else {
				setEventsError(
					eventsResult.reason instanceof Error
						? eventsResult.reason.message
						: "Não foi possível carregar os eventos desta organização.",
				);
			}

			if (!selectedOrganizationId) {
				router.replace(addLocaleToPathname(`/mainCenter?org=${nextOrganization.organizationId}`, locale));
			}

			setLoading(false);
		}

		void loadCenterData();

		return () => {
			active = false;
		};
	}, [loadOrganizationEvents, locale, router, selectedOrganizationId, setUser]);

	useEffect(() => {
		if (!toast) return;

		const timeoutId = window.setTimeout(() => {
			setToast(null);
		}, 4200);

		return () => window.clearTimeout(timeoutId);
	}, [toast]);

	const organizationAddress = organization?.address?.trim() || "Endereço não informado";
	const organizationDescription =
		organization?.description?.trim() || "Centro da comunidade selecionada.";
	const organizationMemberCount =
		organization?.memberCount ?? organization?.membersCount ?? organizationMembers.length;
	const totalParticipants = organizationEvents.reduce(
		(total, event) => total + event.spotsRemaining,
		0,
	);
	const organizationInitial = organization?.name?.[0]?.toUpperCase() ?? "C";
	const roleLabel = organization?.role?.replaceAll("_", " ") ?? "Membro";
	const backHref = addLocaleToPathname("/mainDash", locale);
	const canManageEvents = ADMIN_ROLES.has(organization?.role?.toUpperCase() ?? "");
	const centerStats = [
		{ label: "Membros", value: organizationMemberCount, icon: Users },
		{ label: "Eventos", value: organizationEvents.length, icon: CalendarDays },
		{ label: "Participantes", value: totalParticipants, icon: ShieldCheck },
	];
	const handleToggleEventInterest = useCallback(
		async (eventId: EventCardProps["id"]) => {
			if (!organization || interestPendingEventIds.has(eventId)) return;

			const currentEvent = organizationEvents.find((event) => event.id === eventId);
			if (!currentEvent) return;

			const wasParticipating = Boolean(currentEvent.isFavorited);
			const endpoint = `/organizations/${organization.organizationId}/events/${eventId}/interests`;

			setEventsError(null);
			setInterestPendingEventIds((currentIds) => new Set(currentIds).add(eventId));

			try {
				if (wasParticipating) {
					await api.delete(endpoint);
				} else {
					await api.post(endpoint, {});
				}

				setOrganizationEvents((currentEvents) =>
					currentEvents.map((event) => {
						if (event.id !== eventId) return event;

						return {
							...event,
							isFavorited: !wasParticipating,
							spotsRemaining: Math.max(
								0,
								event.spotsRemaining + (wasParticipating ? -1 : 1),
							),
						};
					}),
				);
				setToast({
					title: wasParticipating
						? "Você deixou de participar neste evento."
						: "Você está a participar neste evento.",
					variant: "success",
				});
			} catch (error) {
				const message =
					error instanceof Error
						? error.message
						: "Não foi possível actualizar a sua participação.";
				setEventsError(message);
				setToast({
					title: "Não foi possível actualizar a participação.",
					description: message,
					variant: "error",
				});
			} finally {
				setInterestPendingEventIds((currentIds) => {
					const nextIds = new Set(currentIds);
					nextIds.delete(eventId);
					return nextIds;
				});
			}
		},
		[interestPendingEventIds, organization, organizationEvents],
	);

	const handleRefreshEvents = useCallback(async () => {
		if (!organization) return;
		try {
			const freshEvents = await loadOrganizationEvents(organization.organizationId);
			setOrganizationEvents(freshEvents);
		} catch (error) {
			console.error("Erro ao atualizar eventos:", error);
		}
	}, [loadOrganizationEvents, organization]);

	const handleDeleteEvent = useCallback(
		async (eventId: EventCardProps["id"]) => {
			if (!organization) return;

			setEventsError(null);

			try {
				await api.delete(
					`/organizations/${organization.organizationId}/events/${eventId}`,
				);
				setOrganizationEvents((currentEvents) =>
					currentEvents.filter((event) => event.id !== eventId),
				);
			} catch (error) {
				setEventsError(
					error instanceof Error
						? error.message
						: "Não foi possível eliminar este evento.",
				);
			}
		},
		[organization],
	);
	const handleUpdateEvent = useCallback(
		(eventId: EventCardProps["id"]) => {
			const raw = rawEvents.find((e) => e.id === eventId);
			if (!raw) return;

			setEditingEvent({
				id: raw.id,
				title: raw.title,
				description: raw.description,
				date: raw.date,
				location: raw.location,
				photoUrl: raw.photoUrl,
			});
			setEditDialogOpen(true);
		},
		[rawEvents],
	);
	const visibleEvents = useMemo(() => {
		if (canManageEvents) {
			return organizationEvents.map((event) => ({
				...event,
				onEdit: handleUpdateEvent,
				onDelete: handleDeleteEvent,
				onParticipate: undefined,
				onFavorite: undefined,
			}));
		}

		return organizationEvents.map((event) => ({
			...event,
			onEdit: undefined,
			onDelete: undefined,
			onParticipate: handleToggleEventInterest,
			onFavorite: handleToggleEventInterest,
			isParticipationPending: interestPendingEventIds.has(event.id),
		}));
	}, [
		canManageEvents,
		handleDeleteEvent,
		handleToggleEventInterest,
		handleUpdateEvent,
		interestPendingEventIds,
		organizationEvents,
	]);
	const selectedChatMessages = selectedChatMember
		? chatMessagesByMember[String(selectedChatMember.id)] ?? []
		: [];
	const handleMemberChatOpen = useCallback((member: Member) => {
		setSelectedChatMember(member);
		setChatDraft("");
	}, []);
	const handleSendChatMessage = useCallback(() => {
		if (!selectedChatMember || !chatDraft.trim()) return;

		const memberKey = String(selectedChatMember.id);
		const nextMessage: ChatMessage = {
			id: `${memberKey}-${Date.now()}`,
			text: chatDraft.trim(),
			sender: "me",
			createdAt: new Date(),
		};

		setChatMessagesByMember((currentMessages) => ({
			...currentMessages,
			[memberKey]: [...(currentMessages[memberKey] ?? []), nextMessage],
		}));
		setChatDraft("");
	}, [chatDraft, selectedChatMember]);

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
		<div className="min-h-screen bg-[#F7F9FC] text-[#002045]">
			<FeedbackToast
				open={Boolean(toast)}
				title={toast?.title ?? ""}
				description={toast?.description}
				variant={toast?.variant}
				onClose={() => setToast(null)}
			/>
			<header className="sticky top-0 z-40 border-b border-white/70 bg-[#F7F9FC]/85 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
					<Link href={backHref} className="flex items-center justify-center gap-3">
						<span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
							<Image src={Logo} alt="Logo" width={34} height={34} />
						</span>
					</Link>
					<div className="flex items-center gap-3">
						<Link
							href={backHref}
							className="flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-[#002045] shadow-sm transition-colors hover:border-[#1E3A8A]/30 hover:text-[#1E3A8A]"
						>
							<ChevronLeft size={16} />
							Voltar
						</Link>
					</div>
				</div>
			</header>

			<main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
				<section className="side3 relative overflow-hidden rounded-3xl bg-[#002045] shadow-sm">
					<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,32,69,0.96)_0%,rgba(30,58,138,0.84)_54%,rgba(217,119,6,0.38)_100%)]" />
					<div className="relative grid min-h-90 gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
						<div className="flex flex-col justify-between gap-8">
							<div>
								<div className="flex flex-wrap items-center gap-3">
									<span className="inline-flex items-center gap-2 rounded-full bg-[#FFDEA5] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#5D4201]">
										<ShieldCheck size={14} />
										{roleLabel}
									</span>
									{organization.slug ? (
										<span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
											{organization.slug}
										</span>
									) : null}
								</div>

								<h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
									{organization.name}
								</h1>
								<p className="mt-4 max-w-2xl text-base leading-7 text-white/82 sm:text-lg">
									{organizationDescription}
								</p>

								<div className="mt-6 flex max-w-2xl items-start gap-3 rounded-2xl bg-white/10 px-4 py-3 text-white ring-1 ring-white/15 backdrop-blur-sm">
									<MapPin size={20} className="mt-0.5 shrink-0 text-[#FFDEA5]" />
									<p className="text-sm font-semibold leading-6 sm:text-base">
										{organizationAddress}
									</p>
								</div>
							</div>

							{canManageEvents ? (
								<CreateEventDialog
									organizationId={organization.organizationId}
									onSuccess={handleRefreshEvents}
								>
									<Button className="h-12 w-fit rounded-2xl bg-[#FFDEA5] px-5 font-bold text-[#5D4201] shadow-sm hover:bg-[#FFD38A]">
										<Plus size={18} />
										<span>Criar Evento</span>
									</Button>
								</CreateEventDialog>
							) : null}
						</div>

						<div className="flex flex-col justify-end gap-4">
							<div className="w-full rounded-3xl bg-white/94 p-5 shadow-xl shadow-slate-950/10 ring-1 ring-white/70 backdrop-blur">
								<div className="flex items-center gap-4">
									{organization.logoUrl ? (
										<Image
											src={organization.logoUrl}
											alt={`Logo de ${organization.name}`}
											width={72}
											height={72}
											unoptimized
											className="h-18 w-18 rounded-2xl object-contain ring-1 ring-slate-200"
										/>
									) : (
										<div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-[#002045] text-2xl font-bold text-white">
											{organizationInitial}
										</div>
									)}
									<div className="min-w-0">
										<p className="text-xs font-semibold uppercase tracking-wide text-[#D97706]">
											Organização atual
										</p>
										<p className="mt-1 truncate text-xl font-bold text-[#002045]">
											{organization.name}
										</p>
									</div>
								</div>

								<div className="mt-5 grid grid-cols-3 gap-2">
									{centerStats.map((stat) => {
										const Icon = stat.icon;

										return (
											<div key={stat.label} className="rounded-2xl bg-[#F7F9FC] p-3 ring-1 ring-slate-200">
												<div className="flex items-center gap-1.5 text-xs font-semibold text-[#475F83]">
													<Icon size={14} className="text-[#1E3A8A]" />
													<span className="truncate">{stat.label}</span>
												</div>
												<p className="mt-2 text-2xl font-bold text-[#002045]">{stat.value}</p>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</section>

				<div className="flex items-center justify-center">
					<SearchBar />
				</div>

				<section className="flex flex-col gap-4">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<p className="text-xs font-semibold uppercase tracking-wide text-[#D97706]">
								Agenda da comunidade
							</p>
							<h2 className="mt-1 text-3xl font-bold tracking-tight text-[#002045] sm:text-4xl">
								Próximos Encontros
							</h2>
							<p className="mt-3 max-w-2xl text-base leading-7 text-[#475F83]">
								Junte-se à comunidade {organization.name} em momentos de reflexão, música e serviço.
							</p>
						</div>
						<div className="flex h-11 w-fit items-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-[#1E3A8A] shadow-sm ring-1 ring-slate-200">
							<CalendarDays size={16} />
							{organizationEvents.length} eventos
						</div>
					</div>

					{eventsError ? (
						<p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
							{eventsError}
						</p>
					) : visibleEvents.length ? (
						<EventList events={visibleEvents} initialCount={3} />
					) : (
						<div className="flex min-h-48 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
							<CalendarDays size={32} className="text-[#1E3A8A]/50" />
							<p className="mt-4 text-lg font-semibold text-[#475F83]">
								Ainda não existem eventos publicados nesta organização.
							</p>
						</div>
					)}
				</section>

				<section className="grid gap-5 pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.78fr)]">
					<div>
						<CommunityMembers
							title={`Membros de ${organization.name}`}
							subtitle={
								membersError
									? `Não foi possível carregar os membros: ${membersError}`
									: `Você está a entrar como ${roleLabel}. Clique em um membro para conversar.`
							}
							members={organizationMembers}
							maxVisible={12}
							onViewAll={() => console.log("Ver todos")}
							onInvite={() => console.log("Convidar")}
							onMemberClick={handleMemberChatOpen}
						/>
					</div>
					<MemberChatPanel
						member={selectedChatMember}
						messages={selectedChatMessages}
						draft={chatDraft}
						onDraftChange={setChatDraft}
						onSendMessage={handleSendChatMessage}
						onClose={() => {
							setSelectedChatMember(null);
							setChatDraft("");
						}}
					/>
				</section>
			</main>

			{/* Edit Event Dialog */}
			{organization ? (
				<EditEventDialog
					organizationId={organization.organizationId}
					event={editingEvent}
					open={editDialogOpen}
					onOpenChange={setEditDialogOpen}
					onSuccess={handleRefreshEvents}
				/>
			) : null}
		</div>
	);
}

export default function DashboardPage() {
	return (
		<Suspense
			fallback={
				<div className="flex min-h-screen items-center justify-center bg-[#F7F9FC] text-[#002045]">
					<Loader2 className="mr-2 animate-spin" size={20} />
					<span>A carregar o centro da organização...</span>
				</div>
			}
		>
			<DashboardPageContent />
		</Suspense>
	);
}
