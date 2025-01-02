const CACHE_NAME = "pwa-cache-v2";  // Increment version to force update
const urlsToCache = [
  "/",
  "/index.html",
  "/page1.html",
  "/style.css",
  "/bigIcon.png",
  "/favicon.ico"
];
// Note that this is coded to minimise caching. This decreases performance but makes debugging easier
self.addEventListener("install", event => {
  // Immediately activate the service worker without caching anything
  self.skipWaiting();
  console.log("Service Worker installed. No caching performed.");
});
// Activate event - Clean up old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cache => cache !== CACHE_NAME)
        .map(cache => caches.delete(cache))
      );
    }).then(() => {
      console.log("Old caches cleared");
      return self.clients.claim();
    })
  );
});
// Fetch event - Serve from cache or fallback to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // Fallback to index.html for navigation requests
        if (event.request.mode === "navigate") {
          return caches.match("/index.html");
        }
      });
    })
  );
});