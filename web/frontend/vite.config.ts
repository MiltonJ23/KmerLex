import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Autorise ton URL ngrok spécifique pour éviter l'erreur de sécurité
    allowedHosts: [
      "shawanda-unflossy-charlott.ngrok-free.dev"
    ]
  }
})