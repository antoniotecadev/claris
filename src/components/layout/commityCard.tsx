import { ArrowRight } from "lucide-react";

interface CommunityCardProps {
	name: string;
	description: string;
	logoUrl: string | null;
	membersCount: number;
	responsable: string;
	onClick: () => void;
	className?: string;
}

export default function CommunityCard({
	name,
	description,
	logoUrl,
	membersCount,
	responsable,
	onClick,
	className = '',
}: CommunityCardProps) {
	return (
		<div 
			className="relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer hover:scale-105 transform group aspect-square max-w-sm"
			onClick={onClick}
		>
			{/* Background Image - Full Coverage */}
			<div className="absolute inset-0 bg-gray-200">
				{logoUrl ? (
					<img 
						src={logoUrl} 
						alt={`${name} logo`} 
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 flex items-center justify-center">
						<span className="text-gray-400 text-sm">Sem Logo</span>
					</div>
				)}
			</div>

			{/* Dark Overlay - Always Visible */}
			<div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-all duration-300" />

			{/* Content Overlay */}
			<div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
				{/* Top Section */}
				<div className="flex justify-between items-start gap-2">
					{/* Role Badge */}
					<span className="inline-block text-xs font-semibold text-white bg-[#1E3A8A]/90 px-2 py-1 rounded-full truncate backdrop-blur-sm">
						{responsable}
					</span>
				</div>

				{/* Bottom Section */}
				<div className="space-y-2">
					{/* Title */}
					<h3 className="text-sm font-bold text-white line-clamp-2">
						{name}
					</h3>

					{/* Description */}
					<p className="text-xs text-gray-100 line-clamp-2">
						{description}
					</p>

					{/* Footer */}
					<div className="flex justify-end items-end pt-2 border-t border-white/20">
						<button 
							className="flex items-center gap-1 text-white font-medium text-xs bg-[#1E3A8A]/80 hover:bg-[#1E3A8A] px-2 py-1 rounded-md transition-all duration-200 backdrop-blur-sm"
							onClick={onClick}
						>
							<span>Entrar</span>
							<ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}