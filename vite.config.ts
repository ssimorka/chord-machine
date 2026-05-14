import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/chord-machine/' : '/',
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
}))
