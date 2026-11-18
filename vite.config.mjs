import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/',
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  plugins: [vue()],
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    rollupOptions: { output: { chunkFileNames: 'shared-[name].js' } },
    lib: {
      entry: { 'ad-slot': 'src/ad-slot-main.js', cabinet: 'src/cabinet-main.js' },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
  },
})
