"use client";

import { ArrowRight } from "lucide-react";
import { useMessages } from "@/i18n/messages";


interface CommunityCardProps {
  name: string;
  local: string;
  logoUrl: string | null;
  membersCount: number;
  responsable?: string;

  onClick: () => void;
  className?: string;

}


export default function CommunityCard({
  name,
  local,
  logoUrl,
  membersCount,
  responsable = "Comunidade",
  onClick,
  className = '',
}: CommunityCardProps) {
  const { t } = useMessages();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={`${t("community.enter")} ${name}`}
      className={`bg-white w-148 h-63.5 rounded-lg shadow-md  cursor-pointer flex ${className}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div className="w-73.75 ">
        {logoUrl ? (
          <img src={logoUrl} alt={`${name} logo`} className="w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="w-73.75 h-full bg-gray-200 flex items-center justify-center rounded-lg">
            <span className="text-gray-500">{t("community.noLogo")}</span>
          </div>
        )}
      </div>
      <div className="w-73.75  flex flex-col p-8 justify-between">
        <div className="flex flex-col">
          <p className="text-sm text-[#1A1C1C] uppercase tracking-wide text-[10px]">{responsable}</p>
          <h3 className="text-lg font-bold text-[#002045] text-[24px]">{name}</h3>
          <p className="text-[#475F83] text-[14px]">{local  }</p>
        </div>
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-500">{membersCount} {t("community.members")}</span>
          <button
            type="button"
            className="flex items-center text-[#1E3A8A] p-2 hover:rounded-2xl cursor-pointer   hover:bg-[#1E3A8A] hover:text-white"
            onClick={(event) => {
              event.stopPropagation();
              onClick();
            }}
            aria-label={`${t("community.enter")} ${name}`}
          >
            <span className="text-sm ">{t("community.enter")}</span>
            <ArrowRight size={16} className=" ml-1" />
          </button>
        </div>
      </div>
    </article>
  )
}
