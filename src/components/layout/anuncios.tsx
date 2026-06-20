"use client";

import { useMessages } from "@/i18n/messages";

export default function AnnouncementCard() {
  const { t } = useMessages();
  return (
    <div
      className="
        w-76
        rounded-2xl
        bg-[#17386A]
        p-6
        text-white
        shadow-lg
		 mt-10
		h-140
      "
    >
      <h2 className="text-[20px] font-bold">
        {t("community.announcements.title")}
      </h2>

      <p className="mt-4 text-sm leading-6 text-[#A9B5CC]">
        {t("community.announcements.description")}
      </p>

      <div
        className="
          mt-6
          h-40
          rounded-2xl
          bg-[#27497E]
          p-4
		  mb-3
        "
      >
        <textarea
          placeholder={t("community.announcements.placeholder")}
          className="
            h-full
            w-full
            resize-none
            bg-transparent
            text-sm
            text-white
            placeholder:text-[#8FA2C3]
            outline-none
          "
        />
      </div>

      <div className="mt-5 flex items-center gap-2">
        <div
          className="
            flex
            h-5
            w-5
            items-center
            justify-center
            rounded-full
            border
            border-[#F7D18A]
            text-[11px]
            text-[#F7D18A]
          "
        >
          i
        </div>

        <span className="text-[12px] text-[#A9B5CC]">
          {t("community.announcements.deviceCount", { count: 1240 })}
        </span>
      </div>

      <button
        className="
          mt-5
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-[#F3D295]
          py-3
          text-[12px]
          font-bold
          uppercase
          tracking-widest
          text-[#1B2C45]
          transition
          hover:opacity-90
        "
      >
        <span>➤</span>
        {t("community.announcements.send")}
      </button>
    </div>
  );
}