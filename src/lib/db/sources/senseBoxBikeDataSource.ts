import { DataSource, type DataSourceOptions } from 'typeorm'
import * as entities from '../entities'
import * as migrations from '../migrations'
import sqliteParams from '../sqliteParams'

const dbName = 'senseBoxBike'

const dataSourceConfig: DataSourceOptions = {
  name: 'senseBoxBikeConnection',
  type: 'capacitor',
  driver: sqliteParams.connection,
  database: dbName,
  mode: 'no-encryption',
  entities: entities,
  migrations: migrations, //["../migrations/author/*{.ts,.js}"]
  subscribers: [],
  logging: [/*'query',*/ 'error', 'schema'],
  synchronize: false, // !!!You will lose all data in database if set to `true`
  migrationsRun: false, // Required with capacitor type
}
export const dataSourceSenseBoxBike = new DataSource(dataSourceConfig)
const senseBoxBikeDataSource = {
  dataSource: dataSourceSenseBoxBike,
  dbName: dbName,
}

export default senseBoxBikeDataSource
