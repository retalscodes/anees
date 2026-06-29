const CACHE_NAME = 'anees-v9';
const QURAN_CACHE = 'anees-quran-v1'; // Quran text never changes — keep forever

const SHELL = [
  '/', '/index.html', '/css/app.css', '/manifest.json',
  '/data/athkar.js', '/data/duas.js', '/data/names.js',
  '/js/app.js', '/js/prayer.js', '/js/dhikr.js',
  '/js/quran.js', '/js/more.js', '/js/profile.js',
  '/icons/icon-192.png', '/icons/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== QURAN_CACHE)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  const { pathname } = url;

  // ── External Quran API: cache-first forever (text never changes) ──
  if (url.hostname === 'api.alquran.cloud') {
    e.respondWith(
      caches.open(QURAN_CACHE).then(cache =>
        cache.match(e.request).then(cached => {
          if (cached) return cached;
          return fetch(e.request).then(r => {
            if (r.ok) cache.put(e.request, r.clone());
            return r;
          }).catch(() => new Response(
            JSON.stringify({ code: 200, status: 'OK', data: { ayahs: [], offline: true } }),
            { headers: { 'Content-Type': 'application/json' } }
          ));
        })
      )
    );
    return;
  }

  // ── Internal prayer API: stale-while-revalidate (show cached, update in background) ──
  if (pathname.startsWith('/api/prayer') || pathname.startsWith('/api/hadith')) {
    e.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(e.request).then(cached => {
          const networkFetch = fetch(e.request).then(r => {
            if (r.ok) cache.put(e.request, r.clone());
            return r;
          }).catch(() => null);
          // Return cached immediately if available; otherwise wait for network
          return cached || networkFetch;
        })
      )
    );
    return;
  }

  // ── Other /api/ calls: network only (Q&A needs live Gemini) ──
  if (pathname.startsWith('/api/')) {
    e.respondWith(fetch(e.request).catch(() =>
      new Response(
        JSON.stringify({ error: 'offline', ar: 'أنت غير متصل بالإنترنت. هذه الميزة تحتاج اتصالًا.', en: 'You are offline. This feature requires an internet connection.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      )
    ));
    return;
  }

  // ── JS files: network-first, cache fallback ──
  if (pathname.startsWith('/js/') || pathname.startsWith('/css/') || pathname.startsWith('/data/')) {
    e.respondWith(
      fetch(e.request)
        .then(r => {
          if (r.ok) {
            const clone = r.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          }
          return r;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // ── Everything else: cache-first, network fallback ──
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
