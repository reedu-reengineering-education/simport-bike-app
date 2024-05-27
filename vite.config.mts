import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const wasmContentTypePlugin = {
  name: 'wasm-content-type-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url.endsWith('.wasm')) {
        res.setHeader('Content-Type', 'application/wasm')
      }
      next()
    })
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), wasmContentTypePlugin],
  server: {
    host: '0.0.0.0',
  },
})
