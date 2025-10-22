/**
 * Enregistre le Service Worker pour rendre l'application PWA et gérer le mode offline
 */
export function registerSW() {
    // Vérifie si le navigateur supporte les Service Workers
    if ('serviceWorker' in navigator) {
        // Attente du chargement complet de la page
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('✅ Service Worker enregistré avec succès :', registration)

                    // Optionnel : attendre que le service worker soit actif et prêt
                    navigator.serviceWorker.ready.then(() => {
                        console.log('Service Worker prêt à gérer les notifications')
                    })
                })
                .catch(err => console.error('❌ Échec de l’enregistrement du Service Worker :', err))
        })
    } else {
        console.warn('Service Worker non supporté par ce navigateur')
    }
}