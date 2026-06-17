import { ReactNode } from "react";

interface DashboardStatCardProps {
	title: string;
	value: number | string;
	icon: ReactNode;
}

export function DashboardStatCard({
	title,
	value,
	icon,
}: DashboardStatCardProps) {
	return (
		<div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4">
			<div className="flex items-center gap-2 text-sm font-medium text-slate-500">
				{icon}
				{title}
			</div>

			<p className="mt-2 text-3xl font-bold text-[#002045]">
				{value}
			</p>
		</div>
	);
}