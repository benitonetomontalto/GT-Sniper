self.addEventListener('install', event => {
    console.log('Service Worker instalado.');
    event.waitUntil(
        caches.open('gt-sniper-cache').then(cache => {
            return cache.addAll([
                './',
                './index.html',
                './css/style.css',
                './js/script.js',
                './img/imgicon-192.png',
                './img/imgicon-512.png',
                './manifest.json',
                './favicon.ico'
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
