// Only images are cached: pages, videos and downloads always use normal networking.
const CACHE = 'beyond-factory-images-v1';
const LIMIT = 90;
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
 const url = new URL(event.request.url);
 if (event.request.method !== 'GET' || url.origin !== self.location.origin || !/\.webp$/.test(url.pathname) || url.search) return;
 event.respondWith((async () => {
  let cache;
  try { cache = await caches.open(CACHE); const saved = await cache.match(event.request); if (saved) return saved; } catch {}
  const response = await fetch(event.request);
  if (response.ok && cache) {
   const savedResponse = response.clone();
   event.waitUntil((async()=>{try{await cache.put(event.request,savedResponse);const keys=await cache.keys();for(const key of keys.slice(0,Math.max(0,keys.length-LIMIT)))await cache.delete(key)}catch{}})());
  }
  return response;
 })());
});
