import { CapacitorConfig } from '@capacitor/cli'
import { execSync } from 'child_process'

console.log(process.env.NODE_ENV)

const ipAddress = execSync(`ipconfig getifaddr en0`, {
  encoding: 'utf-8',
}).trim()

const server: CapacitorConfig['server'] =
  process.env.NODE_ENV === 'production'
    ? {}
    : {
        url: `http://${ipAddress}:3000`,
      }

const config: CapacitorConfig = {
  appId: 'de.reedu.senseboxbike',
  appName: 'senseBox:Bike',
  webDir: 'out',
  server,
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
}

export default config
