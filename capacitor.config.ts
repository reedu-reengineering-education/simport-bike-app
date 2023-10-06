import { CapacitorConfig } from '@capacitor/cli'
import { execSync } from 'child_process'

const ipAddress = execSync(`ipconfig getifaddr en0`, {
  encoding: 'utf-8',
}).trim()

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'senseBox:Bike X SIMPORT',
  webDir: 'out',
  server: {
    url: `http://${ipAddress}:3000`,
  },
}

export default config
