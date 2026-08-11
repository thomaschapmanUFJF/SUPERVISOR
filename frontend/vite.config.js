import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
  },
  test: {
    globals: true,
    environment: 'node'
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress false-positive from three-mesh-bvh (transitive dep of @react-three/drei)
        // referencing BatchedMesh which is an internal not exported from the three module barrel.
        if (
          warning.code === 'MISSING_EXPORT' &&
          warning.exporter?.includes('three-mesh-bvh')
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
})

