import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// Project site: https://bodhan-google.github.io/Website/
const pagesBase = process.env.VITE_BASE_PATH ?? '/'

// https://vite.dev/config/
export default defineConfig({
  base: pagesBase,
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    open: true,
    allowedHosts: true,
  },
})
