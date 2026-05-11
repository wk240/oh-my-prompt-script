import { defineConfig } from 'vite'
import { baseConfig } from './vite.config.base'

export default defineConfig({
  ...baseConfig,
  // DEV_WEB_APP_URL not defined - fallback to https://oh-my-prompt.com
  build: {
    ...baseConfig.build,
    sourcemap: false, // Production builds don't need sourcemaps
  },
})