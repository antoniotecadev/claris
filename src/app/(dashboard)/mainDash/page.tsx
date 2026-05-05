"use client"
import Image from 'next/image'
import icon from "@/assets/images/logoSem.png"
import Link from 'next/link'
import { Search, Bell, Settings } from "lucide-react";
import CommunityCard from '@/components/layout/commityCard';
import heroImg from "@/assets/images/create.png";

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
        hover:text-[#D97706] hover:font-bold
        hover:border-[#D97706]
        transition-all duration-300
		text-center
    
        ${className}
      `}
		>
			{children}
		</Link>
	)
}

export default function MainDash() {
	return (
		<div className="bg-white   ">
			<div className="container m-auto   ">
				<div className="">
					<header className="flex gap-4 justify-between py-3   border-b border-zinc-200">
						<div className="items-center justify-center flex gap-9 ">
							<div className='flex justify-center items-center gap-2'>
								<Image src={icon} alt='Logo' width={30} />
								<h1 className="  text-2xl text-[#1E3A8A]">CLARIS</h1>
							</div>
							<div className='hidden  sm:flex gap-6 '>
								<NavLink href='#first'>Descobrir</NavLink>
								<NavLink href='#preco'>Minha igreja</NavLink>
								<NavLink href='#third'>Comunidade</NavLink>
							</div>
						</div>
						<div className="flex justify-between gap-3 ">
							<div className='flex bg-[#F3F3F3] rounded-2xl p-2 text-[#74777F]'>
								<Search size={14} className='  w-6 p-1  h-6 bg-[#F3F3F3] ' />
								<input type="text" placeholder='encontrar a tua igreja...' className="bg-[#F3F3F3] w-62.5 h-6 focus:outline-none" />
							</div>
							<div className='flex items-center justify-center'>
								<Bell size={14} className='text-[#1E3A8A] w-6 h-7' />
							</div>
							<div className='flex items-center justify-center'>
								<Settings size={14} className='text-[#1E3A8A] w-6 h-7' />
							</div>
							<div className='flex items-center justify-center'>
								<div className='w-8 h-8 bg-[#1E3A8A] rounded-2xl'>

								</div>
							</div>

						</div>
					</header>
					<nav className='flex flex-col mt-10'>
						<p className='text-[#1A1C1C] tracking-wide text-[12px]'>BEM VINDO DE VOLTA</p>
						<p className='text-[#002045]  text-[72px] font-bold'>Escolhe a sua<br />Igreja</p>
						<div className='flex items-center justify-between'>
							<p className='text-[#475F83] text-[20px] w-120'>Reconecte-se com o seu lar espiritual ou explore novas comunidades de fé e devoção.</p>
							<div className='flex  bg-[#F3F3F3] rounded-2xl p-1 text-[#74777F] items-center justify-center'>
								<input type="text" placeholder='encontrar a tua igreja...' className="bg-[#F3F3F3] w-62.5 h-5.6 focus:outline-none px-2" />
								<button className='bg-[#1E3A8A] text-white rounded-2xl px-4 py-2 ml-2'>Pesquisar</button>
							</div>
						</div>
						<div className='flex mt-10 items-center justify-center'>
							<p className='text-[#002045]  w-40 mr-1'>MINHAS IGREJAS</p>
							<div className='h-px bg-zinc-400 w-full'></div>
						</div>
						<div className='flex overflow-scroll gap-8 py-3'>
							<CommunityCard name='Igreja Batista' description='Uma comunidade de fé e amor' logoUrl={null} membersCount={120} responsable='Pastor João' onClick={() => { }} />
							<CommunityCard name='Igreja Católica' description='Uma comunidade de fé e amor' logoUrl={null} membersCount={120} responsable='Pastor João' onClick={() => { }} />
							<CommunityCard name='Igreja Adventista' description='Uma comunidade de fé e amor' logoUrl={null} membersCount={120} responsable='Pastor João' onClick={() => { }} />
							<CommunityCard name='Igreja Presbiteriana' description='Uma comunidade de fé e amor' logoUrl={null} membersCount={120} responsable='Pastor João' onClick={() => { }} />
						</div>
						<section
							style={{
								backgroundImage: `linear-gradient(
                   to right, 
				    rgba(26, 54, 93, 0.98) 10%, 
				    rgba(26, 54, 93, 0.80) 50%, 
				    rgba(26, 54, 93, 0.60) 100%
                ), url(${heroImg.src})`
							}}
							className="bg-white bg-center bg-cover mt-10 mb-10 rounded-2xl flex flex-col justify-between p-20"
						>
							<div className='flex flex-col'>
							<p className='text-white text-4xl italic'>Manifesta a tua visão</p>
							<p className='text-[#DBEAFE] w-120 mt-4 '>
								Crie a sua igreja e comece hoje a construir uma comunidade de fé vibrante
								e acolhedora, capacitada com ferramentas que organizam, conectam e fortalecem a comunhão.
								‘Pois onde dois ou três estiverem reunidos em meu nome, ali estou no meio deles.
								(Mateus 18:20)
							</p>
							</div>
							<button className='bg-[#FFDEA5] text-[#261900]  w-60  rounded-2xl px-4 py-3 mt-12 cursor-pointer'>Criar Igreja</button>
						</section>
						<div className='flex justify-between items-center'>
							<p className='text-[#002045]  w-40 mr-1'>DESCUBRIR IGREJAS</p>
							<div className='h-px bg-zinc-400 w-full'></div>
						</div>
						<div className='flex overflow-scroll gap-8 py-3'>
							
						</div>

					</nav>

				</div>
			</div>
		</div>
	)
}