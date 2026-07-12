const CACHE_VERSION = "claris-pwa-v1";
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const PUBLIC_ROUTES = [
	"/",
	"/contacto-suporte",
	"/politica-privacidade",
	"/termos-condicoes",
	"/pt",
	"/pt/contacto-suporte",
	"/pt/politica-privacidade",
	"/pt/termos-condicoes",
	"/en",
	"/en/contacto-suporte",
	"/en/politica-privacidade",
	"/en/termos-condicoes",
	"/fr",
	"/fr/contacto-suporte",
	"/fr/politica-privacidade",
	"/fr/termos-condicoes",
];
const PRECACHE_URLS = [
	"/offline",
	"/manifest.webmanifest",
	"/favicon.ico",
	"/favicon-16x16.png",
	"/favicon-32x32.png",
	"/apple-touch-icon.png",
	"/android-chrome-192x192.png",
	"/android-chrome-512x512.png",
	...PUBLIC_ROUTES,
];

// Intalar o service worker e pré-carregar os recursos
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(CACHE_VERSION)
			.then((cache) =>
				Promise.allSettled(
					PRECACHE_URLS.map(async (url) => {
						const response = await fetch(url);
						if (response.ok) {
							await cache.put(url, response);
						}
					}),
				),
			)
			.then(() => self.skipWaiting()),
	);
});

// Activar o service worker e limpar caches antigos
self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) =>
				Promise.all(
					cacheNames
						.filter((cacheName) => !cacheName.startsWith(CACHE_VERSION))
						.map((cacheName) => caches.delete(cacheName)),
				),
			)
			.then(() => self.clients.claim()),
	);
});

// Escutar mensagens do cliente para actualizar o service worker
self.addEventListener("message", (event) => {
	// Se a mensagem for do tipo "SKIP_WAITING", chamar self.skipWaiting() para activar imediatamente o novo service worker
	if (event.data?.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});

// Interceptar pedidos de rede e servir recursos do cache ou da rede
self.addEventListener("fetch", (event) => {
	const { request } = event;
	const requestUrl = new URL(request.url);

	// Ignorar pedidos que não sejam GET ou que não sejam do mesmo domínio
	if (request.method !== "GET" || requestUrl.origin !== self.location.origin) {
		return;
	}

	// Ignorar pedidos para a API
	if (requestUrl.pathname.startsWith("/api/")) {
		return;
	}

	// Ignorar recursos internos do Next.js
	// Não deixar o Service Worker controlar imagens optimizadas,
	// chunks JS, CSS e Hot Reload do Next
	if (
		requestUrl.pathname.startsWith("/_next/") ||
		requestUrl.pathname.startsWith("/webpack-hmr")
	) {
		return;
	}

	// Para pedidos de navegação, usar a estratégia "network first"
	// request.mode === "navigate": Indica que o pedido é para uma navegação de página (por exemplo, quando o usuário clica em um link ou digita uma URL no navegador).
	// networkFirstNavigation: Serve o recurso da rede se estiver disponível, caso contrário, serve o recurso do cache. Se ambos falharem, serve a página offline.
	if (request.mode === "navigate") {
		event.respondWith(networkFirstNavigation(request, requestUrl.pathname));
		return;
	}

	// Para outros pedidos, usar a estratégia "stale while revalidate" para recursos estáticos
	// Isso inclui CSS, JS, fontes, imagens e recursos do Next.js
	// staleWhileRevalidate: Serve o recurso do cache se estiver disponível, mas também faz uma requisição de rede em segundo plano para actualizar o cache com a versão mais recente do recurso.
	if (
		request.destination === "style" ||
		request.destination === "script" ||
		request.destination === "font" ||
		request.destination === "image" ||
		requestUrl.pathname.startsWith("/_next/static/")
	) {
		event.respondWith(staleWhileRevalidate(request));
	}
});

// Função para a estratégia "network first" para pedidos de navegação
async function networkFirstNavigation(request, pathname) {
	try {
		const response = await fetch(request);
		if (response.ok && isCacheableNavigation(pathname)) {
			const cache = await caches.open(RUNTIME_CACHE);
			cache.put(request, response.clone()).catch(() => undefined);
		}
		return response;
	} catch {
		const cachedResponse = await caches.match(request);
		return cachedResponse || caches.match("/offline");
	}
}

function isCacheableNavigation(pathname) {
	return PUBLIC_ROUTES.includes(pathname);
}


// Função para a estratégia "stale while revalidate" para recursos estáticos
async function staleWhileRevalidate(request) {
	const cache = await caches.open(RUNTIME_CACHE);
	const cachedResponse = await cache.match(request);
	try {
		const networkResponse = await fetch(request);

		if (networkResponse.ok) {
			await cache.put(request, networkResponse.clone());
		}

		return cachedResponse || networkResponse;
	} catch {
		return (
			cachedResponse ||
			(await caches.match("/offline")) ||
			new Response("", {
				status: 503,
				statusText: "Service Unavailable",
			})
		);
	}
}
