"use client";
import Image from "next/image";
import igreja from "@/assets/images/unnamed.png";
import Conf from "./conf";
import heroImg from "@/assets/images/hero.png";
import { useMessages } from "@/i18n/messages";

export default function Hero() {
	const { t } = useMessages();

	return (
		<>

			<section
				style={{
					backgroundImage: `linear-gradient(
						to right,
						rgba(15, 23, 42, 0.96) 8%,
						rgba(15, 23, 42, 0.78) 52%,
						rgba(15, 23, 42, 0.56) 100%
					), url(${heroImg.src})`
				}}
				className="relative overflow-hidden bg-slate-50 bg-center bg-cover flex flex-col justify-center py-12 md:py-20 lg:py-28 min-h-screen md:min-h-auto dark:bg-slate-950"
			>
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.14),transparent_30%)]" />
				<div className="absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-black/10 dark:from-white/0 dark:via-transparent dark:to-black/30" />
				<div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 justify-between items-center px-4 md:px-6 lg:px-0">
					<div className="flex flex-col justify-center space-y-6 md:space-y-8">
						<p className="text-center lg:text-left text-xs md:text-sm text-[#FDE68A] italic">
							&quot;{t("hero.quotePrimary")}&quot;
						</p>
						<div>
							<span className="inline-block px-3 md:px-4 py-1.5 md:py-2 bg-[#FFDEA5] text-[#5D4201] text-xs md:text-sm tracking-wide rounded-full md:rounded-2xl font-semibold">
								{t("hero.badge")}
							</span>
						</div>
						<h1 className="text-white text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
							{t("hero.title")} <br />
							<span className="text-[#FFDEA5] font-bold">{t("hero.titleAccent")}</span>
						</h1>
						<p className="text-[#DBEAFE] text-sm md:text-base lg:text-lg max-w-xl">
							{t("hero.description")}
						</p>
						<p className="italic text-[#BFDBFE] text-xs md:text-sm max-w-lg">
							&quot;{t("hero.quoteSecondary")}" {t("hero.quoteSecondarySource")}
						</p>
					</div>
				</div>

			</section>
			<Conf />
		</>
	);
}