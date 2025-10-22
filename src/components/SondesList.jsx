import { useState } from 'react'

/**
 * Composant pour afficher une liste de capteurs avec filtrage
 * @param {Object} props
 * @param {Array<Object>} props.sensors - Liste des capteurs à afficher
 * @returns {JSX.Element}
 */
export default function SondesList({ sensors }) {
    // États pour les filtres
    const [filterDevice, setFilterDevice] = useState('')
    const [filterType, setFilterType] = useState('')
    const [filterVoltage, setFilterVoltage] = useState('')

    /**
     * Filtrage des capteurs selon les critères sélectionnés
     */
    const filteredSensors = sensors.filter(s =>
        (!filterDevice || s.device_id.toLowerCase().includes(filterDevice.toLowerCase())) &&
        (!filterType || (s.type || '').toLowerCase().includes(filterType.toLowerCase())) &&
        (!filterVoltage || (s.volt || '').toLowerCase().includes(filterVoltage.toLowerCase()))
    )

    // Si aucun capteur n'est fourni, affichage d'un message
    if (!sensors?.length) return <p>Aucun capteur trouvé.</p>

    return (
        <div className="sensor-table-container">
            {/* Tableau des capteurs */}
            <table className="sensor-table">
                <thead>
                <tr>
                    <th>Device ID</th>
                    <th>Type</th>
                    <th>Haut (m)</th>
                    <th>Voltage</th>
                    <th>Reçu à</th>
                    <th>Inséré à</th>
                </tr>
                </thead>
                <tbody>
                {/* Affichage des capteurs filtrés */}
                {filteredSensors.map(s => (
                    <tr key={s._id}>
                        <td>{s.device_id}</td>
                        <td>{s.type}</td>
                        <td>{s.haut}</td>
                        <td>{s.volt}</td>
                        <td>{new Date(s.received_at).toLocaleString()}</td>
                        <td>{new Date(s.inserted_at).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}
