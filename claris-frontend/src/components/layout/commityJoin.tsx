"use client";

import { ArrowRight, MapPin, Calendar, Users } from "lucide-react";
import { getDateLocale } from "@/i18n/routing";
import { useMessages } from "@/i18n/messages";

interface ChurchInfo {
  id: string;
  name: string;
}

interface CommunityCardProps {
  name: string;
  slug?: string;
  address?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  createdAt?: string | Date | null;
  church?: ChurchInfo | null;
  membersCount?: number;
  onClick: () => void;
  className?: string;
}

export default function CommunityJoin({
  name,
  slug,
  address,
  description,
  logoUrl,
  createdAt,
  church,
  membersCount = 0,
  onClick,
  className = "",
}: CommunityCardProps) {
  const { locale, t } = useMessages();

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(getDateLocale(locale), {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article
      className={`group w-full max-w-115 h-full flex flex-col dark:bg-slate-900 bg-white rounded-2xl border dark:border-slate-800 border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer ${className}`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Logo / Thumbnail */}
        <div className="sm:w-36 w-full h-36 sm:h-auto shrink-0 dark:bg-slate-900 bg-gray-50 flex items-center justify-center border-b sm:border-b-0 sm:border-r dark:border-slate-800 border-gray-100">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={t("community.logoAlt", { name })}
              loading="eager"
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-brand-primary/5 rounded-xl flex flex-col items-center justify-center gap-1">
              <Users size={24} className="text-brand-primary/30" />
              <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">
                {t("community.communityLabel")}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between gap-4 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-brand-primary dark:text-slate-50 text-base font-semibold leading-snug line-clamp-2 wrap-break-word">
                {name}
              </h3>
              {church?.name && (
                <p className="mt-0.5 text-xs text-gray-400 font-medium truncate wrap-break-word">
                  {church.name}
                </p>
              )}
            </div>
            {formattedDate && (
              <div className="shrink-0 flex items-center gap-1 text-[11px] dark:bg-slate-900 text-gray-400 bg-gray-50 px-2 py-1 rounded-full border dark:border-slate-800 border-gray-100">
                <Calendar size={11} />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 wrap-break-word">
              {description}
			</p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
            {address && (
              <span className="flex items-center gap-1.5">
                <MapPin size={12} className="shrink-0" />
                <span className="truncate max-w-40">{address}</span>
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Users size={12} className="shrink-0" />
              <span>
                {membersCount + " "}
                {membersCount === 1 ? t("community.member") : t("community.members.tabMembers")}
              </span>
            </span>
          </div>

          {/* CTA */}
          <div>
            <button
              type="button"
              onClick={onClick}
              aria-label={`${t("community.requestJoin")} ${name}`}
              className="inline-flex items-center gap-2 text-xs font-semibold dark:text-slate-50 text-brand-primary dark:bg-slate-800 bg-brand-primary/5 dark:hover:bg-slate-950/65 hover:bg-brand-primary/10 px-4 py-2 rounded-full transition-colors duration-150"
            >
              {t("community.requestJoin")}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform duration-150"
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}