"use client";
import CreateEventCard from "@/components/layout/createEvent";
import EventCard from "@/components/layout/EventCard";
// import MembersInvitesCard from "@/components/layout/InviteAccept";
import { Users, Mail, Calendar, MapPin, Phone, Mail as MailIcon, Trash2, PhoneIcon, Clock, Users as UsersIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

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
	const [members, setMembers] = useState<Member[]>([]);
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadMembers = async () => {
			try {
				// Substitua pela sua API real para buscar membros
				// const res = await api.get('/members');
				// setMembers(res.members || []);

				// Dados de exemplo
				setMembers([
					{ id: "1", displayName: "João Silva", email: "joao@example.com", phone: "+351 91 234 5678", role: "Admin", joinedAt: "2024-01-15", avatarUrl: "https://i.pravatar.cc/100?img=1" },
					{ id: "2", displayName: "Maria Santos", email: "maria@example.com", phone: "+351 92 345 6789", role: "Membro", joinedAt: "2024-02-20", avatarUrl: "https://i.pravatar.cc/100?img=2" },
					{ id: "3", displayName: "Pedro Costa", email: "pedro@example.com", phone: "+351 93 456 7890", role: "Membro", joinedAt: "2024-03-10", avatarUrl: "https://i.pravatar.cc/100?img=3" },
					{ id: "4", displayName: "Ana Oliveira", email: "ana@example.com", phone: "+351 94 567 8901", role: "Moderador", joinedAt: "2024-01-05", avatarUrl: "https://i.pravatar.cc/100?img=4" },
					{ id: "5", displayName: "Carlos Ferreira", email: "carlos@example.com", phone: "+351 95 678 9012", role: "Membro", joinedAt: "2024-04-12", avatarUrl: "https://i.pravatar.cc/100?img=5" },
				]);

				// Eventos de exemplo
				setEvents([
					{ id: "1", title: "Culto de Domingo", description: "Culto principal da semana", date: "2026-05-31", startTime: "10:00", endTime: "11:30", location: "Sala Principal", category: "Culto", attendees: 120, maxAttendees: 150 },
					{ id: "2", title: "Reunião de Oração", description: "Reunião semanal de oração", date: "2026-05-28", startTime: "19:00", endTime: "20:00", location: "Sala 101", category: "Reunião", attendees: 45, maxAttendees: 100 },
					{ id: "3", title: "Treinamento de Líderes", description: "Capacitação para líderes de grupos", date: "2026-06-01", startTime: "14:00", endTime: "16:00", location: "Auditório", category: "Treinamento", attendees: 32, maxAttendees: 50 },
					{ id: "4", title: "Confraternização", description: "Encontro social com a comunidade", date: "2026-06-08", startTime: "16:00", endTime: "19:00", location: "Pátio Externo", category: "Social", attendees: 200, maxAttendees: 250 },
					{ id: "1", title: "Culto de Domingo", description: "Culto principal da semana", date: "2026-05-31", startTime: "10:00", endTime: "11:30", location: "Sala Principal", category: "Culto", attendees: 120, maxAttendees: 150 },
					{ id: "2", title: "Reunião de Oração", description: "Reunião semanal de oração", date: "2026-05-28", startTime: "19:00", endTime: "20:00", location: "Sala 101", category: "Reunião", attendees: 45, maxAttendees: 100 },
					{ id: "3", title: "Treinamento de Líderes", description: "Capacitação para líderes de grupos", date: "2026-06-01", startTime: "14:00", endTime: "16:00", location: "Auditório", category: "Treinamento", attendees: 32, maxAttendees: 50 },
					{ id: "4", title: "Confraternização", description: "Encontro social com a comunidade", date: "2026-06-08", startTime: "16:00", endTime: "19:00", location: "Pátio Externo", category: "Social", attendees: 200, maxAttendees: 250 },
				]);
			} catch (error) {
				console.error("Erro ao carregar dados:", error);
			} finally {
				setLoading(false);
			}
		};

		loadMembers();
	}, []);

	const getRoleColor = (role?: string) => {
		switch (role?.toLowerCase()) {
			case "admin":
				return "bg-red-100 text-red-800";
			case "moderador":
				return "bg-blue-100 text-blue-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const deleteMember = (id: string) => {
		if (confirm("Tem certeza que deseja remover este membro?")) {
			setMembers((prev) => prev.filter((member) => member.id !== id));
		}
	};

	return (
		<div className="flex flex-col w-full h-full bg-gray-50 p-6 gap-6">
			{/* Hero Section */}
			<div className="w-full h-64 bg-linear-to-r from-[#1E3A8A] to-[#002045] rounded-2xl p-8 text-white shadow-lg">
				<div className="flex flex-col justify-between h-full">
					<div>
						<p className="text-[#DBEAFE] font-semibold text-sm tracking-wide">PAINEL ADMINISTRATIVO</p>
						<p className="text-white font-bold text-5xl mt-2">Bem-vindo ao Santuário Digital</p>
					</div>
					<p className="text-[#E0E7FF] text-lg">
						Visualize, gerencie e conecte-se com os membros da sua comunidade de fé.
					</p>
				</div>
			</div>

			{/* Events Section - Full Width */}
			<div className="w-full">
				<div className="flex items-center gap-3 mb-6">
					<Calendar size={28} className="text-[#1E3A8A]" />
					<h2 className="text-2xl font-bold text-gray-900">Eventos Criados</h2>
					<span className="text-sm text-gray-500">({events.length} eventos)</span>
				</div>
				{events.length === 0 ? (
					<div className="text-center py-12 bg-white rounded-lg border border-gray-200">
						<Calendar size={32} className="mx-auto text-gray-400 mb-3" />
						<p className="text-gray-500 text-sm">Nenhum evento criado ainda</p>
					</div>
				) : (
					<div className="overflow-x-auto pb-4">
						<div className="flex gap-6 min-w-min">
							{events.map((event) => (
								<div key={event.id} className="w-56 shrink-0">
									<EventCard
										event={event}
										isSquare={true}
										onEdit={(id) => console.log("Editar evento:", id)}
										onDelete={(id) => {
											const confirmed = window.confirm("Tem certeza que deseja eliminar este evento?");
											if (confirmed) {
												setEvents(events.filter(e => e.id !== id));
											}
										}}
									/>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column - Create Event & Invites */}
				<div className="lg:col-span-1 space-y-6">
					<CreateEventCard />
				</div>

				{/* Right Column - Members List */}
				<div className="lg:col-span-2">
					<div className="bg-white rounded-xl shadow-sm overflow-hidden">
						{/* Header */}
						<div className="bg-linear-to-r from-[#1E3A8A] to-[#002045] p-6 text-white">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Users size={28} />
									<div>
										<h2 className="text-2xl font-bold">Membros da Igreja</h2>
										<p className="text-[#DBEAFE] text-sm mt-1">{members.length} membros cadastrados</p>
									</div>
								</div>
								<button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-all text-sm">
									Exportar
								</button>
							</div>
						</div>

						{/* Members Table */}
						<div className="overflow-x-auto">
							{loading ? (
								<div className="p-8 text-center text-gray-500">
									Carregando membros...
								</div>
							) : members.length === 0 ? (
								<div className="p-8 text-center text-gray-500">
									Nenhum membro cadastrado ainda.
								</div>
							) : (
								<table className="w-full">
									<thead>
										<tr className="border-b border-gray-200 bg-gray-50">
											<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Membro</th>
											<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Telefone</th>
											<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Função</th>
											<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Data de Entrada</th>
											<th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Ações</th>
										</tr>
									</thead>
									<tbody>
										{members.map((member, idx) => (
											<tr key={member.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} border-b border-gray-100 hover:bg-blue-50 transition-colors`}>
												<td className="px-6 py-4">
													<div className="flex items-center gap-3">
														<img
															src={member.avatarUrl || `https://i.pravatar.cc/100?img=${idx}`}
															alt={member.displayName}
															className="w-10 h-10 rounded-full object-cover"
														/>
														<div>
															<p className="font-medium text-gray-900">{member.displayName}</p>
														</div>
													</div>
												</td>
												<td className="px-6 py-4">
													<div className="flex items-center gap-2 text-gray-600 text-sm">
														<PhoneIcon size={16} className="text-gray-400" />
														{member.phone || "-"}
													</div>
												</td>
												<td className="px-6 py-4">
													<span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(member.role)}`}>
														{member.role || "Membro"}
													</span>
												</td>
												<td className="px-6 py-4 text-gray-600 text-sm">
													{member.joinedAt ? new Date(member.joinedAt).toLocaleDateString("pt-PT") : "-"}
												</td>
												<td className="px-6 py-4">
													<div className="flex items-center gap-2">
														<button
															onClick={() => deleteMember(member.id)}
															className="text-red-600 hover:text-red-700 font-medium text-sm hover:underline flex items-center gap-1"
														>
															<Trash2 size={14} />
															Eliminar
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


