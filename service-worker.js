
const CACHE_NAME = 'stroke-calc-v1';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// ติดตั้ง service worker และเก็บไฟล์ใน cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// เปิดใช้งาน service worker และลบ cache เก่าที่ไม่ต้องการ
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            // ลบ cache เก่า
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// ดักจับการโหลด resource และตอบจาก cache ถ้ามี ถ้าไม่มีดึงจากเครือข่าย
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        return cachedResponse || fetch(event.request);
      })
  );
});
