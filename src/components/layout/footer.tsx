export default function Footer() {
    return (
        <footer className="bg-white ">
            <div className="container mx-auto px-6 pt-12 pb-6"> {/* Ajustei o padding bottom */}
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    
                    {/* Logo + descrição */}
                    <div>
                        <h2 className="text-[#2B3EA2] font-bold text-lg">
                            Claris
                        </h2>
                        <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                            Empoderando igrejas modernas com tecnologia pensada
                            para comunidade e crescimento.
                        </p>
                    </div>

                    {/* Pages */}
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-3">
                            Páginas
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>Produtos</li>
                            <li>Estúdio</li>
                            <li>Clientes</li>
                            <li>Preços</li>
                            <li>Blog</li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-3">
                            Redes
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>Facebook</li>
                            <li>Instagram</li>
                            <li>Twitter</li>
                            <li>LinkedIn</li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-3">
                            Legal
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li>Política de Privacidade</li>
                            <li>Termos de Serviço</li>
                            <li>Cookies</li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© 2026 Claris. Todos os direitos reservados.</p>

                    <button className="text-[#2B3EA2] mt-4 md:mt-0 font-medium hover:underline">
                        Contactar Suporte
                    </button>
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