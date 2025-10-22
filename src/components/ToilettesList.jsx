/**
 * Composant pour afficher une liste de toilettes connectées
 * @param {Object} props
 * @param {Array<Object>} props.toilettes - Liste des toilettes à afficher
 * @returns {JSX.Element}
 */
export default function ToilettesList({ toilettes }) {
    return (
        <table className="toilette-table">
            <thead>
            <tr>
                <th>Device ID</th>
                <th>Battery</th>
                <th>Occupancy</th>
                <th>Distance</th>
                <th>Dernière mise à jour</th>
            </tr>
            </thead>
            <tbody>
            {/* Affichage des données des toilettes */}
            {toilettes.map(t => (
                <tr key={t._id}>
                    <td>{t.device_id}</td>
                    <td>{t.battery?.toFixed(1)}%</td> {/* Affiche la batterie avec une décimale */}
                    <td>{t.occupancy}</td> {/* État de l'occupation */}
                    <td>{t.distance} cm</td> {/* Distance mesurée */}
                    <td>{new Date(t.received_at).toLocaleString()}</td> {/* Date de dernière mise à jour */}
                </tr>
            ))}
            </tbody>
        </table>
    )
}