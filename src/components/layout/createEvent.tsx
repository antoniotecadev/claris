"use client";
import { useState } from "react";
import { Calendar, Clock, MapPin, Users, Send } from "lucide-react";

interface EventFormData {
	title: string;
	description: string;
	date: string;
	startTime: string;
	endTime: string;
	location: string;
	category: string;
	maxAttendees: string;
}

export default function CreateEventCard() {
	const [formData, setFormData] = useState<EventFormData>({
		title: "",
		description: "",
		date: "",
		startTime: "",
		endTime: "",
		location: "",
		category: "Culto",
		maxAttendees: "",
	});

	const [submitted, setSubmitted] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Aqui você enviará os dados para a API
		console.log("Evento criado:", formData);
		setSubmitted(true);
		setTimeout(() => {
			setFormData({
				title: "",
				description: "",
				date: "",
				startTime: "",
				endTime: "",
				location: "",
				category: "Culto",
				maxAttendees: "",
			});
			setSubmitted(false);
		}, 2000);
	};

	return (
		<div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
			{/* Header */}
			<div className="bg-linear-to-r from-[#1E3A8A] to-[#002045] p-6 text-white">
				<div className="flex items-center gap-3">
					<Calendar size={28} />
					<div>
						<h2 className="text-2xl font-bold">Criar Evento</h2>
						<p className="text-[#DBEAFE] text-sm mt-1">Organize e compartilhe eventos com a comunidade</p>
					</div>
				</div>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="p-6 space-y-4">
				{/* Title */}
				<div>
					<label className="block text-sm font-semibold text-gray-700 mb-2">
						Título do Evento *
					</label>
					<input
						type="text"
						name="title"
						value={formData.title}
						onChange={handleChange}
						placeholder="Ex: Culto de Domingo"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
						required
					/>
				</div>

				{/* Description */}
				<div>
					<label className="block text-sm font-semibold text-gray-700 mb-2">
						Descrição *
					</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						placeholder="Descreva o evento em detalhes..."
						rows={3}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent resize-none"
						required
					/>
				</div>

				{/* Grid 2 Columns */}
				<div className="grid grid-cols-2 gap-4">
					{/* Date */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Data *
						</label>
						<input
							type="date"
							name="date"
							value={formData.date}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
							required
						/>
					</div>

					{/* Category */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Categoria *
						</label>
						<select
							name="category"
							value={formData.category}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
						>
							<option value="Culto">Culto</option>
							<option value="Reunião">Reunião</option>
							<option value="Treinamento">Treinamento</option>
							<option value="Social">Social</option>
							<option value="Outro">Outro</option>
						</select>
					</div>
				</div>

				{/* Grid 2 Columns - Times */}
				<div className="grid grid-cols-2 gap-4">
					{/* Start Time */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Hora de Início *
						</label>
						<input
							type="time"
							name="startTime"
							value={formData.startTime}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
							required
						/>
					</div>

					{/* End Time */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Hora de Término *
						</label>
						<input
							type="time"
							name="endTime"
							value={formData.endTime}
							onChange={handleChange}
							className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
							required
						/>
					</div>
				</div>

				{/* Location */}
				<div>
					<label className="block text-sm font-semibold text-gray-700 mb-2">
						Local do Evento
					</label>
					<input
						type="text"
						name="location"
						value={formData.location}
						onChange={handleChange}
						placeholder="Ex: Sala 101, Igreja Principal"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
					/>
				</div>

				{/* Max Attendees */}
				<div>
					<label className="block text-sm font-semibold text-gray-700 mb-2">
						Máximo de Participantes
					</label>
					<input
						type="number"
						name="maxAttendees"
						value={formData.maxAttendees}
						onChange={handleChange}
						placeholder="Ex: 100"
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent"
					/>
				</div>

				{/* Submit Button */}
				<div className="pt-4 border-t border-gray-200">
					<button
						type="submit"
						disabled={submitted}
						className="w-full bg-linear-to-r from-[#1E3A8A] to-[#002045] hover:from-[#1E3A8A]/90 hover:to-[#002045]/90 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
					>
						<Send size={18} />
						{submitted ? "Evento Criado!" : "Criar Evento"}
					</button>
				</div>
			</form>
		</div>
	);
}
