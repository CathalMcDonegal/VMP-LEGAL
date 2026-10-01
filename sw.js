const CACHE = 'legal-v9';
const ASSETS = [
  './', './index.html', './manifest.json', './logo.jpg', './icon-192.png', './icon-512.png',
    './home-splash.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(async cache => {
    for (const asset of ASSETS) {
      try { await cache.add(asset); } catch (err) { console.warn('[SW] No s\'ha pogut cachejar', asset, err); }
    }
    await self.skipWaiting();
  }));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request).catch(() => caches.match('./index.html'))));
});
