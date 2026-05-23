import Image from "next/image";
import { CalendarDays, Pencil } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  image: string;
  status: string;
  statusColor?: string;
  participants?: number;
  location?: string;
}

export default function EventCard({
  title,
  date,
  image,
  status,
  statusColor = "bg-[#0E2A47]",
  participants,
  location,
}: EventCardProps) {
  return (
    <div className="bg-[#F6F6F6] rounded-2xl overflow-hidden shadow-sm w-full max-w-65">
      {/* Imagem */}
      <div className="relative h-32.5 w-full">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
        />

        {/* Status */}
        <span
          className={`absolute top-3 right-3 text-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide ${statusColor}`}
        >
          {status}
        </span>
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-[#0E2A47] font-bold text-[20px] leading-8">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-[#7D7D7D] text-sm">
          <CalendarDays size={14} />
          <span>{date}</span>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between mt-2">
          {participants ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0E2A47] text-white flex items-center justify-center text-xs font-semibold">
                {participants}
              </div>

              <span className="text-xs text-[#7D7D7D]">
                inscritos
              </span>
            </div>
          ) : (
            <span className="text-xs text-[#7D7D7D]">
              {location}
            </span>
          )}

          <button className="w-8 h-8 rounded-lg border border-[#D9D9D9] flex items-center justify-center hover:bg-gray-100 transition">
            <Pencil size={16} className="text-[#0E2A47]" />
          </button>
        </div>
      </div>
    </div>
  );
}