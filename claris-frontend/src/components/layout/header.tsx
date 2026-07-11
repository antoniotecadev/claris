'use client'

import Link from 'next/link'
import icon from "@/assets/images/logo.png"
import iconDark from "@/assets/images/logoBr.png"
import { addLocaleToPathname } from "@/i18n/routing";
import { useMessages } from "@/i18n/messages";
import LanguageSelector from './LanguageSelector';
import { ModeToggle } from './ModeToggle';



interface NavLinkProps {
	href: string;
	children: React.ReactNode;
	className?: string;
}

function NavLink({ href, children, className }: NavLinkProps) {
	return (
		<Link
			href={href}
			className={`
				text-slate-600 dark:text-slate-300
				border-b-2 border-transparent
				hover:text-slate-950 dark:hover:text-black hover:font-semibold
				hover:border-amber-300
				transition-all duration-300
				hover:scale-105
				active:scale-95

				${className}
			`}
		>
			{children}
		</Link>
	)
}


export default function Header() {
	const { locale, t } = useMessages();
	const loginHref = addLocaleToPathname("/login", locale);

	return (
		<>

			<header className='sticky top-0 z-40 border-b border-white/70 bg-white/75 py-3 text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-50'>
				<nav className='flex justify-between items-center container mx-auto px-4 md:px-6 lg:px-0' >
					<div className='flex justify-center items-center gap-2 md:gap-4'>
						<Link href="#inicio" aria-label="Ir para o início" className="w-10 md:w-12 block">
							<img loading="lazy" src={icon.src} alt='Logo' className="block dark:hidden w-full h-auto" />
							<img loading="lazy" src={iconDark.src} alt='Logo' className="hidden dark:block w-full h-auto" />
						</Link>
					</div>

					<div className='hidden md:flex gap-4 lg:gap-6'>
						<NavLink href='#funcionalidades'>{t("header.features")}</NavLink>
						<NavLink href='#sobre'>{t("header.about")}</NavLink>
					</div>

					<div className='flex gap-2'>
						<NavLink href={loginHref} className="px-2 md:px-6 py-2 md:py-2 dark:text-slate-950/70 text-[#261900] rounded-lg md:rounded-2xl bg-[#FFDEA5] text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-[#FFDEA5]/50">
							{t("header.start")}
						</NavLink>
						<ModeToggle />
						<LanguageSelector />
					</div>
				</nav>
			</header>



		</>
	)
}
