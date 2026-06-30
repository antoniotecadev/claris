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
	UserMinus,
	Users,
	X,
} from "lucide-react";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { io, type Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import type { EventCardProps } from "@/components/layout/EventCard";
import EventList from "@/components/layout/EventList";
import CommunityMembers, { Member } from "@/components/layout/CommunityMembers";
import { Avatar } from "@/components/ui/avatar";
import { IconButton } from "@/components/ui/icon-button";
import { getCurrentUser, getMyOrganizations } from "@/utils/actionMain";
import { useMessages } from "@/i18n/messages";
import { addLocaleToPathname } from "@/i18n/routing";
import { useUserStore } from "@/stores/userStore";
import { api } from "@/lib/api";
import { normalizeMediaUrl } from "@/lib/media-url";
import Logo from "@/assets/images/logo.png";
import LogoDark from "@/assets/images/logoBr.png";
import { FeedbackToast } from "@/components/ui/feedback-toast";
import { CreateEventDialog } from "@/components/layout/createEvent";
import { EditEventDialog } from "@/components/layout/editEvent";
import type { EditEventData } from "@/components/layout/editEvent";
import { boolean } from "zod";

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
	interestedCount?: number;
	description: string | null;
	date: string;
	location: string | null;
	photoUrl: string | null;
	createdAt?: string;
	interested?: boolean;
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

type FriendApiUser = {
	id?: string;
	userId?: string;
	displayName?: string | null;
	name?: string | null;
	email?: string | null;
	role?: string | null;
	avatarUrl?: string | null;
};

type FriendApiItem = FriendApiUser & {
	friend?: FriendApiUser | null;
};

type FriendsResponse = {
	friends?: FriendApiItem[];
};

type AddFriendResponse = {
	friendship?: {
		friend?: FriendApiUser | null;
	};
};

type ChatApiMessage = {
	id?: string;
	organizationId?: string | null;
	content?: string | null;
	text?: string | null;
	message?: string | null;
	senderId?: string | null;
	userId?: string | null;
	recipientId?: string | null;
	receiverId?: string | null;
	friendId?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	sender?: FriendApiUser | null;
	data?: unknown;
	result?: unknown;
};

type ChatMessagesResponse =
	| ChatApiMessage[]
	| {
		messages?: ChatApiMessage[];
		result?: ChatApiMessage[] | { messages?: ChatApiMessage[] };
	};

type SendMessageResponse = {
	message?: ChatApiMessage;
};

type AuthTokenResponse = {
	token: string | null;
};

type ChatRealtimePayload =
	| ChatApiMessage
	| {
		message?: ChatApiMessage;
		data?: ChatApiMessage;
		result?: ChatApiMessage;
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

function unwrapChatMessagesResponse(response: ChatMessagesResponse): ChatApiMessage[] {
	if (Array.isArray(response)) return response;
	if (Array.isArray(response.messages)) return response.messages;
	if (Array.isArray(response.result)) return response.result;
	if (response.result && Array.isArray(response.result.messages)) return response.result.messages;
	return [];
}

function unwrapRealtimeMessage(payload: ChatRealtimePayload): ChatApiMessage | null {
	if ("content" in payload || "senderId" in payload || "recipientId" in payload) {
		return payload;
	}

	return payload.message ?? payload.data ?? payload.result ?? null;
}

function buildSocketUrl() {
	return `${SOCKET_BASE_URL.replace(/\/$/, "")}/chat`;
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

	// IMPORTANT: prioritize user.id / user.userId / membership.userId (the actual user ID)
	// over membership.id (the membership record ID). The backend expects user IDs for friend operations.
	return {
		id: user?.id ?? user?.userId ?? membership.userId ?? membership.id ?? membership.memberId ?? name,
		name,
		role: membership.role ?? "Membro",
		email: user?.email ?? membership.email ?? undefined,
		avatarUrl: user?.avatarUrl ?? membership.avatarUrl ?? undefined,
	};
}

const ADMIN_ROLES = new Set(["ADMIN", "SUPER_ADMIN"]);
const EVENT_IMAGE_FALLBACK = "/igreja.png";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
const SOCKET_BASE_URL =
	process.env.NEXT_PUBLIC_SOCKET_URL || API_BASE_URL.replace(/\/api\/v1\/?$/, "");

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
		interestedCount: getEventInterestedCount(event),
		imageUrl: event.photoUrl || EVENT_IMAGE_FALLBACK,
		isFavorited: event.interested ?? Boolean(event.interests?.length),
	};
}

function getEventInterestedCount(event: ApiEvent) {
	return event.interestedCount ?? event._count?.interests ?? event.interests?.length ?? 0;
}

function normalizeApiEvent(event: ApiEvent): ApiEvent {
	return {
		...event,
		interestedCount: getEventInterestedCount(event),
	};
}

