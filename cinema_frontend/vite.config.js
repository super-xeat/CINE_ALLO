import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,      // Permet d'écouter sur toutes les interfaces réseau
    port: 5173,      // Assure-toi que c'est le bon port
    watch: {
      usePolling: true, // <--- C'est CETTE LIGNE qui évite le rebuild !
    }
  }
})
