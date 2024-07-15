import { uploadDataCSV } from '@/lib/api/openSenseMapClient'
import getAggregatedData from '@/lib/db/aggregation'
import { Track } from '@/lib/db/entities'
import { Upload } from '@/lib/db/entities/upload'
import senseBoxBikeDataSource from '@/lib/db/sources/senseBoxBikeDataSource'
import { getTitlefromSensorKey } from '@/lib/senseBoxSensorIdMatcher'
import { useAuthStore } from '@/lib/store/useAuthStore'
import * as dfd from 'danfojs'
import { DataFrame } from 'danfojs/dist/danfojs-base'
import { DataSource, Repository } from 'typeorm'

let connection: DataSource
// let trackRepository: Repository<Track>
let uploadRepository: Repository<Upload>

async function initializeConnection() {
  if (!connection) connection = senseBoxBikeDataSource.dataSource
  //   trackRepository = connection.getRepository(Track)
  uploadRepository = connection.getRepository(Upload)
}

export async function exportData(trackId: Track['id']) {
  const senseBox = useAuthStore.getState().selectedBox

  if (!senseBox) {
    console.log('--- OSEM --- No senseBox selected')
    return
  }

  console.log('--- OSEM --- Exporting data for trackId: ', trackId)

  console.log('--- OSEM --- Connection initialized')
  const data = await getAggregatedData(trackId)

  console.log(data)

  console.log('--- OSEM --- Data fetched: ')

  const df = new dfd.DataFrame(data)

  console.log(df.head())

  // delete rows with all NaN values
  // df.dropNa({ axis: 0, inplace: true }) does not work because it deletes all columns
  // that have at least one NaN value
  for (const column of df.columns) {
    const values = df[column].values as number[]
    if (values.every(value => null === value)) {
      df.drop({ columns: [column], inplace: true })
    }
  }

  console.log('--- OSEM --- Data after dropping NaN values: ')
  console.log(df.head())

  // delete track_id column
  df.drop({ columns: ['trackId'], inplace: true })

  console.log('--- OSEM --- Data after dropping trackId column: ')
  console.log(df.head())

  // get group_number from data
  const groupNumbers = df['group_number'].values as number[]

  console.log('--- OSEM --- Group numbers: ')
  console.log(groupNumbers)

  // get unique group_numbers
  const uniqueGroupNumbers = Array.from(new Set(groupNumbers))

  console.log('--- OSEM --- Unique group numbers: ')
  console.log(uniqueGroupNumbers)

  await initializeConnection()

  // get all groups numbers that need to be uploaded
  // find all in upload table where group_number is not in uniqueGroupNumbers
  const uploadedGroups = await uploadRepository.find()
  const groupsToUpload = uniqueGroupNumbers.filter(
    groupNumber =>
      !uploadedGroups.find(upload => upload.group_number === groupNumber),
  )

  console.log('--- OSEM --- Groups to upload: ')
  console.log(groupsToUpload)

  // get data to upload
  const dataToUpload: DataFrame[] = []
  for (const groupNumber of groupsToUpload) {
    const groupData = df.query(df['group_number'].eq(groupNumber))
    dataToUpload.push(groupData)
  }

  // const CSV_LIMIT = 2500
  const csv = dataToUpload.map(dfToOsemCSV).join('')

  // for (const uploadData of dataToUpload) {
  //   const csvData = dfToOsemCSV(uploadData)

  //   if (!csvData) {
  //     console.log('--- OSEM --- No data to upload')
  //     return
  //   }

  // upload data
  console.log('--- OSEM --- Uploading data: ')
  const uploadSuccess = await uploadDataCSV(senseBox, csv)

  if (!uploadSuccess) {
    console.log('--- OSEM --- Upload failed')
    return
  }

  const uploadBuffer = dataToUpload.map(data => {
    const upload = new Upload()
    upload.uploaded = true
    upload.group_number = data['group_number'].values[0] as number
    return upload
  })

  // save data to uploads table
  await senseBoxBikeDataSource.dataSource.transaction(async manager => {
    for (const upload of uploadBuffer) {
      await manager.save(upload)
    }
  })
  // }
}

export function dfToOsemCSV(df: dfd.DataFrame) {
  const senseBox = useAuthStore.getState().selectedBox

  if (!senseBox) {
    console.log('--- OSEM --- No senseBox selected')
    return
  }

  // for each row, read the data and send it to OpenSenseMap
  const columns = df.columns
  const values = df.values
  const variableColumns = columns.filter(
    column =>
      ![
        'timestamp',
        'latitude',
        'longitude',
        'group_number',
        'group_id',
      ].includes(column),
  )

  let csvString = ``

  // iterate over rows but the last one
  for (const row of values) {
    // send data to OpenSenseMap
    const timestamp = (row as string[])[columns.indexOf('timestamp')]
    const latitude = (row as number[])[columns.indexOf('latitude')]
    const longitude = (row as number[])[columns.indexOf('longitude')]

    if (!latitude || !longitude) {
      console.log(
        '--- OSEM --- Skipping row because of missing latitude or longitude',
      )
      continue
    }

    console.log('--- OSEM --- Uploading data: ')
    console.log(timestamp, latitude, longitude)

    for (const column of variableColumns) {
      const value = (row as number[])[columns.indexOf(column)]
      console.log(value)
      if (value === null || value === undefined || isNaN(value)) {
        console.log('--- OSEM --- Skipping row because of missing value')
        continue
      }
      const { key, attribute } = splitKeyAndAttribute(column)
      const sensorTitle = getTitlefromSensorKey(key, attribute)
      const sensorId = senseBox.sensors.find(
        sensor => sensor.title === sensorTitle,
      )?._id

      if (!sensorId) {
        console.log('--- OSEM --- Sensor not found: ', sensorTitle)
        continue
      }

      const utcDate = new Date(
        timestamp.split(' ').join('T') + 'Z',
      ).toISOString()

      // anotherSensorId,value,RFC 3339-timestamp,longitude,latitude

      csvString += `${sensorId},${value.toFixed(2)},${utcDate},${longitude},${latitude}\n`
    }
  }

  console.log(csvString)

  return csvString
}

/**
 *
 * @param input a string that may contain an attribute separated by an underscore
 * @example splitKeyAndAttribute('temperature') // { key: 'temperature', attribute: undefined }
 * @example splitKeyAndAttribute('finedust_pm2_5') // { key: 'finedust', attribute: 'pm2_5' }
 * @returns an object with the key and the attribute
 */
function splitKeyAndAttribute(input: string): {
  key: string
  attribute: string | undefined
} {
  // Special case for pm2_5
  if (input.endsWith('_pm2_5')) {
    return { key: input.slice(0, -6), attribute: 'pm2_5' } // -6 to exclude "_pm2_5"
  }

  // special case for surface_anomaly
  if (input.endsWith('_anomaly')) {
    return { key: 'surface_anomaly', attribute: undefined }
  }

  const parts = input.split('_')
  if (parts.length === 1) {
    // No underscore in the string
    return { key: input, attribute: undefined }
  } else {
    // Join all parts except the last one to form the key
    const key = parts.slice(0, -1).join('_')
    // The last part is the attribute
    const attribute = parts[parts.length - 1]
    return { key, attribute }
  }
}
