// public/service-worker.js

const CACHE_NAME = "rudra-chat-v1";
const URLS_TO_CACHE = [
  "/",              // your index.html
  "/index.html",
  "/logo192.png",
  "/logo512.png",

  // replace the .ico with the three PNG favicons:
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/favicon-64x64.png",

  "/manifest.json",
  // …any other static assets you need…
];

// install handler: pre-cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
});

// activate: clean up old caches if needed
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((old) => caches.delete(old))
      )
    )
  );
});

// fetch handler: serve from cache first
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((hit) => hit || fetch(event.request))
  );
});
