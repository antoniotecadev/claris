"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, UserPlus, Users, ChevronRight, Heart, Loader2, UserCheck, UserMinus } from "lucide-react";
import { LeaveOrganizationDialog } from "./leaveOrganizationDialog";
import { normalizeMediaUrl } from "@/lib/media-url";

/* ── Types ─────────────────────────────────────────────── */
export type Member = {
  id: string | number;
  name: string;
  role: string;
  email?: string;
  avatarUrl?: string;       // if absent → initials avatar
  avatarColor?: string;     // bg color for initials (e.g. "#3b5998")
};

export type CommunityMembersProps = {
  title?: string;
  subtitle?: string;
  members: Member[];
  friends?: Member[];
  friendIds?: Set<string | number>;
  onViewAll?: () => void;
  onInvite?: () => void;
  onMemberClick?: (member: Member) => void;
  onAddFriend?: (memberId: string | number) => void;
  onRemoveFriend?: (memberId: string | number) => void;
  onRemoveMember?: (memberId: string | number) => void;
  canRemoveMember?: (member: Member) => boolean;
  addingFriendIds?: Set<string | number>;
  removingFriendIds?: Set<string | number>;
  removingMemberIds?: Set<string | number>;
  maxVisible?: number;      // how many avatars to show before search
  currentUserId?: string;
  organizationName?: string;
  isCurrentUserAdmin?: boolean;
};

type Tab = "members" | "friends";

/* ── Avatar ─────────────────────────────────────────────── */
function Avatar({ member, size = "md" }: { member: Member; size?: "sm" | "md" | "lg" }) {
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);
  const dim = size === "sm" ? "w-8 h-8 text-[10px]" : size === "lg" ? "w-14 h-14 text-base" : "w-12 h-12 text-[13px]";
  const avatarUrl = normalizeMediaUrl(member.avatarUrl);

  if (avatarUrl && avatarUrl !== failedAvatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={member.name}
        onError={() => setFailedAvatarUrl(avatarUrl)}
        className={`${dim} rounded-full object-cover ring-2 ring-white`}
      />
    );
  }

  return (
    <img
      src="/avatar-placeholder.svg"
      alt={member.name}
      className={`${dim} rounded-full object-cover ring-2 ring-white`}
    />
  );
}

