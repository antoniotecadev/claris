import { ArrowRight } from "lucide-react";


interface CommunityCardProps {
	name: string;
	local: string;
	logoUrl: string | null;
	membersCount: number;
	onClick: () => void;
	className?: string;

}


export default function CommunityJoin({
	name,
	logoUrl,
	membersCount,
	local,
	onClick,
	className = '',
}: CommunityCardProps) {
	return (
		<div className="bg-white h-100  w-71.5 flex flex-col rounded-lg shadow-md mt-7 cursor-pointer p-5" onClick={onClick}>
			<div className=" w-full h-48 mb-6 ">
				{logoUrl ? (
					<img src={logoUrl} alt={`${name} logo`} className="w-full h-full object-cover rounded-lg" />
				) : (
					<div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-lg">
						<span className="text-gray-500">No Logo</span>
					</div>
				)}
			</div>
			<div className="w-full  flex flex-col">
				<h3 className="text-lg font-bold text-[#002045] text-[20px] mb-2">{name}</h3>
				<div className="flex gap-2">
					<span className="text-sm text-gray-500">{membersCount} members</span>
					<p className="text-[#475F83] text-[14px]">{local}</p>
				</div>
				<div className="flex justify-center items-center mt-6">

					<button className="flex items-center text-[#002045] bg-[#F3F3F3] p-3 rounded-2xl cursor-pointer   " onClick={onClick}>
						<span className="text-sm ">Pedido para participar</span>
					</button>
				</div>
			</div>
		</div>
	)
}