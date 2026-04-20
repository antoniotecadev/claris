import { LucideIcon } from "lucide-react";
import { Users, Calendar, MessageSquare, LayoutDashboard, Bell, Building2 } from "lucide-react";
import Simple from "./Simple";

interface FunctCard {
    title: string;
    description: string;
    icon: LucideIcon;
    iconBgColor: string;

}



function Card({ title, description, icon: Icon, iconBgColor = "[bg-[#EEF2FF]" }: FunctCard) {
    return (
        <div className="w-full max-w-[320px] bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col items-start transition-all hover:scale-[1.02]">

            {/* Ícone Dinâmico */}
            <div className={`w-12 h-12 mb-6 flex items-center justify-center rounded-xl ${iconBgColor} text-[#5C00CA]`}>
                <Icon size={24} />
            </div>

            <h3 className="text-[#191C1E] font-bold text-xl mb-3">
                {title}
            </h3>

            <p className="text-gray-500 text-sm leading-relaxed text-left">
                {description}
            </p>
        </div>
    );
}

export default function Fun() {

    return (
        <div className="bg-white">
            <div className="m-auto container">
                <div className="flex flex-col justify-center items-center py-20 space-y-5">
                    <h5 className="text-[#5C00CA] tracking-wide font-bold">
                        INNOVATION FOR FAITH
                    </h5>
                    <h1 className="text-[#191C1E] font-bold text-4xl">
                        Built for Ministry
                    </h1>
                    <div className="flex item justify-center flex-col flex-wrap sm:flex sm:flex-row gap-6">
                        <Card
                            title="Gestão de Membros"
                            description="Centralize os dados da sua congregação com perfis detalhados e visão relacional completa."
                            icon={Users}
                            iconBgColor="bg-[#E1E0FF]"
                        />

                        <Card
                            title="Calendário de Eventos"
                            description="Organize cultos, reuniões e eventos especiais com agendamento inteligente e notificações."
                            icon={Calendar}
                            iconBgColor="bg-[#E1E0FF]"
                        />

                        <Card
                            title="Chat em Tempo Real"
                            description="Conecte a sua liderança e ministérios instantaneamente com canais de comunicação seguros."
                            icon={MessageSquare}
                            iconBgColor="bg-[#E1E0FF]"
                        />

                        <Card
                            title="Dashboard Inteligente"
                            description="Visualize o crescimento da sua igreja através de métricas, gráficos e relatórios automáticos."
                            icon={LayoutDashboard}
                            iconBgColor="bg-[#E1E0FF]"
                        />

                        <Card
                            title="Notificações"
                            description="Mantenha todos informados sobre novas atualizações, mensagens e alertas importantes do sistema."
                            icon={Bell}
                            iconBgColor="bg-[#E1E0FF]"
                        />

                        <Card
                            title="Gestão de Organização"
                            description="Gerencie múltiplas sedes, departamentos e permissões de acesso em uma única plataforma."
                            icon={Building2}
                            iconBgColor="bg-[#E1E0FF]"
                        />

                    </div>

                    
                </div>
            </div>
            <Simple/>
        </div>
        
    )
}
