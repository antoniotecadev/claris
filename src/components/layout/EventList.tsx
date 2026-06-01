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
    <div>
      {/* Grid */}
      <div className="flex flex-wrap gap-6  mt-6 justify-between items-start w-screen">
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
        <div className="flex items-center justify-center mt-6">
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="w-60 h-13 bg-white rounded-2xl text-[#002045] font-bold hover:text-white hover:bg-[#002045]/90 flex gap-2 items-center justify-center border border-[#002045] px-6 py-3 transition-all duration-200"
          >
            <p>{showAll ? "Mostrar menos" : "Carregar Mais eventos"}</p>
            {showAll ? <ArrowUp size={20} /> : <ArrowRight size={20} />}
          </button>
        </div>
      )}
    </div>
  );
}
