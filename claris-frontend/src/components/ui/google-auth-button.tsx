"use client";

import { useEffect } from "react";
import Image from "next/image";
import Google from "@/assets/images/SVG.png";

interface GoogleAuthButtonProps {
  text: string;
  id?: string;
}

export function GoogleAuthButton({ text, id }: GoogleAuthButtonProps) {

  useEffect(() => {
    // Escuta a mensagem vinda do popup do Google
    const handleAuthMessage = (event: MessageEvent) => {
      // Segurança: Garante que a mensagem veio do seu próprio backend
      if (event.origin !== "http://localhost:3001") return;

      if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
        const token = event.data.token;

        // Redireciona a janela principal para a sua rota de callback atual que já lida com o token!
        window.location.href = `/auth/google/callback#token=${encodeURIComponent(token)}`;
      }

      if (event.data.type === "GOOGLE_AUTH_ERROR") {
        window.location.href = "/auth/google/error";
      }
    };

    window.addEventListener("message", handleAuthMessage);
    return () => window.removeEventListener("message", handleAuthMessage);
  }, []);

  const handleGoogleLogin = (e: React.MouseEvent) => {
    e.preventDefault();

    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const url = "http://localhost:3001/api/v1/auth/google";

    window.open(
      url,
      "GoogleAuthPopup",
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
    );
  };

  return (
    <button
      onClick={handleGoogleLogin}
      id={id}
      type="button"
      className="mb-5 flex w-full items-center justify-center gap-2.5 rounded-[14px] border border-slate-200/80 bg-white/85 px-4 py-3 text-sm font-medium text-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] active:translate-y-0 active:scale-[0.98] dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/8"
    >
      <Image src={Google} alt="Google" width={18} height={18} />
      <span>{text}</span>
    </button>
  );
}