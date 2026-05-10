import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/__tests__/*.test.ts'],
  },
  define: {
    DEV_WEB_APP_URL: '"http://localhost:3000"'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@oh-my-prompt/shared': path.resolve(__dirname, '../shared')
    },
  },
})