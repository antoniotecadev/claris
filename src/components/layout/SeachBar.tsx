import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react'; // Importa os ícones limpos

export default function SearchBar() {
  return (
    <div className="flex items-center w-full max-w-5xl bg-white p-3 rounded-2xl shadow-xl border border-gray-100">
      
      <div className="flex items-center flex-[1.5] px-3">
        {/* Ícone de Busca limpo e estilizado com Tailwind */}
        <Search className="w-5 h-5 text-gray-400 mr-3" />
        
        <input 
          type="text" 
          placeholder="Buscar por nome do evento, tema ou local..." 
          className="w-full text-sm text-gray-600 bg-transparent outline-none placeholder-gray-400"
        />
      </div>

      <div className="flex-1 min-w-[50px]" />

      <button className="flex items-center bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium text-sm px-4 py-2.5 rounded-xl mx-2 transition-colors">
        {/* Substituindo também o ícone do botão de filtros por um limpo */}
        <SlidersHorizontal className="w-4 h-4 mr-2 text-gray-500" />
        Filtros
      </button>

      <button className="bg-[#001D4A] hover:bg-[#002d72] text-white font-medium text-sm px-6 py-2.5 rounded-xl transition-colors">
        Explorar
      </button>

    </div>
  );
}
