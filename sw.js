// Netz zuerst, Speicher als Ersatz: Mit Internet lädt die App immer die neuste
// index.html und lieder.txt. Ohne Internet nimmt sie die zuletzt gespeicherte Fassung.
const CACHE = "xylophon";
const FILES = ["./", "./index.html", "./lieder.txt", "./manifest.webmanifest",
  "./apple-touch-icon.png", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res && (res.ok || res.type === "opaque")) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request, {ignoreSearch: true})
      .then(hit => hit || caches.match("./index.html")))
  );
});
