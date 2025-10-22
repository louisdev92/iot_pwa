// ---------- Noms des caches ----------
const CACHE_STATIC = 'iot-pwa-static-v1'
const CACHE_DYNAMIC = 'iot-pwa-dynamic-v1'

// ---------- Fichiers statiques ----------
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',    // ton CSS
    '/main.js',      // ton JS principal
    '/icons/test.png',
    '/icons/test4.png',
    '/icons/test5.png'
]

// ---------- Installation ----------
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_STATIC).then(cache => cache.addAll(STATIC_ASSETS))
    )
    self.skipWaiting()
})

// ---------- Activation ----------
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim())
})

// ---------- Gestion des requêtes (Network First pour API, Cache First pour statique) ----------
self.addEventListener('fetch', event => {
    const request = event.request
    const urlPath = new URL(request.url).pathname

    // 1️⃣ API → Network First + cache dynamique
    if (request.url.includes('/api/')) {
        event.respondWith(
            fetch(request)
                .then(resp => {
                    const respClone = resp.clone()
                    caches.open(CACHE_DYNAMIC).then(cache => cache.put(request, respClone))
                    return resp
                })
                .catch(() => caches.match(request))
        )
        return
    }

    // 2️⃣ Fichiers statiques → Cache First
    if (STATIC_ASSETS.includes(urlPath)) {
        event.respondWith(
            caches.match(request).then(cached => cached || fetch(request))
        )
        return
    }

    // 3️⃣ Tout le reste → Network First + cache dynamique
    event.respondWith(
        fetch(request)
            .then(resp => {
                const respClone = resp.clone()
                caches.open(CACHE_DYNAMIC).then(cache => cache.put(request, respClone))
                return resp
            })
            .catch(() => caches.match(request))
    )
})

// ---------- Notifications push ----------
self.addEventListener('push', event => {
    const data = event.data?.json() || {}
    const title = data.title || 'Nouvelle notification'
    const options = {
        body: data.body || 'Tu as reçu un message !',
        icon: '/icons/test.png',
        badge: '/icons/test.png',
        data: data.url || '/'
    }
    event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', event => {
    event.notification.close()
    const urlToOpen = event.notification.data || '/'

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            for (const client of clientList) {
                if (client.url === urlToOpen && 'focus' in client) return client.focus()
            }
            if (clients.openWindow) return clients.openWindow(urlToOpen)
        })
    )
})

// ---------- Simulation Libre / Occupé ----------
let occupied = false

function sendOccupancyNotification() {
    occupied = !occupied
    const title = occupied ? '🚨 Toilette occupée !' : '✅ Toilette libre !'
    const options = {
        body: occupied ? '⚠️ Situation critique' : 'A vos risques et périls !',
        icon: occupied ? '/icons/test4.png' : '/icons/test5.png',
        tag: 'simu-toilette',
        renotify: true,
        vibrate: occupied ? [200, 100, 200] : undefined
    }

    self.registration.showNotification(title, options)
}

// Activation de l’envoi périodique toutes les 10 secondes
self.addEventListener('activate', () => {
    setInterval(sendOccupancyNotification, 10000)
})