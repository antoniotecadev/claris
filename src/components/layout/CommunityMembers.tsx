"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, UserPlus, Users, ChevronRight } from "lucide-react";

/* ── Types ─────────────────────────────────────────────── */
export type Member = {
  id: string | number;
  name: string;
  role: string;
  avatarUrl?: string;       // if absent → initials avatar
  avatarColor?: string;     // bg color for initials (e.g. "#3b5998")
};

export type CommunityMembersProps = {
  title?: string;
  subtitle?: string;
  members: Member[];
  onViewAll?: () => void;
  onInvite?: () => void;
  onMemberClick?: (member: Member) => void;
  maxVisible?: number;      // how many avatars to show before search
};

/* ── Helpers ────────────────────────────────────────────── */
function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const PRESET_COLORS = [
  "#2d4a7a", "#4a7c6f", "#7a4a2d", "#6b4a7a",
  "#7a6b2d", "#2d7a6b", "#7a2d4a", "#4a6b7a",
];

function colorFromName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PRESET_COLORS[Math.abs(hash) % PRESET_COLORS.length];
}

/* ── Avatar ─────────────────────────────────────────────── */
function Avatar({ member, size = "md" }: { member: Member; size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "w-8 h-8 text-[10px]" : size === "lg" ? "w-14 h-14 text-base" : "w-12 h-12 text-[13px]";
  const bg = member.avatarColor ?? colorFromName(member.name);

  if (member.avatarUrl) {
    return (
      <img
        src={member.avatarUrl}
        alt={member.name}
        className={`${dim} rounded-full object-cover ring-2 ring-white`}
      />
    );
  }

  return (
    <div
      className={`${dim} rounded-full ring-2 ring-white flex items-center justify-center font-semibold text-white tracking-wide`}
      style={{ backgroundColor: bg }}
    >
      {getInitials(member.name)}
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────── */
export default function CommunityMembers({
  title = "Corações em Comunhão",
  subtitle = "Pessoas que caminham ao seu lado nesta jornada espiritual.",
  members,
  onViewAll,
  onInvite,
  onMemberClick,
  maxVisible = 5,
}: CommunityMembersProps) {
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const filtered = useMemo(() => {
    if (!query.trim()) return members;
    const q = query.toLowerCase();
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q)
    );
  }, [members, query]);

  const visibleMembers = searchOpen ? filtered : members.slice(0, maxVisible);
  const isSearching = searchOpen;

  return (
    <section className="bg-black rounded-2xl px-7 py-6 w-300 mt-6 ">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex-1 min-w-0">
          <h2 className="text-[18px] font-semibold text-[#1a2a3a] leading-tight mb-1">
            {title}
          </h2>
          <p className="text-[13px] text-stone-500 leading-snug">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
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
                : "bg-white border-stone-200 text-stone-500 hover:border-[#002045] hover:text-[#002045]"
              }`}
          >
            {searchOpen ? <X size={15} /> : <Search size={15} />}
          </button>

          {/* View all */}
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="h-9 px-4 rounded-full bg-white border border-stone-200 text-[13px] font-medium text-[#1a2a3a] flex items-center gap-1.5 hover:border-[#002045] hover:text-[#002045] transition-all duration-200"
            >
              Ver Todos os Membros
              <ChevronRight size={14} />
            </button>
          )}
        </div>
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
            placeholder="Pesquisar por nome ou função..."
            className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-stone-200 text-[13px] text-stone-700 placeholder:text-stone-400 outline-none focus:border-[#002045] transition-colors duration-200"
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

      {/* ── Members row ── */}
      <div className="flex items-start gap-5 flex-wrap">

        {/* Member cards */}
        {visibleMembers.length > 0 ? (
          visibleMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => onMemberClick?.(member)}
              className="flex flex-col items-center gap-1.5 group focus:outline-none"
            >
              <div className="relative">
                <Avatar member={member} size="md" />
                {/* hover ring */}
                <div className="absolute inset-0 rounded-full ring-2 ring-transparent group-hover:ring-[#002045]/30 transition-all duration-200" />
              </div>
              <div className="text-center">
                <p className="text-[12px] font-medium text-[#1a2a3a] leading-tight group-hover:text-[#002045] transition-colors duration-150 max-w-[72px] truncate">
                  {member.name.split(" ")[0]}
                </p>
                <p className="text-[9px] font-semibold tracking-widest text-stone-400 uppercase mt-0.5 max-w-[72px] truncate">
                  {member.role}
                </p>
              </div>
            </button>
          ))
        ) : (
          <div className="flex items-center gap-2 text-[13px] text-stone-400 py-2">
            <Users size={15} />
            <span>Nenhum membro encontrado.</span>
          </div>
        )}

        {/* Overflow badge — show when not searching */}
        

       
      </div>
    </section>
  );
}
