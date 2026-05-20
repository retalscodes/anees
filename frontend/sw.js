const CACHE_NAME = 'anees-v7';
const SHELL = ['/', '/index.html', '/css/app.css', '/data/athkar.js', '/data/duas.js', '/data/names.js'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => clients.forEach(c => c.navigate(c.url)))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { pathname } = new URL(e.request.url);

  // API: network only, no caching
  if (pathname.startsWith('/api/')) {
    e.respondWith(fetch(e.request));
    return;
  }

  // JS files: always network-first so updates deploy instantly
  if (pathname.startsWith('/js/')) {
    e.respondWith(
      fetch(e.request)
        .then(r => {
          const clone = r.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          return r;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Everything else: cache-first with network fallback
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(r => {
        if (r.ok) {
          const clone = r.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return r;
      })
    )
  );
});
