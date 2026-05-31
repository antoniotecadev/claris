"use client";
import { Users, Mail, Calendar, MapPin, Phone, Mail as MailIcon, Trash2, PhoneIcon, ArrowRight, Users as UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getDateLocale } from "@/i18n/routing";
import { useMessages } from "@/i18n/messages";
import Logo from "@/assets/images/logo.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/layout/SeachBar";
import EventCard, { EventCardProps } from "@/components/layout/EventCard";
import EventList from "@/components/layout/EventList";

const events: EventCardProps[] = [
  {
    id: "workshop-1",
    date: "15 OUT",
    time: "09:00",
    title: "Workshop: Liderança com Alma",
    description: "Explore princípios de gestão e vida baseados na integridade, propósito e compaixão em um ambiente de mentoria.",
    location: "Centro de Formação, Lisboa",
    spotsRemaining: 12,
    imageUrl: "/images/workshop.jpg",
    isFavorited: false,
    onEdit: (id) => console.log("Editar:", id),
    onDelete: (id) => console.log("Eliminar:", id),
    onParticipate: (id) => console.log("Participar:", id),
    onFavorite: (id) => console.log("Favorito:", id),
  },
    {
    id: "workshop-1",
    date: "15 OUT",
    time: "09:00",
    title: "Workshop: Liderança com Alma",
    description: "Explore princípios de gestão e vida baseados na integridade, propósito e compaixão em um ambiente de mentoria.",
    location: "Centro de Formação, Lisboa",
    spotsRemaining: 12,
    imageUrl: "/images/workshop.jpg",
    isFavorited: false,
    onEdit: (id) => console.log("Editar:", id),
    onDelete: (id) => console.log("Eliminar:", id),
    onParticipate: (id) => console.log("Participar:", id),
    onFavorite: (id) => console.log("Favorito:", id),
  },
    {
    id: "workshop-1",
    date: "15 OUT",
    time: "09:00",
    title: "Workshop: Liderança com Alma",
    description: "Explore princípios de gestão e vida baseados na integridade, propósito e compaixão em um ambiente de mentoria.",
    location: "Centro de Formação, Lisboa",
    spotsRemaining: 12,
    imageUrl: "/images/workshop.jpg",
    isFavorited: false,
    onEdit: (id) => console.log("Editar:", id),
    onDelete: (id) => console.log("Eliminar:", id),
    onParticipate: (id) => console.log("Participar:", id),
    onFavorite: (id) => console.log("Favorito:", id),
  },
    {
    id: "workshop-1",
    date: "15 OUT",
    time: "09:00",
    title: "Workshop: Liderança com Alma",
    description: "Explore princípios de gestão e vida baseados na integridade, propósito e compaixão em um ambiente de mentoria.",
    location: "Centro de Formação, Lisboa",
    spotsRemaining: 12,
    imageUrl: "/images/workshop.jpg",
    isFavorited: false,
    onEdit: (id) => console.log("Editar:", id),
    onDelete: (id) => console.log("Eliminar:", id),
    onParticipate: (id) => console.log("Participar:", id),
    onFavorite: (id) => console.log("Favorito:", id),
  },
    {
    id: "workshop-1",
    date: "15 OUT",
    time: "09:00",
    title: "Workshop: Liderança com Alma",
    description: "Explore princípios de gestão e vida baseados na integridade, propósito e compaixão em um ambiente de mentoria.",
    location: "Centro de Formação, Lisboa",
    spotsRemaining: 12,
    imageUrl: "/images/workshop.jpg",
    isFavorited: false,
    onEdit: (id) => console.log("Editar:", id),
    onDelete: (id) => console.log("Eliminar:", id),
    onParticipate: (id) => console.log("Participar:", id),
    onFavorite: (id) => console.log("Favorito:", id),
  },
    {
    id: "workshop-1",
    date: "15 OUT",
    time: "09:00",
    title: "Workshop: Liderança com Alma",
    description: "Explore princípios de gestão e vida baseados na integridade, propósito e compaixão em um ambiente de mentoria.",
    location: "Centro de Formação, Lisboa",
    spotsRemaining: 12,
    imageUrl: "/images/workshop.jpg",
    isFavorited: false,
    onEdit: (id) => console.log("Editar:", id),
    onDelete: (id) => console.log("Eliminar:", id),
    onParticipate: (id) => console.log("Participar:", id),
    onFavorite: (id) => console.log("Favorito:", id),
  },
  // ...adiciona mais eventos aqui
];



export default function DashboardPage() {
	return (
		<div className="bg-white h-screen w-screen ">
			<header className="w-screen h-20 border-b border-gray-200 px-8">
				<div className="flex justify-between ">
					<Link href="mainDash" className="flex items-center justify-center h-20">
						<Image src={Logo} alt="Logo" width={50} height={50} />
					</Link>
					<Link href="" className="flex items-center justify-center hover:cursor-pointer">
						<button className="flex items-center justify-center h-10 bg-[#002045] text-white w-30  rounded-2xl">
							voltar
						</button>
					</Link>
				</div>
			</header>
			<div className="w-full bg-zinc-300  side3 h-130 px-8 py-20 flex flex-col  gap-10 space-y-4">
				<div className="flex justify-between items-center font-bold h-4 w-50">
					<p className="text-[#5D4201] tracking-wide bg-[#FFDEA5] px-4 rounded-2xl ">Centro de Missões</p>
				</div>
				<p className=" text-white text-5xl font-bold tracking-wide italic">
					Bem-vindo ao Centro de Missões!
				</p>
				<div className="flex gap-3">
					<MapPin size={24} color="#5D4201" />
					<p className="text-white tracking-wide text-lg font-bold">
						Encontre e participe de missões próximas a você!
					</p>
				</div>
				<Button className="w-50 h-13 bg-[#FFDEA5] rounded-2xl text-[#5D4201] font-bold hover:bg-[#FFDEA5]/90 flex gap-2 items-center justify-center">
					<p>Criar Evento</p>
					<ArrowRight size={20} color="#5D4201" />
				</Button>
			</div>
			<div className="flex items-center justify-center mt-3">
				<SearchBar />
			</div>
			<div className="flex flex-col px-8 mt-10 gap-4">
				<p className="italic tracking-tight  text-[#002045] text-[36px]">Próximos Encontros</p>
				<p className="text-[#002045] w-[40%] text-lg tracking-wide">
					Junte-se a nós em momentos de reflexão, música e serviço. Espaços
					curados para o florescimento da alma.
				</p>
			</div>
			<div className="flex flex-wrap gap-6 px-8 mt-6 justify-between items-center">

				 <EventList events={events} initialCount={3} />

			</div>
			<div className="flex items-center justify-center mt-6">
				<Button className="w-60 h-13 bg-white rounded-2xl text-[#002045] font-bold hover:text-white hover:bg-[#002045]/90 flex gap-2 items-center justify-center border border-[#002045]">
					<p>Carregar Mais eventos</p>
					<ArrowRight size={20}  />
				</Button>
			</div>
		</div>
	);
}



