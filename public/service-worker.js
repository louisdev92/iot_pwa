// Nom du cache pour l'application PWA
const CACHE_NAME = 'iot-pwa-v1'

// Liste des fichiers statiques à mettre en cache
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/icons/test.png',
    '/icons/test4.png',
    '/icons/test5.png'
]

/**
 * Installation du service worker
 * Mise en cache des fichiers statiques définis dans STATIC_ASSETS
 */
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    )
    self.skipWaiting() // Active immédiatement le SW sans attendre
})

/**
 * Activation du service worker
 * Prend le contrôle des clients immédiatement
 */
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim())
})

/**
 * Gestion des requêtes réseau
 * Sert les fichiers depuis le cache si disponibles, sinon récupère via fetch
 */
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cached => cached || fetch(event.request))
    )
})

// ---------- Notifications push ----------

/**
 * Gestion des notifications push
 * @param {PushEvent} event - Événement de notification push
 */
self.addEventListener('push', event => {
    const data = event.data?.json() || {}
    const title = data.title || 'Nouvelle notification'
    const options = {
        body: data.body || 'Tu as reçu un message !',
        icon: '/icons/test.png',
        badge: '/icons/test.png'
    }
    event.waitUntil(self.registration.showNotification(title, options))
})

/**
 * Gestion du clic sur la notification
 * @param {NotificationEvent} event - Événement de clic sur notification
 */
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

// État initial de l'occupation
let occupied = false

/**
 * Envoie une notification simulant l'occupation des toilettes
 */
function sendOccupancyNotification() {
    occupied = !occupied // Alterne l'état entre libre et occupé
    const title = occupied ? '🚨 Toilette occupée !' : '✅ Toilette libre !'
    const options = {
        body: occupied ? '⚠️ Situation critique' : 'A vos risques et périls !',
        icon: occupied ? '/icons/test4.png' : '/icons/test5.png',
        tag: 'simu-toilette', // même tag pour remplacer la notif précédente
        renotify: true,
        vibrate: occupied ? [200, 100, 200] : undefined
    }

    self.registration.showNotification(title, options)
}

/**
 * Envoi périodique de notifications toutes les 2 secondes
 * Attention : uniquement pour développement
 */
self.addEventListener('activate', () => {
    setInterval(sendOccupancyNotification, 2000)
})
