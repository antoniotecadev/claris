"use client";

import { useState } from "react";
import { Loader2, Pencil, Trash2, Heart, MapPin, Users } from "lucide-react";

export type EventCardProps = {
  id: string | number;
  date: string;           // e.g. "15 OUT"
  time: string;           // e.g. "09:00"
  title: string;
  description: string;
  location: string;
  interestedCount: number;
  imageUrl: string;
  isFavorited?: boolean;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onParticipate?: (id: string | number) => void;
  onFavorite?: (id: string | number) => void;
  isParticipationPending?: boolean;
};

export default function EventCard({
  id,
  date,
  time,
  title,
  description,
  location,
  interestedCount,
  imageUrl,
  isFavorited = false,
  onEdit,
  onDelete,
  onParticipate,
  onFavorite,
  isParticipationPending = false,
}: EventCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleFavorite = () => {
    onFavorite?.(id);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete?.(id);
      setConfirmDelete(false);
    } else {
      setConfirmDelete(true);
    }
  };
  return (
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">

      {/* ── Image ── */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-200">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />

        {/* Edit / Delete overlay — top left */}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5 z-10">
          {onEdit && (
            <button
              onClick={() => onEdit(id)}
              aria-label="Editar evento"
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/85 backdrop-blur-sm text-stone-700 shadow-sm transition-all duration-150 hover:bg-white hover:scale-[0.97]"
            >
              <Pencil size={11} />
              Editar
            </button>
          )}

          {onDelete && (
            <button
              onClick={handleDelete}
              onBlur={() => setConfirmDelete(false)}
              aria-label="Eliminar evento"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium backdrop-blur-sm shadow-sm transition-all duration-150 hover:scale-[0.97]
                ${confirmDelete
                  ? "bg-red-700/95 text-white animate-pulse"
                  : "bg-red-500/85 text-white hover:bg-red-600/90"
                }`}
            >
              <Trash2 size={11} />
              {confirmDelete ? "Confirmar?" : "Eliminar"}
            </button>
          )}
        </div>

        {/* Favorite — top right */}
        {onFavorite && (
          <button
            onClick={handleFavorite}
            disabled={isParticipationPending}
            aria-label={isFavorited ? "Deixar de participar no evento" : "Participar no evento"}
            className="absolute top-2.5 right-2.5 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/85 backdrop-blur-sm shadow-sm transition-transform duration-200 hover:scale-110 disabled:cursor-wait"
          >
            <Heart
              size={15}
              className="transition-all duration-200"
              fill={isFavorited ? "#e63946" : "none"}
              stroke={isFavorited ? "#e63946" : "#bbb"}
              strokeWidth={2}
            />
          </button>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col px-[18px] pt-4 pb-[18px]">

        {/* Date & time */}
        <p className="text-[11px] font-medium tracking-widest text-stone-400 uppercase mb-1.5">
          {date} &bull; {time}
        </p>

        {/* Title */}
        <h2 className="font-serif text-[19px] leading-snug text-stone-900 mb-2">
          {title}
        </h2>

        {/* Description */}
        <p className="mb-3 line-clamp-3 text-[13px] leading-relaxed text-stone-500">
          {description}
        </p>

        {/* Location */}
        <div className="mb-3.5 mt-auto flex items-center gap-1.5 text-[12px] text-stone-400">
          <MapPin size={12} className="shrink-0 text-stone-400" />
          <span>{location}</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-stone-200 mb-3.5" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11.5px] text-stone-400">
            <Users size={12} className="shrink-0" />
            <span>{interestedCount} participantes</span>
          </div>

          {onParticipate && (
            <button
              onClick={() => onParticipate(id)}
              disabled={isParticipationPending}
              className="flex min-w-20 items-center justify-center gap-1.5 text-[12px] font-semibold tracking-widest uppercase text-blue-600 transition-all duration-200 hover:text-blue-800 hover:tracking-[0.1em] disabled:cursor-wait disabled:text-stone-400"
            >
              {isParticipationPending ? <Loader2 size={12} className="animate-spin" /> : null}
              {isParticipationPending ? "A guardar" : isFavorited ? "Deixar" : "Participar"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
