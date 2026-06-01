import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-4 md:pb-6">
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    
                    {/* Logo + descrição */}
                    <div>
                        <h2 className="text-slate-900 dark:text-white font-bold text-lg">
                            Claris
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm leading-relaxed">
                            Empoderando igrejas modernas com tecnologia pensada
                            para comunidade e crescimento.
                        </p>
                    </div>

       
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                            Legal
                        </h3>
                        <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <li>
                                <Link className="hover:text-slate-900 dark:hover:text-white" href="/politica-privacidade">
                                    Política de Privacidade
                                </Link>
                            </li>
                            <li>
                                <Link className="hover:text-slate-900 dark:hover:text-white" href="/termos-condicoes">
                                    Termos e Condições
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
                    <p>© 2026 Claris. Todos os direitos reservados.</p>

                    <Link
                        className="mt-4 md:mt-0 font-medium text-sky-700 hover:underline dark:text-sky-300"
                        href="/contacto-suporte"
                    >
                        Contactar Suporte
                    </Link>
                </div>
                <div className="mt-12 overflow-hidden">
                    <h1 className="text-[12vw] font-bold text-slate-200/80 leading-none select-none text-center tracking-tighter dark:text-white/5">
                        Claris
                    </h1>
                </div>
            </div>
        </footer>
    );
}