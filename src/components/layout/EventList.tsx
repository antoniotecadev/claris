"use client";

import { useState } from "react";
import { ArrowRight, ArrowUp } from "lucide-react";
import EventCard, { EventCardProps } from "./EventCard";

type EventListProps = {
  events: EventCardProps[];
  initialCount?: number; // default 3
};

export default function EventList({ events, initialCount = 3 }: EventListProps) {
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? events : events.slice(0, initialCount);
  const hasMore = events.length > initialCount;

  return (
    <div className="w-full">
      {/* Grid */}
      <div className="mt-6 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {visible.map((event, i) => (
          <div
            key={`${event.id}-${i}`}
            className={`transition-all duration-500 ${
              showAll && i >= initialCount
                ? "animate-fade-in opacity-100"
                : "opacity-100"
            }`}
          >
            <EventCard {...event} />
          </div>
        ))}
      </div>

      {/* Button */}
      {hasMore && (
        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="flex h-12 w-full max-w-xs items-center justify-center gap-2 rounded-2xl border border-[#002045] bg-white px-6 py-3 text-sm font-bold text-[#002045] shadow-sm transition-all duration-200 hover:bg-[#002045] hover:text-white"
          >
            <span>{showAll ? "Mostrar menos" : "Carregar mais eventos"}</span>
            {showAll ? <ArrowUp size={20} /> : <ArrowRight size={20} />}
          </button>
        </div>
      )}
    </div>
  );
}
