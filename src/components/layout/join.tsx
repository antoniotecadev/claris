export default function Join() {
	return (
		<div className="bg-white py-12 md:py-16 lg:py-24 dark:bg-slate-950">
			<div className="container mx-auto px-4 md:px-6 lg:px-0">

				<div className="relative overflow-hidden rounded-xl border border-white/10 bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_55%,#0f172a_100%)] p-6 text-center shadow-2xl shadow-slate-950/20 md:rounded-2xl md:p-10 lg:rounded-3xl lg:p-20 flex flex-col items-center space-y-4 md:space-y-6">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.22),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.16),_transparent_30%)]" />
					<div className="relative z-10 flex flex-col items-center space-y-4 md:space-y-6">
					<h1 className="text-white font-bold text-2xl md:text-4xl lg:text-5xl">
						Junte-se ao futuro do ministério hoje
					</h1>

					<p className="text-white text-base md:text-lg lg:text-xl max-w-2xl">
						Experimente o santuário digital que ajuda a sua igreja a prosperar na era moderna.
					</p>

					<button className="bg-amber-200 text-slate-950 px-6 py-3 md:px-8 md:py-4 font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-amber-200/40" onClick={() => window.location.href = '/login'}>
						Comece agora
					</button>
					</div>
				</div>

			</div>
		</div>
	);
}