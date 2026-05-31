"use client";

import { useState } from "react";
import { Pencil, Trash2, Heart, MapPin, Users } from "lucide-react";

export type EventCardProps = {
  id: string | number;
  date: string;           // e.g. "15 OUT"
  time: string;           // e.g. "09:00"
  title: string;
  description: string;
  location: string;
  spotsRemaining: number;
  imageUrl: string;
  isFavorited?: boolean;
  onEdit?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onParticipate?: (id: string | number) => void;
  onFavorite?: (id: string | number) => void;
};

export default function EventCard({
  id,
  date,
  time,
  title,
  description,
  location,
  spotsRemaining,
  imageUrl,
  isFavorited = false,
  onEdit,
  onDelete,
  onParticipate,
  onFavorite,
}: EventCardProps) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleFavorite = () => {
    setFavorited((prev) => !prev);
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
    <article className="group relative w-full max-w-[340px] rounded-[18px] overflow-hidden bg-[#faf9f7] shadow-[0_2px_16px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(0,0,0,0.13),0_2px_8px_rgba(0,0,0,0.06)]">

      {/* ── Image ── */}
      <div className="relative w-full aspect-video overflow-hidden bg-stone-200">
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
        <button
          onClick={handleFavorite}
          aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/85 backdrop-blur-sm shadow-sm transition-transform duration-200 hover:scale-110"
        >
          <Heart
            size={15}
            className="transition-all duration-200"
            fill={favorited ? "#e63946" : "none"}
            stroke={favorited ? "#e63946" : "#bbb"}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="px-[18px] pt-4 pb-[18px]">

        {/* Date & time */}
        <p className="text-[11px] font-medium tracking-widest text-stone-400 uppercase mb-1.5">
          {date} &bull; {time}
        </p>

        {/* Title */}
        <h2 className="font-serif text-[19px] leading-snug text-stone-900 mb-2">
          {title}
        </h2>

        {/* Description */}
        <p className="text-[13px] leading-relaxed text-stone-500 mb-3">
          {description}
        </p>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-[12px] text-stone-400 mb-3.5">
          <MapPin size={12} className="shrink-0 text-stone-400" />
          <span>{location}</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-stone-200 mb-3.5" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11.5px] text-stone-400">
            <Users size={12} className="shrink-0" />
            <span>{spotsRemaining} vagas restantes</span>
          </div>

          {onParticipate && (
            <button
              onClick={() => onParticipate(id)}
              className="text-[12px] font-semibold tracking-widest uppercase text-blue-600 transition-all duration-200 hover:text-blue-800 hover:tracking-[0.1em]"
            >
              Participar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}