import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/DocteurOcean/', // Ajout de la base pour GitHub Pages
    resolve: {
        alias: {
            '@': '/src'
        }
    }
})