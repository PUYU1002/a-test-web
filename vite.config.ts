import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/a-test-web/',
  server: {
    port: 5173,
    open: true
  }
})
