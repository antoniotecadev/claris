import Header from "@/components/layout/header";
import Hero from "@/components/layout/hero";
import Fun from "@/components/layout/fetuares";
import Join from "@/components/layout/join";
import Footer from "@/components/layout/footer";

export default function LandingPage() {
	return (
		<div className="min-h-screen flex flex-col bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.14),_transparent_34%),linear-gradient(to_bottom,_rgba(248,250,252,1),_rgba(241,245,249,1))] text-slate-900 dark:bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_32%),linear-gradient(to_bottom,_#0f172a,_#020617)] dark:text-slate-50">
			<Header />
			<main className="flex-1 flex flex-col">
				<section id="inicio" className="transform opacity-100 translate-y-0">
					<Hero />
				</section>
				<section id="funcionalidades" className="transform opacity-100 translate-y-0">
					<Fun />
				</section>
				<section id="sobre" className="transform opacity-100 translate-y-0">
					<Join />
				</section>
				<section className="transform opacity-100 translate-y-0">
					<Footer />
				</section>
			</main>
		</div>
	);
}
