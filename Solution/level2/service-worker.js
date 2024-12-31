const CACHE_NAME = "pwa-cache-v2";  // Increment version to force update
const urlsToCache = [
  "/",
  "/index.html",
  "/page1.html",
  "/style.css",
  "/bigIcon.png",
  "/favicon.ico"
];

// Install event - Cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        urlsToCache.map(url => {
          return fetch(url).then(response => {
            if (!response.ok) {
              throw new Error(`Failed to fetch ${url}, Status: ${response.status}`);
            }
            return cache.put(url, response);
          }).catch(err => {
            console.warn(`Failed to cache ${url}:`, err);
          });
        })
      );
    }).then(() => {
      console.log("All resources cached successfully");
      return self.skipWaiting();
    }).catch(err => {
      console.error("Caching failed during install:", err);
    })
  );
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
