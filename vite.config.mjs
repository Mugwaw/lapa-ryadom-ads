import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/',
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  plugins: [vue()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: { entry: 'src/ad-slot-main.js', formats: ['es'], fileName: () => 'ad-slot.js' },
  },
})
