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
        url: `http://${ipAddress}:5173`,
        cleartext: true,
      }

const config: CapacitorConfig = {
  appId: 'de.reedu.senseboxbike',
  appName: 'senseBox:Bike',
  webDir: 'out',
  server,
  android: {
    useLegacyBridge: true,
  },
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      iosIsEncryption: true,
      iosKeychainPrefix: 'angular-sqlite-app-starter',
      iosBiometric: {
        biometricAuth: false,
        biometricTitle: 'Biometric login for capacitor sqlite',
      },
      androidIsEncryption: true,
      androidBiometric: {
        biometricAuth: false,
        biometricTitle: 'Biometric login for capacitor sqlite',
        biometricSubTitle: 'Log in using your biometric',
      },
      electronIsEncryption: true,
      electronWindowsLocation: 'C:\\ProgramData\\CapacitorDatabases',
      electronMacLocation: '/Volumes/Development_Lacie/Development/Databases',
      electronLinuxLocation: 'Databases',
    },
  },
}

export default config
