"use client";
import CreateEventCard from "@/components/layout/createEvent";
import EventCard from "@/components/layout/EventCard";
// import MembersInvitesCard from "@/components/layout/InviteAccept";
import { Users, Mail, Calendar, MapPin, Phone, Mail as MailIcon, Trash2, PhoneIcon, Clock, Users as UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getDateLocale } from "@/i18n/routing";
import { useMessages } from "@/i18n/messages";

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
		<div className="bg-white h-screen">
			
		</div>
	);
}


