// components/EventsSection.tsx
import EventCard from "./EventCard";
import { PlusCircle } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Batismo da Primavera",
    date: "24 de Setembro, 09:00",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    status: "Confirmado",
    statusColor: "bg-[#D9B16F]",
    participants: 18,
  },
  {
    id: 2,
    title: "União Oliveira-Moraes",
    date: "12 de Outubro, 18:00",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552",
    status: "Planejamento",
    statusColor: "bg-[#0E2A47]",
    location: "Salão Principal",
  },
];

export default function EventsSection() {
  return (
    <section className="bg-white rounded-3xl p-6 border border-[#ECECEC] w-full mt-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0E2A47]">
            Gestão de Eventos
          </h2>

          <p className="text-[#7D7D7D] mt-1">
            Calendário de celebrações e ações
          </p>
        </div>

        <button className="text-[#0E2A47] font-semibold text-sm hover:underline">
          Ver Calendário Completo →
        </button>
      </div>

      {/* Eventos Dinâmicos */}
      <div className="flex gap-5">
        {events.map((event) => (
          <EventCard
            key={event.id}
            title={event.title}
            date={event.date}
            image={event.image}
            status={event.status}
            statusColor={event.statusColor}
            participants={event.participants}
            location={event.location}
          />
        ))}
      </div>

      {/* Criar novo evento */}
      <button className="w-full mt-6 border-2 border-dashed border-[#DADADA] rounded-2xl py-5 flex items-center justify-center gap-2 text-[#4B4B4B] font-semibold tracking-[3px] hover:bg-gray-50 transition">
        <PlusCircle size={18} />
        CRIAR NOVO EVENTO
      </button>
    </section>
  );
}