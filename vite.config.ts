import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react()
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        cli: resolve(__dirname, 'src/cli/cli.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) => {
        // Don't externalize internal path aliases - let Vite resolve them
        if (id.startsWith('@bfg-engine/')) {
          return false;
        }
        // Don't bundle node_modules or peer dependencies
        return !id.startsWith('.') && !id.startsWith('/') && !resolve(__dirname, id).startsWith(__dirname + '/src')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'cli' ? 'cli/[name].js' : '[name].js'
        },
      },
    },
  },
})

