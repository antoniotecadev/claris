import Conf from "@/components/layout/conf";
import Header from "../components/layout/header";
import Hero from "../components/layout/hero";
import Fun from "@/components/layout/fetuares";
import Prices from "@/components/layout/price";
import Join from "@/components/layout/join";
import Footer from "@/components/layout/footer";



export default function LandingPage() {
	return (
		<div className="h-screen flex flex-col ">
			<Header />
			<div className="flex-1 flex flex-col overflow-auto">
				<section id="first" >
					<Hero />
				</section>
				<Fun />
				<section id="preco">
					<Prices />
				</section>
				<Join />
				<Footer />
			</div>
		</div>
	)
}