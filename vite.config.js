import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/aiedu-showcase/',
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
