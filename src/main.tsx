import 'reflect-metadata'

import senseBoxBikeDataSource from '@/lib/db/sources/senseBoxBikeDataSource'
import sqliteParams from '@/lib/db/sqliteParams'
import { JeepSqlite } from 'jeep-sqlite/dist/components/jeep-sqlite'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/globals.css'

customElements.define('jeep-sqlite', JeepSqlite)

const initializeDataSources = async () => {
  //check sqlite connections consistency
  await sqliteParams.connection.checkConnectionsConsistency().catch(e => {
    console.log(e)
    return {}
  })

  // Loop through the DataSources
  for (const mDataSource of [senseBoxBikeDataSource]) {
    // initialize
    await mDataSource.dataSource.initialize()
    if (mDataSource.dataSource.isInitialized) {
      // run the migrations
      await mDataSource.dataSource.runMigrations()
    }
    if (sqliteParams.platform === 'web') {
      await sqliteParams.connection.saveToStore(mDataSource.dbName)
    }
  }
}

if (sqliteParams.platform !== 'web') {
  await initializeDataSources()

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
} else {
  window.addEventListener('DOMContentLoaded', async () => {
    const jeepEl = document.createElement('jeep-sqlite')
    document.body.appendChild(jeepEl)
    customElements
      .whenDefined('jeep-sqlite')
      .then(async () => {
        await sqliteParams.connection.initWebStore()
        await initializeDataSources()

        ReactDOM.createRoot(document.getElementById('root')!).render(
          <React.StrictMode>
            <App />
          </React.StrictMode>,
        )
      })
      .catch(err => {
        console.log(`Error: ${err}`)
        throw new Error(`Error: ${err}`)
      })
  })
}
