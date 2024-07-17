import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite'
import { Capacitor } from '@capacitor/core'
const sqliteConnection: SQLiteConnection = new SQLiteConnection(CapacitorSQLite)
const sqlitePlugin = CapacitorSQLite
const platform: string = Capacitor.getPlatform()

console.log('platform', platform)

const sqliteParams = {
  connection: sqliteConnection,
  plugin: sqlitePlugin,
  platform: platform,
}
export default sqliteParams
