import AnnouncementCard from "@/components/layout/anuncios";
import MissionCard from "@/components/layout/cardGroups";
import EventsSection from "@/components/layout/EventsSection";
import MembersInvitesCard from "@/components/layout/InviteAccept";
import { Briefcase, Shield, Users } from "lucide-react";

export default function DashboardPage() {
	return (
		<div className="flex flex-col w-full h-full ">
			<div className="w-full h-64 bg-[url('/assets/heroMain.png')] bg-cover text-white rounded-2xl p-5 gap-2 ">
				<div className="flex  flex-col w-[45%] justify-between h-full p-2">
					<p className="text-[#FFDEA5] font-bold text-[12px]">PAINEL ADMINISTRATIVO</p>
					<p className="text-white italic text-[48px] ">Bem-vindo ao Santuário Digital</p>
					<p className="text-[18px] text-white">
						Gerencie os ministérios, eventos e a comunidade com a serenidade e
						o propósito que nossa missão exige.
					</p>
				</div>
			</div>
			<div className="w-full flex h-157.25 mt-10 bg-white justify-between p-5" >
				<div className="flex flex-col w-300">
					<div className="flex justify-between items-center w-full p-4 mb-5">
						<div className="flex flex-col ">
							<p className="text-[#002045] font-bold text-2xl">Gestão de Grupos</p>
							<p className=" tracking-wide text-[#43474E]">Ministérios ativos na Claris</p>
						</div>
						<button className="bg-[#F3F3F3] rounded-2xl h-10 p-2 text-[#002045] w-32 font-bold hover:cursor-pointer"> + Novo grupo</button>
					</div>
					<div className="flex flex-wrap gap-2 justify-between overflow-auto py-10 space-y-2">
						<MissionCard

							title="Missões Urbanas"

							activeMembers={128}

							icon={Briefcase}

							theme="light"

							members={[

								"https://i.pravatar.cc/100?img=1",

								"https://i.pravatar.cc/100?img=2",

								"https://i.pravatar.cc/100?img=3",

								"https://i.pravatar.cc/100?img=4",

							]}

						/>

						<MissionCard

							title="Missões Urbanas"

							activeMembers={128}

							icon={Briefcase}

							theme="light"

							members={[

								"https://i.pravatar.cc/100?img=1",

								"https://i.pravatar.cc/100?img=2",

								"https://i.pravatar.cc/100?img=3",

								"https://i.pravatar.cc/100?img=4",

							]}

						/>
						<MissionCard

							title="Missões Urbanas"

							activeMembers={128}

							icon={Briefcase}

							theme="light"

							members={[

								"https://i.pravatar.cc/100?img=1",

								"https://i.pravatar.cc/100?img=2",

								"https://i.pravatar.cc/100?img=3",

								"https://i.pravatar.cc/100?img=4",

							]}

						/>


						<MissionCard

							title="Segurança"

							activeMembers={89}

							icon={Shield}

							theme="dark"

							members={[

								"https://i.pravatar.cc/100?img=5",

								"https://i.pravatar.cc/100?img=6",

							]}

						/>



						<MissionCard

							title="Comunidade"

							activeMembers={320}

							icon={Users}

							theme="green"

						/>

						<MissionCard

							title="Segurança"

							activeMembers={89}

							icon={Shield}

							theme="dark"

							members={[

								"https://i.pravatar.cc/100?img=5",

								"https://i.pravatar.cc/100?img=6",

							]}

						/>

					</div>
				</div>
				<div>
					<AnnouncementCard />
				</div>

			</div>
			<div className="flex gap-2 justify-between">
				<MembersInvitesCard />
				<EventsSection />
			</div>

		</div>
	)
}