function mapFriendToMember(item: FriendApiItem): Member {
	const friend = item.friend ?? item;

	return {
		id: friend.id ?? friend.userId ?? "",
		name: friend.displayName?.trim() || friend.name?.trim() || friend.email || "Membro",
		role: friend.role ?? "Membro",
		email: friend.email ?? undefined,
		avatarUrl: friend.avatarUrl ?? undefined,
	};
}

function mapApiMessageToChatMessage(
	message: ChatApiMessage,
	currentUserId?: string,
	fallbackFriendId?: string,
): ChatMessage {
	const senderId = message.senderId ?? message.userId ?? message.sender?.id ?? message.sender?.userId;
	const isMine = currentUserId != null && senderId != null && String(senderId) === String(currentUserId);
	const createdAt = new Date(message.createdAt ?? message.updatedAt ?? Date.now());

	return {
		id: message.id ?? `${fallbackFriendId ?? "message"}-${createdAt.getTime()}`,
		text: message.content ?? message.text ?? message.message ?? "",
		sender: isMine ? "me" : "member",
		createdAt: Number.isNaN(createdAt.getTime()) ? new Date() : createdAt,
	};
}

function formatChatTime(date: Date) {
	return new Intl.DateTimeFormat("pt-PT", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	}).format(date);
}

function ChatMemberAvatar({ member }: { member: Member }) {
	return <Avatar name={member.name} url={member.avatarUrl} size="md" className="h-11 w-11" />;
}

