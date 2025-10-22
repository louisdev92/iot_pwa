// URL de base de l'API récupérée depuis les variables d'environnement
const BASE_URL = import.meta.env.VITE_API_URL

/**
 * Récupère la liste des capteurs depuis l'API
 * @async
 * @returns {Promise<Array<Object>>} Liste des capteurs
 */
export async function fetchSensors() {
    try {
        const res = await fetch(`${BASE_URL}/sondes`)
        const json = await res.json()
        return json.data || []
    } catch (err) {
        console.error('Erreur API sensors :', err)
        return []
    }
}

/**
 * Récupère la liste des passerelles (bridges) depuis l'API
 * @async
 * @returns {Promise<Array<Object>>} Liste des bridges
 */
export async function fetchBridges() {
    try {
        const res = await fetch(`${BASE_URL}/bridges`)
        const json = await res.json()
        return json.data || []
    } catch (err) {
        console.error('Erreur API bridges :', err)
        return []
    }
}

/**
 * Récupère la liste des événements depuis l'API
 * @async
 * @returns {Promise<Array<Object>>} Liste des événements
 */
export async function fetchEvents() {
    try {
        const res = await fetch(`${BASE_URL}/events`)
        const json = await res.json()
        return json.data || []
    } catch (err) {
        console.error('Erreur API events :', err)
        return []
    }
}

/**
 * Récupère la liste des alertes depuis l'API
 * @async
 * @returns {Promise<Array<Object>>} Liste des alertes
 */
export async function fetchAlerts() {
    try {
        const res = await fetch(`${BASE_URL}/alerts`)
        const json = await res.json()
        return json.data || []
    } catch (err) {
        console.error('Erreur API alerts :', err)
        return []
    }
}

/**
 * Récupère la liste des toilettes depuis l'API, avec pagination
 * @async
 * @param {number} [page=1] - Numéro de la page à récupérer
 * @returns {Promise<Array<Object>>} Liste des toilettes
 */
export async function fetchToilettes(page = 1) {
    try {
        const res = await fetch(`${BASE_URL}/toilettes?page=${page}`)
        const json = await res.json()
        return json.data || []
    } catch (err) {
        console.error('Erreur API toilettes :', err)
        return []
    }
}