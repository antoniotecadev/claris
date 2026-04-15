import Image from 'next/image'
import Link from 'next/link'
import icon from "@/assets/images/logo.png"

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
        hover:text-[#4F46E5]
        hover:border-[#4F46E5]
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
            <header className=' bg-white text-black py-4 border-b-[1px] border-zinc-200  shadow-2xl '>
                <nav className='flex justify-between items-center container mx-auto' >

                    <Image src={icon} alt='Logo' width={50} />

                    <div className='flex gap-6'>
                        <NavLink href='#first'>Funcionalidades</NavLink>
                        <NavLink href='#second'>Preços</NavLink>
                        <NavLink href='#third'>Sobre</NavLink>
                    </div>
                    <div>
                        <button id="button">
                            Começar
                        </button>
                    </div>
                </nav>
            </header>
        </>
    )
}