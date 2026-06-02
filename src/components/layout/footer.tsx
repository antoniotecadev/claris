"use client";

import Link from "next/link";
import { addLocaleToPathname } from "@/i18n/routing";
import { useMessages } from "@/i18n/messages";

export default function Footer() {
    const { locale, t } = useMessages();
    const privacyHref = addLocaleToPathname("/politica-privacidade", locale);
    const termsHref = addLocaleToPathname("/termos-condicoes", locale);
    const supportHref = addLocaleToPathname("/contacto-suporte", locale);

    return (
        <footer className="bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4 md:px-6 pt-8 md:pt-12 pb-4 md:pb-6">
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    
                    {/* Logo + descrição */}
                    <div>
                        <h2 className="text-slate-900 dark:text-white font-bold text-lg">
                            Claris
                        </h2>
                        <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                            {t("footer.description")}
                        </p>
                    </div>

       
                    <div>
                        <h3 className="font-semibold text-[#1A365D] mb-3">
                            {t("footer.legalTitle")}
                        </h3>
                        <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                            <li>
                                <Link className="hover:text-[#1A365D]" href={privacyHref}>
                                    {t("footer.privacy")}
                                </Link>
                            </li>
                            <li>
                                <Link className="hover:text-[#1A365D]" href={termsHref}>
                                    {t("footer.terms")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>{t("footer.rights")}</p>

                    <Link
                        className="text-[#2B3EA2] mt-4 md:mt-0 font-medium hover:underline"
                        href={supportHref}
                    >
                        {t("footer.support")}
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