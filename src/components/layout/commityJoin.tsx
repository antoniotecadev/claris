import { ArrowRight, MapPin, Calendar, Users } from "lucide-react";

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
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article
      className={`group w-full max-w-115 h-full flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden cursor-pointer ${className}`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Logo / Thumbnail */}
        <div className="sm:w-36 w-full h-36 sm:h-auto shrink-0 bg-gray-50 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-100">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`Logotipo de ${name}`}
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#002045]/5 rounded-xl flex flex-col items-center justify-center gap-1">
              <Users size={24} className="text-[#002045]/30" />
              <span className="text-[10px] text-gray-400 font-medium tracking-wide uppercase">
                Comunidade
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between gap-4 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-[#002045] text-base font-semibold leading-snug truncate">
                {name}
              </h3>
              {church?.name && (
                <p className="mt-0.5 text-xs text-gray-400 font-medium truncate">
                  {church.name}
                </p>
              )}
            </div>
            {formattedDate && (
              <div className="shrink-0 flex items-center gap-1 text-[11px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                <Calendar size={11} />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-gray-500 leading-relaxed truncate">
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
                {membersCount + ' '}
                {membersCount === 1 ? "membro" : "membros"}
              </span>
            </span>
          </div>

          {/* CTA */}
          <div>
            <button
              onClick={onClick}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#002045] bg-[#002045]/5 hover:bg-[#002045]/10 px-4 py-2 rounded-full transition-colors duration-150"
            >
              Pedir para participar
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