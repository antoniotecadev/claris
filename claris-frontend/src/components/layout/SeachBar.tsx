"use client";

import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useMessages } from "@/i18n/messages";

export default function SearchBar() {
  const { t } = useMessages();
  return (
    <div className="flex w-full max-w-5xl flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center">
      
      <div className="flex min-w-0 flex-[1.5] items-center px-3">
        {/* Ícone de Busca limpo e estilizado com Tailwind */}
        <Search className="mr-3 h-5 w-5 shrink-0 text-[#1E3A8A]" />
        
        <input 
          type="text" 
          placeholder={t("search.placeholder")} 
          className="h-11 min-w-0 w-full bg-transparent text-sm text-brand-primary outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="hidden min-w-[50px] flex-1 sm:block" />

      <button className="flex h-11 items-center justify-center rounded-2xl bg-slate-50 px-4 text-sm font-semibold text-brand-muted transition-colors hover:bg-slate-100">
        {/* Substituindo também o ícone do botão de filtros por um limpo */}
        <SlidersHorizontal className="mr-2 h-4 w-4 text-[#1E3A8A]" />
        {t("search.filters")}
      </button>

      <button className="h-11 rounded-2xl bg-brand-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1E3A8A]">
        {t("search.explore")}
      </button>

    </div>
  );
}
