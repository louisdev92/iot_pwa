import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Configuration de Vite pour le projet React
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
    // Plugins utilisés par Vite
    plugins: [react()],

    // Configuration du serveur de développement
    server: {
        port: 5173, // Port sur lequel le serveur de dev sera lancé
    },
})