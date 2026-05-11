import { defineConfig } from 'vite'
import { baseConfig } from './vite.config.base'

export default defineConfig({
  ...baseConfig,
  define: {
    DEV_WEB_APP_URL: '"http://localhost:3000"',
  },
})