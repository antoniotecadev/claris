import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white">
            <div className="container mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-4 md:pb-6">
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    
                    {/* Logo + descrição */}
                    <div>
                        <h2 className="text-[#1A365D] font-bold text-lg">
                            Claris
                        </h2>
                        <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                            Empoderando igrejas modernas com tecnologia pensada
                            para comunidade e crescimento.
                        </p>
                    </div>

       
                    <div>
                        <h3 className="font-semibold text-[#1A365D] mb-3">
                            Legal
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>
                                <Link className="hover:text-[#1A365D]" href="/politica-privacidade">
                                    Política de Privacidade
                                </Link>
                            </li>
                            <li>
                                <Link className="hover:text-[#1A365D]" href="/termos-condicoes">
                                    Termos e Condições
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© 2026 Claris. Todos os direitos reservados.</p>

                    <Link
                        className="text-[#2B3EA2] mt-4 md:mt-0 font-medium hover:underline"
                        href="/contacto-suporte"
                    >
                        Contactar Suporte
                    </Link>
                </div>
                <div className="mt-12 overflow-hidden">
                    <h1 className="text-[12vw] font-bold text-gray-100 leading-none select-none text-center tracking-tighter">
                        Claris
                    </h1>
                </div>
            </div>
        </footer>
    );
}