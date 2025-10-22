import { useEffect, useState } from 'react'
import { fetchSensors, fetchToilettes } from './api'
import SondesList from './components/SondesList'
import ToilettesList from './components/ToilettesList'

/**
 * Composant principal de l'application IoT Dashboard
 * @returns {JSX.Element}
 */
export default function App() {
    // États pour les données
    const [sensors, setSensors] = useState([])
    const [toilettes, setToilettes] = useState([])
    const [activeTab, setActiveTab] = useState('sensor') // 'sensor' ou 'toilette'

    // États pour les filtres
    const [sensorFilter, setSensorFilter] = useState({ device: '', type: '' })
    const [toiletteFilter, setToiletteFilter] = useState({ device: '', occupancy: '' })

    /**
     * Chargement des données depuis l'API au montage du composant
     */
    useEffect(() => {
        async function loadData() {
            const [sensorsData, toilettesData] = await Promise.all([fetchSensors(), fetchToilettes()])
            setSensors(sensorsData)
            setToilettes(toilettesData)
        }
        loadData()
    }, [])

    /**
     * Enregistrement du Service Worker et gestion des notifications simulées
     */
    useEffect(() => {
        if (!('serviceWorker' in navigator)) return

        let interval = null

        // Enregistrement du service worker
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker enregistré', reg))
            .catch(err => console.error('Erreur SW', err))

        // Demande d'autorisation pour les notifications
        Notification.requestPermission().then(permission => {
            if (permission !== 'granted') {
                console.log('Notifications refusées')
                return
            }

            console.log('Notifications autorisées')

            // Alterne l'état des toilettes toutes les 2 secondes pour simulation
            let occupied = false

            interval = setInterval(() => {
                occupied = !occupied

                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification(
                        occupied ? '🚨 Toilette occupée !' : '✅ Toilette libre !',
                        {
                            body: occupied ? '⚠️ Situation critique' : 'A vos risques et périls !',
                            icon: occupied ? '/icons/test4.png' : '/icons/test5.png',
                            tag: 'simu-toilette', // même tag pour remplacer l’ancienne notif
                            renotify: true,
                            vibrate: occupied ? [200, 100, 200] : undefined,
                        }
                    )
                })
            }, 2000)
        })

        // Nettoyage de l'intervalle à la destruction du composant
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [])

    // Préparer les devices uniques pour les filtres
    const sensorDevices = [...new Set(sensors.map(s => s.device_id))]
    const toiletteDevices = [...new Set(toilettes.map(t => t.device_id))]

    // Application des filtres sur les capteurs
    const filteredSensors = sensors
        .filter(s => !sensorFilter.device || s.device_id === sensorFilter.device)
        .filter(s => !sensorFilter.type || s.type.toLowerCase().includes(sensorFilter.type.toLowerCase()))

    // Application des filtres sur les toilettes
    const filteredToilettes = toilettes
        .filter(t => !toiletteFilter.device || t.device_id === toiletteFilter.device)
        .filter(t => !toiletteFilter.occupancy || t.occupancy === toiletteFilter.occupancy)

    return (
        <div className="app">
            <header>
                <h1>IoT Dashboard</h1>

                {/* Onglets pour choisir l'affichage */}
                <div className="tabs">
                    <button
                        className={activeTab === 'toilette' ? 'active' : ''}
                        onClick={() => setActiveTab('toilette')}
                    >
                        Toilettes
                    </button>
                    <button
                        className={activeTab === 'sensor' ? 'active' : ''}
                        onClick={() => setActiveTab('sensor')}
                    >
                        Capteurs Ponts
                    </button>
                </div>

                {/* Contrôles supplémentaires */}
                <div className="controls">
                    {/* Bouton mode sombre */}
                    <button
                        className="dark-mode-toggle"
                        onClick={() => document.body.classList.toggle('dark-mode')}
                    >
                        🌙 Mode sombre
                    </button>

                    {/* Filtre pour les capteurs */}
                    {activeTab === 'sensor' && (
                        <div className="filter-group">
                            <select
                                value={sensorFilter.device}
                                onChange={e => setSensorFilter({ ...sensorFilter, device: e.target.value })}
                            >
                                <option value="">Toutes les sondes</option>
                                {sensorDevices.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                    )}

                    {/* Filtre pour les toilettes */}
                    {activeTab === 'toilette' && (
                        <div className="filter-group">
                            <select
                                value={toiletteFilter.occupancy}
                                onChange={e => setToiletteFilter({ ...toiletteFilter, occupancy: e.target.value })}
                            >
                                <option value="">Occupancy</option>
                                <option value="vacant">Vacant</option>
                                <option value="occupied">Occupied</option>
                            </select>
                        </div>
                    )}
                </div>
            </header>

            {/* Affichage du tableau correspondant à l'onglet actif */}
            <main>
                {activeTab === 'toilette' && <ToilettesList toilettes={filteredToilettes} />}
                {activeTab === 'sensor' && <SondesList sensors={filteredSensors} />}
            </main>
        </div>
    )
}