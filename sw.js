// 📱 Service worker: guarda la app en el teléfono para que abra rápido y funcione sin internet.
// Cuando cambies archivos, sube el número de versión para que el celular descargue lo nuevo.
const CACHE = "everyday-english-v11"; // nombre interno: no cambiarlo, solo subir el número
const FILES = [
  "app.html", "manifest.json", "icon.svg", "css/styles.css",
  "js/data/phrases.js", "js/data/verbs.js", "js/data/grammar.js", "js/data/speaking.js",
  "js/core.js", "js/checker.js", "js/quiz.js", "js/main.js",
  "js/sections/home.js", "js/sections/phrases.js", "js/sections/verbs.js", "js/sections/practice.js",
  "js/sections/listening.js", "js/sections/speaking.js", "js/sections/conversation.js",
  "js/sections/grammar.js", "js/sections/progress.js", "js/sections/tutor.js",
  "js/data/games.js", "js/sections/games.js", "index.html",
  "js/data/past.js", "js/sections/past.js", "js/data/ar.js", "js/i18n.js",
  "js/data/topics.js", "js/data/paul.js", "js/sections/topics.js",
];

self.addEventListener("install", (e) => {
  // "reload" = descargar del servidor, nunca de una copia vieja del navegador
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: "reload" })))));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
// Primero intenta internet (para tener lo último); si no hay, usa la copia guardada
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  // Las APIs externas (Claude, ElevenLabs) nunca se guardan en caché
  if (/api\.anthropic\.com|api\.elevenlabs\.io/.test(e.request.url)) return;
  // Archivos de la app: siempre preguntar al servidor si hay versión nueva ("no-cache")
  const sameOrigin = new URL(e.request.url).origin === self.location.origin;
  const fresh = sameOrigin ? fetch(e.request.url, { cache: "no-cache", credentials: "same-origin" }) : fetch(e.request);
  e.respondWith(
    fresh
      .then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
        return res;
      })
      // Sin internet: usa la copia guardada. Si no hay copia, reintenta la descarga una vez
      .catch(() => caches.match(e.request).then((cached) => cached || fetch(e.request)))
  );
});
