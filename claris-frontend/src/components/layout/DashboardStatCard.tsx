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
		<div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-800 p-4">
			<div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-300">
				{icon}
				{title}
			</div>

			<p className="mt-2 text-3xl font-bold text-brand-primary dark:text-slate-50">
				{value}
			</p>
		</div>
	);
}