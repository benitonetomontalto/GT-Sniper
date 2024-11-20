self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('gt-sniper-v1').then(cache => {
            return cache.addAll([
                './',
                './index.html',
                './css/style.css',
                './js/script.js',
                './img/gtsniper.jpeg',
                './favicon.ico'
            ]);
        })
    );
    console.log('Service Worker instalado.');
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
