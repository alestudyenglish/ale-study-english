// 📱 Service worker: guarda la app en el teléfono para que abra rápido y funcione sin internet.
// Cuando cambies archivos, sube el número de versión para que el celular descargue lo nuevo.
const CACHE = "everyday-english-v4"; // nombre interno: no cambiarlo, solo subir el número
const FILES = [
  "app.html", "manifest.json", "icon.svg", "css/styles.css",
  "js/data/phrases.js", "js/data/verbs.js", "js/data/grammar.js", "js/data/speaking.js",
  "js/core.js", "js/checker.js", "js/quiz.js", "js/main.js",
  "js/sections/home.js", "js/sections/phrases.js", "js/sections/verbs.js", "js/sections/practice.js",
  "js/sections/listening.js", "js/sections/speaking.js", "js/sections/conversation.js",
  "js/sections/grammar.js", "js/sections/progress.js", "js/sections/tutor.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
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
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
