import { defineConfig, createLogger } from 'vite'
import react from '@vitejs/plugin-react'

const customLogger = createLogger()
const loggerInfo = customLogger.info

customLogger.info = (msg, options) => {
  if (
    typeof msg === 'string' &&
    (msg.includes('Local:') ||
    msg.includes('Network:') ||
    msg.includes('press h + enter'))
  ) {
    return
  }
  loggerInfo(msg, options)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  customLogger,
})
