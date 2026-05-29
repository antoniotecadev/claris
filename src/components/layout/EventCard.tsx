"use client";

import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { getDateLocale } from "@/i18n/routing";
import { useMessages } from "@/i18n/messages";

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

interface EventCardProps {
	event: Event;
	onEdit?: (id: string) => void;
	onDelete?: (id: string) => void;
	isSquare?: boolean;
}

export default function EventCard({ event, onEdit, onDelete, isSquare = false }: EventCardProps) {
	const { locale, t } = useMessages();
	// Format date to Portuguese locale
	const formatDate = (dateString: string) => {
		const date = new Date(dateString + "T00:00:00");
		return date.toLocaleDateString(getDateLocale(locale), {
			weekday: "long",
			day: "numeric",
			month: "long",
		});
	};

	const categoryKeyMap: Record<string, string> = {
		Culto: "culto",
		Reunião: "reuniao",
		Treinamento: "treinamento",
		Social: "social",
		Outro: "outro",
	};
	const categoryKey = categoryKeyMap[event.category] || "outro";

	// Get category color
	const getCategoryColor = (category: string) => {
		const colors: Record<string, { bg: string; text: string }> = {
			Culto: { bg: "bg-blue-100", text: "text-blue-800" },
			Reunião: { bg: "bg-purple-100", text: "text-purple-800" },
			Treinamento: { bg: "bg-green-100", text: "text-green-800" },
			Social: { bg: "bg-orange-100", text: "text-orange-800" },
			Outro: { bg: "bg-gray-100", text: "text-gray-800" },
		};
		return colors[category] || colors.Outro;
	};

	const categoryColor = getCategoryColor(event.category);
	const occupancyPercentage = event.maxAttendees
		? Math.round((event.attendees / event.maxAttendees) * 100)
		: null;

	// Square card format (compact)
	if (isSquare) {
		return (
			<div className="relative aspect-square bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden group cursor-pointer">
				{/* Gradient background */}
				<div className="absolute inset-0 bg-linear-to-br from-[#1E3A8A] to-[#002045] opacity-10" />

				{/* Content with absolute positioning */}
				<div className="absolute inset-0 p-4 flex flex-col justify-between">
					{/* Header */}
					<div>
						<span className={`text-xs font-semibold px-2 py-1 rounded-full inline-block ${categoryColor.bg} ${categoryColor.text}`}>
							{t(`events.categories.${categoryKey}`)}
						</span>
						<h3 className="text-sm font-bold text-gray-900 mt-2 line-clamp-2">{event.title}</h3>
						<p className="text-xs text-gray-600 mt-1 line-clamp-1">{event.description}</p>
					</div>

					{/* Middle - Date and Time */}
					<div className="space-y-1.5">
						<div className="flex items-center gap-1 text-xs text-gray-700">
							<Calendar size={12} className="shrink-0" />
							<span className="font-medium line-clamp-1">{formatDate(event.date)}</span>
						</div>
						<div className="flex items-center gap-1 text-xs text-gray-700">
							<Clock size={12} className="shrink-0" />
							<span>{event.startTime} - {event.endTime}</span>
						</div>
						{event.location && (
							<div className="flex items-center gap-1 text-xs text-gray-700">
								<MapPin size={12} className="shrink-0" />
								<span className="line-clamp-1">{event.location}</span>
							</div>
						)}
					</div>

					{/* Footer - Attendees and Actions */}
					<div>
						<div className="flex items-center justify-between mb-2">
							<div className="flex items-center gap-1 text-xs text-gray-700">
								<Users size={12} />
								<span className="font-medium">{event.attendees}/{event.maxAttendees || "∞"}</span>
							</div>
						</div>
						{occupancyPercentage !== null && (
							<div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
								<div
									className="bg-linear-to-r from-[#1E3A8A] to-[#002045] h-1.5 rounded-full transition-all"
									style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
								/>
							</div>
						)}
						<div className="flex gap-1">
							{onEdit && (
								<button
									onClick={() => onEdit(event.id)}
									className="flex-1 px-2 py-1 text-xs font-medium text-[#1E3A8A] bg-blue-50 hover:bg-blue-100 rounded transition-colors"
								>
									{t("events.actions.edit")}
								</button>
							)}
							{onDelete && (
								<button
									onClick={() => onDelete(event.id)}
									className="flex-1 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
								>
									{t("events.actions.delete")}
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}

	// Regular rectangular format
	return (
		<div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden">
			{/* Header with gradient background */}
			<div className="bg-linear-to-r from-[#1E3A8A] to-[#002045] px-6 py-4">
				<h3 className="text-lg font-bold text-white mb-1">{event.title}</h3>
				<p className="text-sm text-gray-200 line-clamp-2">{event.description}</p>
			</div>

			{/* Content */}
			<div className="px-6 py-4 space-y-4">
				{/* Category Badge */}
				<div className="flex items-center gap-2">
					<span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColor.bg} ${categoryColor.text}`}>
						{t(`events.categories.${categoryKey}`)}
					</span>
				</div>

				{/* Date and Time */}
				<div className="flex items-start gap-3 text-sm">
					<Calendar size={18} className="text-[#1E3A8A] mt-0.5 shrink-0" />
					<div>
						<div className="font-medium text-gray-900">{formatDate(event.date)}</div>
						<div className="text-gray-600 flex items-center gap-1 mt-1">
							<Clock size={14} className="inline" />
							{event.startTime} - {event.endTime}
						</div>
					</div>
				</div>

				{/* Location */}
				{event.location && (
					<div className="flex items-center gap-3 text-sm">
						<MapPin size={18} className="text-[#1E3A8A] shrink-0" />
						<span className="text-gray-700">{event.location}</span>
					</div>
				)}

				{/* Attendance */}
				<div className="bg-gray-50 rounded-lg p-3">
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2">
							<Users size={18} className="text-[#1E3A8A]" />
							<span className="text-sm font-medium text-gray-900">
								{event.attendees} {event.attendees !== 1 ? t("events.participants") : t("events.participant")}
							</span>
						</div>
						{event.maxAttendees && (
							<span className="text-xs text-gray-500">{t("events.of", { count: event.maxAttendees })}</span>
						)}
					</div>
					{occupancyPercentage !== null && (
						<div className="mt-2 w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-linear-to-r from-[#1E3A8A] to-[#002045] h-2 rounded-full transition-all"
								style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
							/>
						</div>
					)}
				</div>
			</div>

			{/* Footer with actions */}
			<div className="px-6 py-4 border-t border-gray-100 flex gap-2 justify-end">
				{onEdit && (
					<button
						onClick={() => onEdit(event.id)}
						className="px-4 py-2 text-sm font-medium text-[#1E3A8A] hover:bg-blue-50 rounded-lg transition-colors"
					>
						{t("events.actions.edit")}
					</button>
				)}
				{onDelete && (
					<button
						onClick={() => onDelete(event.id)}
						className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
					>
						{t("events.actions.delete")}
					</button>
				)}
				{!onEdit && !onDelete && (
					<button className="px-4 py-2 text-sm font-medium text-[#1E3A8A] hover:bg-blue-50 rounded-lg transition-colors">
						{t("events.actions.viewDetails")}
					</button>
				)}
			</div>
		</div>
	);
}
