export default function AnnouncementCard() {
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
      {/* Title */}
      <h2 className="text-[20px] font-bold">
        Comunicados
      </h2>

      {/* Description */}
      <p className="mt-4 text-sm leading-6 text-[#A9B5CC]">
        Envie mensagens inspiradoras para toda a congregação
        instantaneamente.
      </p>

      {/* Text Area */}
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
          placeholder="Compor nova mensagem..."
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

      {/* Info */}
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
          Envia para 1,240 dispositivos
        </span>
      </div>

      {/* Button */}
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
        ENVIAR AGORA
      </button>
    </div>
  );
}