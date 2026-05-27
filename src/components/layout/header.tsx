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
        text-[#475569]
        border-b-2 border-transparent
        hover:text-[#4F46E5] hover:font-bold
        hover:border-[#FBBF24]
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

			<header className='bg-white text-black py-3 md:py-4 border-b-2 border-zinc-200 shadow-lg sticky top-0 z-40'>
				<nav className='flex justify-between items-center container mx-auto px-4 md:px-6 lg:px-0' >
					<div className='flex justify-center items-center gap-2 md:gap-4'>
						<Link href="#inicio" aria-label="Ir para o início">
							<Image src={icon} alt='Logo' width={40} className="md:w-12" />
						</Link>
					</div>

					<div className='hidden md:flex gap-4 lg:gap-6'>
						<NavLink href='#funcionalidades'>Funcionalidades</NavLink>
						<NavLink href='#sobre'>Sobre</NavLink>
					</div>

					<div className='flex gap-2'>
						<button className="px-2 md:px-6 py-2 md:py-2 text-[#261900] rounded-lg md:rounded-2xl bg-[#FFDEA5] text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-[#FFDEA5]/50" onClick={() => window.location.href = '/login'}>
							Começar
						</button>
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