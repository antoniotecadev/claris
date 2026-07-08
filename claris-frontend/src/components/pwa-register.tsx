"use client";

import { useEffect } from "react";

export function PwaRegister() {
	useEffect(() => {
		if (!("serviceWorker" in navigator)) return;

		const registerServiceWorker = async () => {
			try {
				const registration = await navigator.serviceWorker.register("/sw.js", {
					scope: "/",
				});

				// Se houver um service worker esperando para activar, envie uma mensagem para ele pular a espera e activar imediatamente
				if (registration.waiting) {
					registration.waiting.postMessage({ type: "SKIP_WAITING" });
				}
			} catch (error) {
				console.warn("Service worker registration failed", error);
			}
		};

		// Se a página já estiver carregada, registre o service worker imediatamente
		if (document.readyState === "complete") {
			void registerServiceWorker();
			return;
		}

		// Caso contrário, registre o service worker quando a página carregar
		window.addEventListener("load", registerServiceWorker);

		return () => {
			// Remover o listener de evento quando o componente for desmontado
			window.removeEventListener("load", registerServiceWorker);
		};
	}, []);

	return null;
}
