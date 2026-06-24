"use client";

import { useMessages } from "@/i18n/messages";

export default function Conf() {
	const { t } = useMessages();

	return (
		<div className="bg-[#f2f4f6] dark:bg-[#b3c9e7] py-12">
			<div className="container mx-auto px-4">

				<nav className="flex flex-col items-center justify-center space-y-8">

					<h3 className="text-[#1A365D] text-sm md:text-base uppercase tracking-wide text-center">
						{t("trust.title")}
					</h3>

					<div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[#1A365D] text-sm md:text-base font-semibold text-center">
						<h6>MONTE DA GRAÇA</h6>
						<h6>VIDEIRA &amp; RAMO</h6>
						<h6>O POÇO</h6>
						<h6>CIDADE DA MISERICÓRDIA</h6>
						<h6>IGREJA LEGADO</h6>
					</div>

				</nav>

			</div>
		</div>
	);
}