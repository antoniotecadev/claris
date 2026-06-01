'use client'

import Image from 'next/image'
import Link from 'next/link'
import icon from "@/assets/images/logo.png"
import LanguageSelector from './LanguageSelector';



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
				hover:text-slate-950 dark:hover:text-white hover:font-semibold
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

	return (
		<>

			<header className='sticky top-0 z-40 border-b border-white/70 bg-white/75 py-3 text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-50'>
				<nav className='flex justify-between items-center container mx-auto px-4 md:px-6 lg:px-0' >
					<div className='flex justify-center items-center gap-2 md:gap-4'>
						<Link href="#inicio" aria-label="Ir para o início">
							<Image src={icon} alt='Logo' width={40} className="md:w-12" />
						</Link>
					</div>

					<div className='hidden md:flex  gap-4 lg:gap-6'>
						<NavLink href='#funcionalidades'>Funcionalidades</NavLink>
						<NavLink href='#sobre'>Sobre</NavLink>
					</div>

					<div className='flex gap-2'>
						<NavLink href='/login' className="rounded-lg md:rounded-2xl border border-amber-200/70 bg-amber-200 px-2 py-2 text-sm font-semibold text-slate-900 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-amber-100 hover:shadow-lg hover:shadow-amber-200/40 dark:border-amber-400/30 dark:bg-amber-300 dark:text-slate-950 dark:hover:bg-amber-200">
							Começar
						</NavLink>
						<LanguageSelector
							currentLocale="pt"
							onLocaleChange={(locale) => {
								// ex: router.push(`/${locale}`)
								console.log("Idioma selecionado:", locale);
							}}
						/>
					</div>
				</nav>
			</header>



		</>
	)
}