function MemberChatPanel({
	member,
	messages,
	draft,
	onDraftChange,
	onSendMessage,
	onClose,
	isFriend,
	onAddFriend,
	onRemoveFriend,
	isRemovingFriend,
	isLoadingMessages,
	isSendingMessage,
	messagesError,
}: {
	member: Member | null;
	messages: ChatMessage[];
	draft: string;
	onDraftChange: (value: string) => void;
	onSendMessage: () => void;
	onClose: () => void;
	isFriend: boolean;
	onAddFriend?: () => void;
	onRemoveFriend?: () => void;
	isRemovingFriend?: boolean;
	isLoadingMessages?: boolean;
	isSendingMessage?: boolean;
	messagesError?: string | null;
}) {
	const { t } = useMessages();
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	useEffect(() => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		textarea.style.height = "auto";
		textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`;
	}, [draft]);

	if (!member) {
		return (
			<aside className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed dark:bg-slate-900 dark:border-slate-800 border-slate-300 bg-white px-6 py-10 text-center shadow-sm">
				<div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-light dark:bg-slate-800 dark:text-slate-300 text-brand-primary">
					<MessageCircle size={24} />
				</div>
				<h3 className="mt-4 text-lg font-bold dark:text-slate-50 text-brand-primary">{t("chat.startConversation")}</h3>
				<p className="mt-2 max-w-xs text-sm leading-6 dark:text-slate-500 text-brand-muted">
					{t("chat.clickToChat")}
				</p>
			</aside>
		);
	}

	return (
		<aside className="flex h-152 max-h-[calc(100vh-7rem)] min-h-105 flex-col overflow-hidden rounded-3xl dark:bg-slate-900 dark:ring-slate-800 bg-white shadow-sm ring-1 ring-slate-200">
			<header className="flex shrink-0 items-center justify-between gap-3 border-b dark:border-slate-800 border-slate-100 px-5 py-4">
				<div className="flex min-w-0 items-center gap-3">
					<ChatMemberAvatar member={member} />
					<div className="min-w-0">
						<h3 className="truncate text-base font-bold dark:text-slate-50 text-brand-primary">{member.name}</h3>
						<p className="truncate text-xs font-semibold uppercase tracking-wide text-accent-orange">
							{member.role}
						</p>
					</div>
				</div>
				<div className="flex shrink-0 items-center gap-2">
					{isFriend && onRemoveFriend && (
						<IconButton
							icon={<UserMinus size={16} />}
							onClick={onRemoveFriend}
							loading={isRemovingFriend}
							aria-label={t("chat.removeAria")}
							variant="danger"
						/>
					)}
					<IconButton
						icon={<X size={16} />}
						onClick={onClose}
						aria-label={t("chat.closeAria")}
						variant="outline"
					/>
				</div>
			</header>

			{!isFriend ? (
				<div className="flex flex-1 flex-col items-center justify-center gap-4 dark:bg-slate-900 bg-brand-bg px-5 py-10 text-center">
					<div className="flex h-14 w-14 items-center justify-center rounded-full dark:bg-slate-800 bg-accent-orange-bg text-accent-orange">
						<Users size={24} />
					</div>
					<div>
						<p className="text-sm font-semibold dark:bg-slate-900 dark:text-slate-50 text-brand-primary">
							{t("chat.notFriend", { name: member.name })}
						</p>
						<p className="mt-1 max-w-xs text-xs leading-5 dark:text-slate-500 text-brand-muted">
							{t("chat.notFriendDescription")}
						</p>
					</div>
					{onAddFriend && (
						<button
							type="button"
							onClick={onAddFriend}
							className="flex h-10 items-center gap-2 rounded-2xl bg-brand-primary px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-900"
						>
							<Users size={15} />
							{t("chat.addFriend")}
						</button>
					)}
				</div>
			) : (
				<>
					<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto dark:bg-slate-900 bg-brand-bg px-5 py-5">
						{isLoadingMessages ? (
							<div className="flex flex-1 items-center justify-center gap-2 text-sm font-medium dark:text-slate-500 text-brand-muted">
								<Loader2 size={16} className="animate-spin" />
								<span>{t("chat.loadingMessages")}</span>
							</div>
						) : messagesError ? (
							<div className="flex flex-1 items-center justify-center text-center">
								<p className="max-w-xs rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
									{messagesError}
								</p>
							</div>
						) : messages.length ? (
							messages.map((message) => (
								<div
									key={message.id}
									className={`flex min-w-0 max-w-full ${message.sender === "me" ? "justify-end" : "justify-start"}`}
								>
									<div
										className={`min-w-0 max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-6 shadow-sm ${message.sender === "me"
											? "rounded-br-md bg-brand-primary dark:bg-slate-400 dark:text-slate-900 text-white"
											: "rounded-bl-md bg-white dark:bg-slate-800 dark:text-slate-50 text-brand-foreground ring-1 dark:ring-slate-800 ring-slate-200"
											}`}
									>
										<p
											className="max-w-full whitespace-pre-wrap"
											style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
										>
											{message.text}
										</p>
										<p
											className={`mt-1 text-[10px] font-semibold ${message.sender === "me" ? "dark:text-slate-600 text-white/65" : "  text-slate-400"
												}`}
										>
											{formatChatTime(message.createdAt)}
										</p>
									</div>
								</div>
							))
						) : (
							<div className="flex flex-1 items-center justify-center text-center">
								<p className="max-w-xs text-sm leading-6 text-brand-muted">
									{t("chat.conversationReady", { name: member.name })}
								</p>
							</div>
						)}
					</div>

					<form
						className="flex shrink-0 items-end gap-2 border-t dark:bg-slate-900 dark:border-slate-800 border-slate-100 bg-white p-4"
						onSubmit={(event) => {
							event.preventDefault();
							onSendMessage();
						}}
					>
						<textarea
							ref={textareaRef}
							value={draft}
							onChange={(event) => onDraftChange(event.target.value)}
							placeholder={t("chat.messagePlaceholder", { name: member.name.split(" ")[0] })}
							rows={1}
							disabled={isSendingMessage}
							className="max-h-28 min-h-11 flex-1 resize-none overflow-y-auto rounded-2xl border dark:bg-slate-800 dark:border-slate-800 dark:text-slate-50 border-slate-200 bg-slate-50 px-4 py-3 text-sm text-brand-foreground outline-none transition-colors placeholder:text-slate-400 focus:border-brand-primary focus:bg-white"
							style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
						/>
						<IconButton
							icon={<Send size={17} />}
							loading={isSendingMessage}
							type="submit"
							disabled={!draft.trim() || isSendingMessage}
							aria-label={t("chat.sendAria")}
							variant="solid"
							className="h-11 w-11 rounded-2xl"
						/>
					</form>
				</>
			)}
		</aside>
	);
}

function DashboardPageContent() {
	const { locale, t } = useMessages();
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
	const [chatMessagesError, setChatMessagesError] = useState<string | null>(null);
	const [loadingChatMemberId, setLoadingChatMemberId] = useState<string | null>(null);
	const [sendingChatMemberId, setSendingChatMemberId] = useState<string | null>(null);
	const [friends, setFriends] = useState<Member[]>([]);
	const [friendIds, setFriendIds] = useState<Set<string | number>>(new Set());
	const [addingFriendIds, setAddingFriendIds] = useState<Set<string | number>>(new Set());
	const [removingFriendIds, setRemovingFriendIds] = useState<Set<string | number>>(new Set());
	const [removingMemberIds, setRemovingMemberIds] = useState<Set<string | number>>(new Set());
	const currentUser = useUserStore((state) => state.user);
	const currentUserId = currentUser?.id;

	const appendChatMessage = useCallback((memberId: string, message: ChatMessage) => {
		setChatMessagesByMember((currentMessages) => {
			const memberMessages = currentMessages[memberId] ?? [];
			const alreadyExists = memberMessages.some((item) => item.id === message.id);

			if (alreadyExists) {
				return currentMessages;
			}

			return {
				...currentMessages,
				[memberId]: [...memberMessages, message],
			};
		});
	}, []);

	const loadOrganizationEvents = useCallback(async (organizationId: string) => {
		const response = await api.get<EventsResponse>(
			`/organizations/${organizationId}/events`,
		);

		const raw = unwrapEventsResponse(response).map(normalizeApiEvent);

		setRawEvents(raw);
		return raw.map(mapApiEventToCard);
	}, []);

	useEffect(() => {
		let active = true;

		async function loadCenterData() {
			setLoading(true);
			setError(null);

			try {
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
					setError(t("errors.organizationNotFound"));
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

				// Chama a função diretamente aqui
				const [membershipsResult, eventsResult, friendsResult] = await Promise.allSettled([
					api.get<MembershipsResponse>(
						`/organizations/${nextOrganization.organizationId}/memberships`,
					),
					loadOrganizationEvents(nextOrganization.organizationId),
					api.get<FriendsResponse>(
						`/organizations/${nextOrganization.organizationId}/chat/friends`,
					),
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
							: t("errors.membersLoad"),
					);
				}

				if (friendsResult.status === "fulfilled") {
					const friendsData = friendsResult.value;
					const friendsList = (friendsData?.friends ?? []).map(mapFriendToMember);
					setFriends(friendsList);
					setFriendIds(new Set(friendsList.map((f) => f.id)));
				} else {
					console.warn("Não foi possível carregar os amigos:", friendsResult.reason);
				}

				if (eventsResult.status === "fulfilled") {
					setOrganizationEvents(eventsResult.value);
				} else {
					setEventsError(
						eventsResult.reason instanceof Error
							? eventsResult.reason.message
							: t("errors.eventsLoad"),
					);
				}

				if (!selectedOrganizationId) {
					router.replace(
						addLocaleToPathname(
							`/mainCenter?org=${nextOrganization.organizationId}`,
							locale,
						),
					);
				}
			} catch (err) {
				console.error(err);
				setError(t("errors.generic"));
			} finally {
				setLoading(false);
			}
		}

		void loadCenterData();
		return () => {
			active = false;
		};
	}, [loadOrganizationEvents, selectedOrganizationId, locale, router, setUser, t]);

	useEffect(() => {
		if (!toast) return;

		const timeoutId = window.setTimeout(() => {
			setToast(null);
		}, 5000);

		return () => window.clearTimeout(timeoutId);
	}, [toast]);

	useEffect(() => {
		if (!organization) return;

		let active = true;
		let socket: Socket | null = null;

		async function connectChatSocket() {
			try {
				const tokenResponse = await fetch("/api/auth-token");

				if (!tokenResponse.ok) {
					throw new Error(t("errors.tokenUnavailable"));
				}

				const { token } = (await tokenResponse.json()) as AuthTokenResponse;

				if (!active || !token) return;

				socket = io(buildSocketUrl(), {
					auth: {
						token,
						authorization: `Bearer ${token}`,
					},
					query: { token },
					transports: ["websocket", "polling"],
				});

				const joinOrganizationRoom = () => {
					socket?.emit("chat:join", {
						organizationId: organization?.organizationId,
					});
					socket?.emit("joinOrganization", {
						organizationId: organization?.organizationId,
					});
				};

				const handleRealtimeMessage = (payload: ChatRealtimePayload) => {
					const message = unwrapRealtimeMessage(payload);
					if (!message) return;

					if (
						message.organizationId &&
						message.organizationId !== organization?.organizationId
					) {
						return;
					}

					const senderId =
						message.senderId ?? message.userId ?? message.sender?.id ?? message.sender?.userId;
					const recipientId = message.recipientId ?? message.receiverId ?? message.friendId;
					const isFromCurrentUser = Boolean(
						currentUserId && senderId && String(senderId) === String(currentUserId),
					);
					const memberId = isFromCurrentUser ? recipientId : senderId;

					if (!memberId) return;

					appendChatMessage(
						String(memberId),
						mapApiMessageToChatMessage(message, currentUserId, String(memberId)),
					);

					if (!isFromCurrentUser) {
						const senderName = message.sender?.displayName || message.sender?.name || t("chat.someone");
						setToast({
							title: t("chat.newMessage", { name: senderName }),
							description: message.content ?? message.text ?? message.message ?? "",
							variant: "info",
						});
					}
				};

				socket.on("connect", joinOrganizationRoom);
				socket.on("chat:connected", joinOrganizationRoom);
				socket.on("message:new", handleRealtimeMessage);
				socket.on("chat:message", handleRealtimeMessage);
				socket.on("chat:message:new", handleRealtimeMessage);
				socket.on("newMessage", handleRealtimeMessage);
				socket.on("message", handleRealtimeMessage);

				socket.on("chat:error", (payload: { message?: string }) => {
					setToast({
						title: t("chat.errorTitle"),
						description: payload.message,
						variant: "error",
					});
				});

				socket.on("connect_error", (error) => {
					console.warn("Erro ao conectar socket do chat:", error.message);
				});
			} catch (error) {
				console.warn(
					"Não foi possível iniciar o socket do chat:",
					error instanceof Error ? error.message : error,
				);
			}
		}

		void connectChatSocket();

		return () => {
			active = false;
			socket?.disconnect();
		};
	}, [appendChatMessage, currentUserId, organization, t]);

	useEffect(() => {
		let active = true;

		async function loadChatMessages() {
			if (!organization || !selectedChatMember || !friendIds.has(selectedChatMember.id)) {
				return;
			}

			const friendId = String(selectedChatMember.id);

			setChatMessagesError(null);
			setLoadingChatMemberId(friendId);

			try {
				const response = await api.get<ChatMessagesResponse>(
					`/organizations/${organization.organizationId}/chat/messages/${friendId}?limit=50`,
				);

				if (!active) return;

				const nextMessages = unwrapChatMessagesResponse(response).map((message) =>
					mapApiMessageToChatMessage(message, currentUserId, friendId),
				);

				setChatMessagesByMember((currentMessages) => ({
					...currentMessages,
					[friendId]: nextMessages,
				}));
			} catch (error) {
				if (!active) return;

				setChatMessagesError(
					error instanceof Error
						? error.message
						: t("chat.errorLoadingMessages"),
				);
			} finally {
				if (active) {
					setLoadingChatMemberId(null);
				}
			}
		}

		void loadChatMessages();

		return () => {
			active = false;
		};
	}, [currentUserId, friendIds, organization, selectedChatMember, t]);

	const organizationAddress = organization?.address?.trim() || t("organization.center.address");
	const organizationDescription =
		organization?.description?.trim() || t("organization.center.defaultDescription");
	const organizationMemberCount =
		organization?.memberCount ?? organization?.membersCount ?? organizationMembers.length;
	const totalParticipants = organizationEvents.reduce(
		(total, event) => total + event.interestedCount,
		0,
	);
	const organizationInitial = organization?.name?.[0]?.toUpperCase() ?? "C";
	const roleLabel = organization?.role?.replaceAll("_", " ") ?? t("organization.center.roleMember");
	const backHref = addLocaleToPathname("/mainDash", locale);
	const canManageEvents = ADMIN_ROLES.has(organization?.role?.toUpperCase() ?? "");
	const centerStats = [
		{ label: t("organization.center.stats.members"), value: organizationMemberCount, icon: Users },
		{ label: t("organization.center.stats.events"), value: organizationEvents.length, icon: CalendarDays },
		{ label: t("organization.center.stats.participants"), value: totalParticipants, icon: ShieldCheck },
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

			setOrganizationEvents((events) =>
				events.map((ev) => {
					if (ev.id !== eventId) return ev;
					const nextIsFavorited = !ev.isFavorited;
					const nextInterestedCount = nextIsFavorited ? ev.interestedCount + 1 : Math.max(0, ev.interestedCount - 1);
					return { ...ev, isFavorited: nextIsFavorited, interestedCount: nextInterestedCount };
				}),
			);

			try {
				let isPartivipante = false;
				if (wasParticipating) {
					await api.delete(endpoint);
				} else {
					const participe: any = await api.get(`/organizations/${organization.organizationId}/events/${eventId}`);
					if (participe.event.interested) {
						isPartivipante = true;
					} else {
						await api.post(endpoint, {});
					}
				}

				setToast({
					title: wasParticipating
						? t("events.toast.participationRemoved")
						: isPartivipante ? t("events.toast.participationUpdateError") : t("events.toast.participationAdded"),
					variant: isPartivipante ? "error" : "success",
				});
			} catch (error) {
				// Revert optimistic change on error
				setOrganizationEvents((events) =>
					events.map((ev) => {
						if (ev.id !== eventId) return ev;
						// restore previous values
						const prevIsFavorited = wasParticipating;
						const prevInterestedCount = wasParticipating ? Math.max(0, ev.interestedCount - 1) : ev.interestedCount + 1;
						return { ...ev, isFavorited: prevIsFavorited, interestedCount: prevInterestedCount };
					}),
				);

				const message =
					error instanceof Error
						? error.message
						: t("events.toast.participationError");
				setEventsError(message);
				setToast({
					title: t("events.toast.participationUpdateError"),
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
		[interestPendingEventIds, loadOrganizationEvents, organization, organizationEvents, t],
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
						: t("events.toast.deleteError"),
				);
			}
		},
		[organization, t],
	);
	const handleUpdateEvent = useCallback(
		(eventId: EventCardProps["id"]) => {
			const raw = rawEvents.find((e) => e.id === eventId);
			if (!raw) return;

			setEditingEvent({
				id: raw.id,
				title: raw.title,
				description: raw.description,
				interestedCount: getEventInterestedCount(raw),
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
	const handleSendChatMessage = useCallback(async () => {
		if (!organization || !selectedChatMember || !chatDraft.trim()) return;

		const memberKey = String(selectedChatMember.id);
		if (sendingChatMemberId === memberKey) return;

		const content = chatDraft.trim();
		setSendingChatMemberId(memberKey);
		setChatMessagesError(null);

		try {
			const response = await api.post<SendMessageResponse>(
				`/organizations/${organization.organizationId}/chat/messages/${memberKey}`,
				{ content },
			);

			const nextMessage = response.message
				? mapApiMessageToChatMessage(response.message, currentUserId, memberKey)
				: {
					id: `${memberKey}-${Date.now()}`,
					text: content,
					sender: "me" as const,
					createdAt: new Date(),
				};

			appendChatMessage(memberKey, nextMessage);
			setChatDraft("");
		} catch (error) {
			const message =
				error instanceof Error ? error.message : t("chat.errorSendingMessage");
			setChatMessagesError(message);
			setToast({
				title: t("chat.errorSendingTitle"),
				description: message,
				variant: "error",
			});
		} finally {
			setSendingChatMemberId(null);
		}
	}, [
		appendChatMessage,
		chatDraft,
		currentUserId,
		organization,
		selectedChatMember,
		sendingChatMemberId,
		t,
	]);

	const handleAddFriend = useCallback(async (memberId: string | number) => {
		if (!organization || addingFriendIds.has(memberId)) return;

		setAddingFriendIds((prev) => new Set(prev).add(memberId));

		try {
			const result = await api.post<AddFriendResponse>(
				`/organizations/${organization.organizationId}/chat/friends/${String(memberId)}`,
				{},
			);

			// Build friend Member from the response
			const friendData = result?.friendship?.friend ?? null;
			if (friendData) {
				const newFriend: Member = {
					id: friendData.id ?? friendData.userId ?? String(memberId),
					name: friendData.displayName?.trim() || friendData.name?.trim() || friendData.email || "Membro",
					role: friendData.role ?? "Membro",
					email: friendData.email ?? undefined,
					avatarUrl: friendData.avatarUrl ?? undefined,
				};
				setFriends((prev) => [...prev, newFriend]);
				setFriendIds((prev) => new Set(prev).add(newFriend.id));
			} else {
				// Fallback: use the member from the members list
				const member = organizationMembers.find((m) => String(m.id) === String(memberId));
				if (member) {
					setFriends((prev) => [...prev, member]);
					setFriendIds((prev) => new Set(prev).add(member.id));
				}
			}

			setToast({
				title: t("chat.friendAdded"),
				variant: "success",
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : t("chat.friendAddError");
			setToast({
				title: t("chat.friendAddErrorTitle"),
				description: message,
				variant: "error",
			});
		} finally {
			setAddingFriendIds((prev) => {
				const next = new Set(prev);
				next.delete(memberId);
				return next;
			});
		}
	}, [addingFriendIds, organization, organizationMembers, t]);

	const handleRemoveFriend = useCallback(async (friendId: string | number) => {
		if (!organization || removingFriendIds.has(friendId)) return;

		setRemovingFriendIds((prev) => new Set(prev).add(friendId));

		try {
			await api.delete(
				`/organizations/${organization.organizationId}/chat/friends/${String(friendId)}`,
			);

			setFriends((prev) => prev.filter((friend) => String(friend.id) !== String(friendId)));
			setFriendIds((prev) => {
				const next = new Set(prev);
				for (const id of next) {
					if (String(id) === String(friendId)) {
						next.delete(id);
						break;
					}
				}
				return next;
			});

			setToast({
				title: t("chat.friendRemoved"),
				variant: "success",
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : t("chat.friendRemoveError");
			setToast({
				title: t("chat.friendRemoveErrorTitle"),
				description: message,
				variant: "error",
			});
		} finally {
			setRemovingFriendIds((prev) => {
				const next = new Set(prev);
				next.delete(friendId);
				return next;
			});
		}
	}, [organization, removingFriendIds, t]);

	const handleRemoveMember = useCallback(async (memberId: string | number) => {
		if (!organization || removingMemberIds.has(memberId)) return;

		const isAdmin = ADMIN_ROLES.has(organization.role?.toUpperCase() ?? "");
		const isSelf = currentUserId != null && String(memberId) === String(currentUserId);

		if (isAdmin && isSelf) {
			setToast({
				title: t("toast.actionNotAllowed"),
				description: t("toast.adminCannotRemoveSelf"),
				variant: "error",
			});
			return;
		}

		if (!isAdmin && !isSelf) {
			setToast({
				title: t("toast.noPermission"),
				description: t("toast.onlyAdminCanRemove"),
				variant: "error",
			});
			return;
		}

		setRemovingMemberIds((prev) => new Set(prev).add(memberId));

		try {
			await api.delete(
				`/organizations/${organization.organizationId}/memberships/${String(memberId)}`,
			);

			setOrganizationMembers((prev) =>
				prev.filter((member) => String(member.id) !== String(memberId)),
			);

			setFriends((prev) =>
				prev.filter((friend) => String(friend.id) !== String(memberId)),
			);

			setFriendIds((prev) => {
				const next = new Set(prev);
				for (const id of next) {
					if (String(id) === String(memberId)) {
						next.delete(id);
						break;
					}
				}
				return next;
			});

			if (selectedChatMember && String(selectedChatMember.id) === String(memberId)) {
				setSelectedChatMember(null);
				setChatDraft("");
				setChatMessagesError(null);
			}

			if (isSelf) {
				setToast({
					title: t("toast.youLeftOrganization"),
					description: t("toast.redirectingToChurches"),
					variant: "success",
				});

				setTimeout(() => {
					router.push(addLocaleToPathname("/mainDash", locale));
				}, 1200);
			} else {
				setToast({
					title: t("toast.memberRemoved"),
					variant: "success",
				});
			}
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: t("toast.memberRemoveError");
			setToast({
				title: t("toast.memberRemoveErrorTitle"),
				description: message,
				variant: "error",
			});
		} finally {
			setRemovingMemberIds((prev) => {
				const next = new Set(prev);
				next.delete(memberId);
				return next;
			});
		}
	}, [
		organization,
		removingMemberIds,
		currentUserId,
		selectedChatMember,
		router,
		locale,
		t,
	]);

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center dark:text-slate-50 dark:bg-slate-900 bg-white text-[#002045]">
				<Loader2 className="mr-2 animate-spin" size={20} />
				<span>{t("organization.center.loading")}</span>
			</div>
		);
	}

	if (error || !organization) {
		return (
			<div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center text-[#002045] dark:bg-slate-900 dark:text-slate-50">
				<Building2 size={34} className="text-[#D97706]" />
				<p className="text-lg font-semibold">{error ?? t("errors.organizationDataNotFound")}</p>
				<Link href={backHref} className="rounded-xl bg-[#002045] px-5 py-2.5 text-sm font-semibold text-white">
					{t("organization.center.backToChurches")}
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#F7F9FC] text-[#002045]  dark:bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.16),_transparent_32%),linear-gradient(to_bottom,_#0f172a,_#020617)]">
			<FeedbackToast
				open={Boolean(toast)}
				title={toast?.title ?? ""}
				description={toast?.description}
				variant={toast?.variant}
				onClose={() => setToast(null)}
			/>
			<header className="sticky top-0 z-40 border-b dark:bg-[radial-gradient(circle_at_top,_rgba(0,0,0,0.16),_transparent_32%),linear-gradient(to_bottom,_#0f172a,_#020617)] dark:border-slate-800 border-white/70 bg-[#F7F9FC]/85 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
					<Link href={backHref} className="flex items-center justify-center gap-3">
						<span className="flex h-11 w-11 items-center justify-center rounded-2xl dark:ring-slate-800 dark:bg-slate-900  bg-white shadow-sm ring-1 ring-slate-200">
							<Image src={Logo} className="block dark:hidden" alt={t("common.logoAlt")} width={34} height={34} />
							<Image src={LogoDark} className="hidden dark:block" alt={t("common.logoAlt")} width={34} height={34} style={{
								width: "34px",
								height: "34px",
							}} />
						</span>
					</Link>
					<div className="flex items-center gap-3">
						<Link
							href={backHref}
							className="flex h-10 items-center justify-center gap-2 rounded-2xl border dark:border-slate-800  border-slate-200 dark:bg-slate-900  bg-white px-4 text-sm font-semibold dark:text-slate-50  text-[#002045] shadow-sm transition-colors hover:border-[#1E3A8A]/30 hover:text-[#1E3A8A]"
						>
							<ChevronLeft size={16} />
							{t("common.back")}
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
										<span>{t("events.createEventTitle")}</span>
									</Button>
								</CreateEventDialog>
							) : null}
						</div>

						<div className="flex flex-col justify-end gap-4 min-w-0">
							<div className="w-full rounded-3xl bg-white/94 dark:bg-slate-900/100  p-5 shadow-xl shadow-slate-950/10 ring-1 dark:ring-slate-800  ring-white/70 backdrop-blur min-w-0">
								<div className="flex items-center gap-4">

									{organization.logoUrl ? (
										<Image
											src={organization.logoUrl}
											alt={t("community.logoAlt", { name: organization.name })}
											width={72}
											height={72}
											unoptimized
											className="h-18 w-18 shrink-0 rounded-2xl object-contain ring-1 dark:ring-slate-800  ring-slate-200"
										/>
									) : (
										<div className="flex shrink-0 h-18 w-18 items-center justify-center rounded-2xl  bg-[#002045] text-2xl font-bold text-white">
											{organizationInitial}
										</div>
									)}
									<div className="min-w-0 flex-1">
										<p className="text-xs font-semibold uppercase tracking-wide text-[#D97706]">
											{t("organization.center.label")}
										</p>
										<p className="mt-1 truncate text-xl font-bold dark:text-slate-50  text-[#002045]">
											{organization.name}
										</p>
									</div>
								</div>

								<div className="mt-5 grid grid-cols-3 gap-2">
									{centerStats.map((stat) => {
										const Icon = stat.icon;

										return (
											<div key={stat.label} className="rounded-2xl dark:bg-slate-900  dark:ring-slate-800  bg-[#F7F9FC] p-3 ring-1 ring-slate-200">
												<div className="flex items-center gap-1.5 text-xs font-semibold dark:text-slate-50  text-[#475F83]">
													<Icon size={14} className="text-[#1E3A8A] dark:text-slate-50 " />
													<span className="truncate">{stat.label}</span>
												</div>
												<p className="mt-2 text-2xl font-bold dark:text-slate-50  text-[#002045]">{stat.value}</p>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="flex flex-col gap-4">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<p className="text-xs font-semibold uppercase tracking-wide text-[#D97706]">
								{t("organization.center.communityAgenda")}
							</p>
							<h2 className="mt-1 text-3xl font-bold tracking-tight dark:text-slate-50  text-[#002045] sm:text-4xl">
								{t("organization.center.upcomingEvents")}
							</h2>
							<p className="mt-3 max-w-2xl text-base leading-7 dark:text-slate-500  text-[#475F83]">
								{t("organization.center.joinDescription", { name: organization.name })}
							</p>
						</div>
						<div className="flex h-11 w-fit items-center gap-2 rounded-2xl bg-white dark:bg-slate-900  dark:text-slate-50  px-4 text-sm font-semibold text-[#1E3A8A] shadow-sm ring-1 dark:ring-slate-800  ring-slate-200">
							<CalendarDays size={16} />
							{t("organization.center.eventCount", { count: organizationEvents.length })}
						</div>
					</div>

					{eventsError ? (
						<p className="rounded-2xl border dark:border-slate-800  border-red-100 dark:bg-slate-900  bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
							{eventsError}
						</p>
					) : visibleEvents.length ? (
						<EventList events={visibleEvents} initialCount={3} />
					) : (
						<div className="flex min-h-48 flex-col items-center justify-center rounded-3xl border border-dashed dark:border-slate-800  border-slate-300 bg-white dark:bg-slate-900  dark:text-slate-50 px-6 py-12 text-center shadow-sm">
							<CalendarDays size={32} className="text-[#1E3A8A]/50 dark:text-slate-50/50" />
							<p className="mt-4 text-lg font-semibold text-[#475F83] dark:text-slate-50">
								{t("organization.center.noEvents")}
							</p>
						</div>
					)}
				</section>

				<section className="grid gap-5 pb-10 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.78fr)]">
					<div>
						<CommunityMembers
							title={t("organization.center.membersTitle", { name: organization.name })}
							subtitle={
								membersError
									? t("organization.center.membersError", { error: membersError })
									: t("organization.center.membersSubtitle", { role: roleLabel })
							}
							members={organizationMembers}
							friends={friends}
							friendIds={friendIds}
							maxVisible={12}
							onMemberClick={handleMemberChatOpen}
							onAddFriend={handleAddFriend}
							onRemoveFriend={handleRemoveFriend}
							onRemoveMember={handleRemoveMember}
							canRemoveMember={(member) => {
								const isAdmin = ADMIN_ROLES.has(organization.role?.toUpperCase() ?? "");
								const isSelf = currentUserId != null && String(member.id) === String(currentUserId);
								if (isAdmin && isSelf) return false;
								return isAdmin || isSelf;
							}}
							addingFriendIds={addingFriendIds}
							removingFriendIds={removingFriendIds}
							removingMemberIds={removingMemberIds}
							currentUserId={currentUserId}
							organizationName={organization.name}
							isCurrentUserAdmin={ADMIN_ROLES.has(organization.role?.toUpperCase() ?? "")}
						/>
					</div>
					<MemberChatPanel
						member={selectedChatMember}
						messages={selectedChatMessages}
						draft={chatDraft}
						onDraftChange={setChatDraft}
						onSendMessage={handleSendChatMessage}
						isFriend={selectedChatMember ? friendIds.has(selectedChatMember.id) : false}
						onAddFriend={selectedChatMember ? () => handleAddFriend(selectedChatMember.id) : undefined}
						onRemoveFriend={selectedChatMember ? () => handleRemoveFriend(selectedChatMember.id) : undefined}
						isRemovingFriend={
							selectedChatMember ? removingFriendIds.has(selectedChatMember.id) : false
						}
						isLoadingMessages={
							selectedChatMember
								? loadingChatMemberId === String(selectedChatMember.id)
								: false
						}
						isSendingMessage={
							selectedChatMember
								? sendingChatMemberId === String(selectedChatMember.id)
								: false
						}
						messagesError={chatMessagesError}
						onClose={() => {
							setSelectedChatMember(null);
							setChatDraft("");
							setChatMessagesError(null);
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

function DashboardFallback() {
	const { t } = useMessages();
	return (
		<div className="flex min-h-screen items-center justify-center bg-[#F7F9FC] text-[#002045]">
			<Loader2 className="mr-2 animate-spin" size={20} />
			<span>{t("organization.center.loadingPage")}</span>
		</div>
	);
}

export default function DashboardPage() {
	return (
		<Suspense fallback={<DashboardFallback />}>
			<DashboardPageContent />
		</Suspense>
	);
}
