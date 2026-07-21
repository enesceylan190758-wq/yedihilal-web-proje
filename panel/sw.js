/* YediHilal Panel — PWA service worker */
const CACHE = "yh-panel-v14";
const SHELL = [
  "/panel/",
  "/panel/index.html",
  "/panel/manifest.webmanifest",
  "/panel/icons/icon-192.png",
  "/panel/icons/icon-512.png",
  "/panel/icons/apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if(req.method !== "GET") return;
  const url = new URL(req.url);
  if(url.origin !== self.location.origin) return;
  /* Panel sayfası: ağ öncelikli, offline’da cache */
  if(url.pathname === "/panel/" || url.pathname === "/panel/index.html"){
    event.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put("/panel/", copy));
        return res;
      }).catch(() => caches.match("/panel/").then(r => r || caches.match("/panel/index.html")))
    );
    return;
  }
  /* İkon / manifest: cache-first */
  if(url.pathname.startsWith("/panel/icons/") || url.pathname.endsWith("manifest.webmanifest") || url.pathname.endsWith("/sw.js")){
    event.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return res;
      }))
    );
  }
};