/* ── Main Component ─────────────────────────────────────── */
export default function CommunityMembers({
  title = "Corações em Comunhão",
  subtitle = "Pessoas que caminham ao seu lado nesta jornada espiritual.",
  members,
  friends = [],
  friendIds = new Set(),
  onViewAll,
  onInvite,
  onMemberClick,
  onAddFriend,
  onRemoveFriend,
  onRemoveMember,
  canRemoveMember,
  addingFriendIds = new Set(),
  removingFriendIds = new Set(),
  removingMemberIds = new Set(),
  maxVisible = 12,
  currentUserId,
  organizationName,
  isCurrentUserAdmin,
}: CommunityMembersProps) {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("members");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const sourceList = activeTab === "friends" ? friends : members;

  const filtered = useMemo(() => {
    if (!query.trim()) return sourceList;
    const q = query.toLowerCase();
    return sourceList.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q)
    );
  }, [sourceList, query]);

  const visibleMembers = searchOpen ? filtered : filtered.slice(0, maxVisible);

  const tabs: { key: Tab; label: string; count: number; icon: React.ReactNode }[] = [
    { key: "members", label: "Membros", count: members.length, icon: <Users size={14} /> },
    { key: "friends", label: "Amigos", count: friends.length, icon: <Heart size={14} /> },
  ];

  return (
    <section className="mt-2 w-full rounded-3xl bg-white px-5 py-6 shadow-sm ring-1 ring-slate-200 sm:px-7">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex-1 min-w-0">
          <h2 className="mb-1 text-[20px] font-bold leading-tight text-[#002045]">
            {title}
          </h2>
          <p className="text-[13px] leading-snug text-[#475F83]">{subtitle}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* Search toggle */}
          <button
            onClick={() => {
              setSearchOpen((v) => !v);
              if (searchOpen) setQuery("");
            }}
            aria-label="Pesquisar membros"
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-200
              ${searchOpen
                ? "bg-[#002045] border-[#002045] text-white"
              : "bg-white border-slate-200 text-slate-500 hover:border-[#002045] hover:text-[#002045]"
              }`}
          >
            {searchOpen ? <X size={15} /> : <Search size={15} />}
          </button>

          {/* View all */}
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="hidden h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 text-[13px] font-medium text-[#1a2a3a] transition-all duration-200 hover:border-[#002045] hover:text-[#002045] sm:flex"
            >
              Ver Todos os Membros
              <ChevronRight size={14} />
            </button>
          )}

          {onInvite && (
            <button
              onClick={onInvite}
              aria-label="Convidar membro"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:border-[#002045] hover:text-[#002045]"
            >
              <UserPlus size={15} />
            </button>
          )}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="mb-5 flex gap-1.5 rounded-2xl bg-[#F7F9FC] p-1 ring-1 ring-slate-200">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setQuery("");
                setSearchOpen(false);
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all duration-200
                ${isActive
                  ? "bg-white text-[#002045] shadow-sm ring-1 ring-slate-200"
                  : "text-[#475F83] hover:text-[#002045]"
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold
                  ${isActive
                    ? "bg-[#002045] text-white"
                    : "bg-slate-200 text-[#475F83]"
                  }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Search bar ── */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          searchOpen ? "max-h-16 mb-4 opacity-100" : "max-h-0 mb-0 opacity-0"
        }`}
      >
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={activeTab === "friends" ? "Pesquisar amigos..." : "Pesquisar por nome ou função..."}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 text-[13px] text-stone-700 outline-none transition-colors duration-200 placeholder:text-stone-400 focus:border-[#002045]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* ── Members / Friends grid ── */}
      <div className="flex items-start gap-5 flex-wrap">
        {visibleMembers.length > 0 ? (
          visibleMembers.map((member) => {
            const isSelf = currentUserId != null && String(member.id) === String(currentUserId);
            const isFriend = friendIds.has(member.id);
            const isAdding = addingFriendIds.has(member.id);
            const isRemoving = removingFriendIds.has(member.id);
            const isRemovingMember = removingMemberIds.has(member.id);
            const showAddButton = activeTab === "members" && onAddFriend && !isSelf && !isFriend;
            const showRemoveButton = activeTab === "friends" && onRemoveFriend && !isSelf;
            const showRemoveMemberButton =
              activeTab === "members" &&
              onRemoveMember &&
              (canRemoveMember ? canRemoveMember(member) : false);

            return (
              <div key={member.id} className="flex flex-col items-center gap-1.5 group">
                <button
                  onClick={() => onMemberClick?.(member)}
                  className="flex flex-col items-center gap-1.5 focus:outline-none"
                >
                  <div className="relative">
                    <Avatar member={member} size="md" />
                    {/* hover ring */}
                    <div className="absolute inset-0 rounded-full ring-2 ring-transparent group-hover:ring-[#002045]/30 transition-all duration-200" />
                    {/* friend badge */}
                    {isFriend && activeTab === "members" && (
                      <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                        <UserCheck size={10} />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-[12px] font-medium text-[#1a2a3a] leading-tight group-hover:text-[#002045] transition-colors duration-150 max-w-18 truncate">
                      {member.name.split(" ")[0]}
                    </p>
                    <p className="text-[9px] font-semibold tracking-widest text-stone-400 uppercase mt-0.5 max-w-18 truncate">
                      {member.role}
                    </p>
                  </div>
                </button>

                {/* Add friend button */}
                {showAddButton && (
                  <button
                    onClick={() => onAddFriend(member.id)}
                    disabled={isAdding}
                    className="flex h-7 items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 text-[10px] font-semibold text-[#1E3A8A] shadow-sm transition-all duration-200 hover:border-[#1E3A8A] hover:bg-[#E8EEF8] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isAdding ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <UserPlus size={10} />
                    )}
                    <span>{isAdding ? "..." : "Amigo"}</span>
                  </button>
                )}

                {showRemoveButton && (
                  <button
                    onClick={() => onRemoveFriend(member.id)}
                    disabled={isRemoving}
                    className="flex h-7 items-center gap-1 rounded-full border border-red-100 bg-white px-2.5 text-[10px] font-semibold text-red-600 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isRemoving ? (
                      <Loader2 size={10} className="animate-spin" />
                    ) : (
                      <UserMinus size={10} />
                    )}
                    <span>{isRemoving ? "..." : "Remover"}</span>
                  </button>
                )}

                {showRemoveMemberButton && onRemoveMember && (
                  <LeaveOrganizationDialog
                    organizationName={organizationName ?? title}
                    isAdmin={Boolean(isCurrentUserAdmin)}
                    onConfirm={async () => {
                      await onRemoveMember(member.id);
                    }}
                  >
                    <button
                      type="button"
                      disabled={isRemovingMember}
                      className="flex h-7 items-center gap-1 rounded-full border border-red-100 bg-white px-2.5 text-[10px] font-semibold text-red-600 shadow-sm transition-all duration-200 hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isRemovingMember ? (
                        <Loader2 size={10} className="animate-spin" />
                      ) : (
                        <UserMinus size={10} />
                      )}
                      <span>{isRemovingMember ? "..." : "Remover"}</span>
                    </button>
                  </LeaveOrganizationDialog>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex w-full flex-col items-center gap-3 py-8 text-center">
            {activeTab === "friends" ? (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF7ED] text-[#D97706]">
                  <Heart size={24} />
                </div>
                <p className="text-sm font-semibold text-[#475F83]">
                  Ainda não tens amigos nesta organização.
                </p>
                <p className="max-w-xs text-xs text-[#475F83]/70">
                  Vai ao separador &quot;Membros&quot; e clica em &quot;Amigo&quot; para adicionar pessoas.
                </p>
              </>
            ) : (
              <div className="flex items-center gap-2 text-[13px] text-stone-400 py-2">
                <Users size={15} />
                <span>Nenhum membro encontrado.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
