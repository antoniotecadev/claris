"use client";
import CreateEventCard from "@/components/layout/createEvent";
import EventCard from "@/components/layout/EventCard";
import { Users, Mail, Calendar, MapPin, Phone, Mail as MailIcon, Trash2, PhoneIcon, Clock, Users as UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getDateLocale } from "@/i18n/routing";
import { useMessages } from "@/i18n/messages";
import Logo from "@/assets/images/logo.png";
import Image from "next/image";
import Link from "next/link";

interface Member {
	id: string;
	displayName: string;
	email: string;
	phone?: string;
	avatarUrl?: string;
	role?: string;
	joinedAt?: string;
}

interface Event {
	id: string;
	title: string;
	description: string;
	date: string;
	startTime: string;
	endTime: string;
	location?: string;
	category: string;
	attendees: number;
	maxAttendees?: number;
}

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
			<div className="w-full bg-zinc-300  side3 h-179 px-8">
				<div className="flex justify-between items-center font-bold h-8">
					<p className="text-[#5D4201] tracking-wide bg-[#FFDEA5] p-3 rounded-2xl ">Centro de Missões</p>

				</div>
			</div>
		</div>
	);
}


