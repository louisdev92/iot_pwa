import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import { registerSW } from './serviceWorkerRegistration'

/**
 * Point d'entrée principal de l'application React
 * Initialise le rendu de l'application et enregistre le service worker
 */
const root = createRoot(document.getElementById('root'))

// Rendu du composant principal
root.render(<App />)

/**
 * Enregistrement du service worker pour activer la PWA et le mode offline
 */
registerSW()