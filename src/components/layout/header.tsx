'use client'

import Image from 'next/image'
import Link from 'next/link'
import icon from "@/assets/images/logo.png"
import { Menu, X } from 'lucide-react';
import { useState } from 'react';


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

			<header className=' bg-white text-black py-4 border-b-2 border-zinc-200  shadow-2xl '>
				<nav className='flex justify-between items-center container mx-auto px-4 sm:px-0' >
					<div className='flex justify-center items-center gap-4'>
						<Image src={icon} alt='Logo' width={50} />
						<h1 className=" sm:hidden text-2xl">CLARIS</h1>
					</div>

					<div className='hidden  sm:flex gap-6 '>
						<NavLink href='#first'>Funcionalidades</NavLink>
						<NavLink href='#preco'>Preços</NavLink>
						<NavLink href='#third'>Sobre</NavLink>
					</div>

					<div className='flex flex-col'>
						<button className="hidden px-10 py-3 text-[#261900] smrounded-xl bg-[#FFDEA5] sm:flex">
							Começar
						</button>
					</div>
				</nav>
			</header>



		</>
	)
}