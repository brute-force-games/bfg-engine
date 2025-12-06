import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { resolve } from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig(({ command }) => {
  const isWebCli = process.env.VITE_WEB_CLI === 'true';
  
  if (isWebCli) {
    // Web CLI mode - serve the HTML file
    return {
      resolve: {
        alias: {
          // Use our custom fs polyfill wrapper that exports fs functions properly
          // This must come before nodePolyfills plugin processes fs
          fs: resolve(__dirname, 'src/cli/fs-polyfill.ts'),
        },
      },
      plugins: [
        tsconfigPaths(),
        react(),
        nodePolyfills({
          // Polyfill what yargs needs
          globals: {
            Buffer: true,
            global: true,
            process: true,
          },
          // Exclude fs since we're handling it with our custom alias
          exclude: ['fs'],
        }),
        // Plugin to add COOP/COEP headers for OPFS support
        {
          name: 'add-coop-coep-headers',
          configureServer(server) {
            server.middlewares.use((_req, res, next) => {
              res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
              res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
              next();
            });
          },
        },
      ],
      server: {
        port: 62776,
        open: '/src/cli/web-cli.html',
      },
      root: resolve(__dirname),
      publicDir: resolve(__dirname, 'public'),
      optimizeDeps: {
        include: ['@bundled-es-modules/memfs'],
        exclude: ['tinybase/persisters/persister-sqlite-wasm', '@sqlite.org/sqlite-wasm'],
      },
    };
  }
  
  // Normal build mode
  return {
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
  };
})

