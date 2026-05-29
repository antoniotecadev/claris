"use client";

import { addLocaleToPathname } from "@/i18n/routing";
import { useMessages } from "@/i18n/messages";

export default function Join() {
	const { locale, t } = useMessages();
	const loginHref = addLocaleToPathname("/login", locale);

	return (
		<div className="bg-white py-12 md:py-16 lg:py-24">
			<div className="container mx-auto px-4 md:px-6 lg:px-0">

				<div className="bg-[#1A365D] rounded-xl md:rounded-2xl lg:rounded-3xl p-6 md:p-10 lg:p-20 flex flex-col items-center text-center space-y-4 md:space-y-6">
					<h1 className="text-white font-bold text-2xl md:text-4xl lg:text-5xl">
						{t("join.title")}
					</h1>

					<p className="text-white text-base md:text-lg lg:text-xl max-w-2xl">
						{t("join.description")}
					</p>

					<button
						className="bg-white text-[#002045] px-6 py-3 md:px-8 md:py-4 font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-white/50"
						onClick={() => window.location.href = loginHref}
					>
						{t("join.cta")}
					</button>
				</div>

			</div>
		</div>
	);
}