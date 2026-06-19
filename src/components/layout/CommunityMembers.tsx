"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, UserPlus, Users, ChevronRight, Heart, Loader2, UserCheck, UserMinus } from "lucide-react";
import { LeaveOrganizationDialog } from "./leaveOrganizationDialog";
import { normalizeMediaUrl } from "@/lib/media-url";
import { useMessages } from "@/i18n/messages";

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

import { Avatar } from "@/components/ui/avatar";
import { BadgeButton } from "@/components/ui/badge-button";
import { IconButton } from "@/components/ui/icon-button";
import { SearchInput } from "@/components/ui/search-input";
import { TabsPill } from "@/components/ui/tabs-pill";

/* ── Main Component ─────────────────────────────────────── */
export default function CommunityMembers({
  title = "Corações em Comunhão",
  subtitle = "Pessoas que caminham ao seu lado nesta jornada espiritual.",
  members,
  friends = [],
  friendIds = new Set(),
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
  const { t } = useMessages();
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

      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex-1 min-w-0">
          <h2 className="mb-1 text-[20px] font-bold leading-tight text-brand-primary">
            {title}
          </h2>
          <p className="text-[13px] leading-snug text-brand-muted">{subtitle}</p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <IconButton
            icon={searchOpen ? <X size={15} /> : <Search size={15} />}
            isActive={searchOpen}
            onClick={() => {
              setSearchOpen((v) => !v);
              if (searchOpen) setQuery("");
            }}
            aria-label="Pesquisar membros"
          />
        </div>
      </div>

      <div className="mb-5">
        <TabsPill
          tabs={tabs}
          activeTab={activeTab}
          onChange={(key) => {
            setActiveTab(key);
            setQuery("");
            setSearchOpen(false);
          }}
        />
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${searchOpen ? "max-h-16 mb-4 opacity-100" : "max-h-0 mb-0 opacity-0"
          }`}
      >
        <SearchInput
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery("")}
          placeholder={activeTab === "friends" ? "Pesquisar amigos..." : "Pesquisar por nome ou função..."}
        />
      </div>

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
                    <Avatar name={member.name} url={member.avatarUrl} size="lg" />
                    
                    <div className="absolute inset-0 rounded-full ring-2 ring-transparent group-hover:ring-brand-primary/30 transition-all duration-200" />
                    {/* friend badge */}
                    {isFriend && activeTab === "members" && (
                      <div className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white">
                        <UserCheck size={10} />
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-[12px] font-medium text-brand-foreground leading-tight group-hover:text-brand-primary transition-colors duration-150 max-w-18 truncate">
                      {member.name.split(" ")[0]}
                    </p>
                    <p className="text-[9px] font-semibold tracking-widest text-stone-400 uppercase mt-0.5 max-w-18 truncate">
                      {member.role}
                    </p>
                  </div>
                </button>

                {showAddButton && (
                  <BadgeButton
                    icon={<UserPlus size={10} />}
                    loading={isAdding}
                    loadingText="..."
                    onClick={() => onAddFriend(member.id)}
                  >
                    Amigo
                  </BadgeButton>
                )}

                {showRemoveButton && (
                  <BadgeButton
                    icon={<UserMinus size={10} />}
                    loading={isRemoving}
                    loadingText="..."
                    variant="danger"
                    onClick={() => onRemoveFriend(member.id)}
                  >
                    Remover
                  </BadgeButton>
                )}

                {showRemoveMemberButton && onRemoveMember && (
                  <LeaveOrganizationDialog
                    organizationName={organizationName ?? title}
                    isAdmin={Boolean(isCurrentUserAdmin)}
                    onConfirm={async () => {
                      await onRemoveMember(member.id);
                    }}
                  >
                    <BadgeButton
                      icon={<UserMinus size={10} />}
                      loading={isRemovingMember}
                      loadingText="..."
                      variant="danger"
                      type="button"
                    >
                      Remover
                    </BadgeButton>
                  </LeaveOrganizationDialog>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex w-full flex-col items-center gap-3 py-8 text-center">
            {activeTab === "friends" ? (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-orange-bg text-accent-orange">
                  <Heart size={24} />
                </div>
                <p className="text-sm font-semibold text-brand-muted">
                  {t("community.members.noFriends")}
                </p>
                <p className="max-w-xs text-xs text-brand-muted/70">
                  {t("community.members.noFriendsHelp")}
                </p>
              </>
            ) : (
              <div className="flex items-center gap-2 text-[13px] text-stone-400 py-2">
                <Users size={15} />
                <span>{t("community.members.noMembersFound")}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
