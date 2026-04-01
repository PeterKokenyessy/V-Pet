import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // vagy '0.0.0.0' → külső elérés engedélyezése
    port: 5173  // fix port (opcionális)
  },
})
