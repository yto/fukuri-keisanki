const CACHE = 'fukuri-v2';
const ASSETS = [
  './compound-interest.html',
  './manifest.json',
  './icon.svg',
  'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.endsWith('.html')) {
    // HTMLは常にネットワーク優先（オフライン時のみキャッシュにフォールバック）
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
  } else {
    // その他（JS・アイコンなど）はキャッシュ優先
    e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request)));
  }
});
