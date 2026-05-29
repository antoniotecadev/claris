"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { addLocaleToPathname } from "@/i18n/routing";
import { useMessages } from "@/i18n/messages";

export default function CallbackPage() {
  const { locale, t } = useMessages();
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      fetch("/api/auth/set-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }).then(() => router.replace(addLocaleToPathname("/mainDash", locale)));
    }
  }, [router, locale]);

  return <p>{t("auth.callback.authenticating")}</p>;
}