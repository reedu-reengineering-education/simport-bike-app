import getAggregatedData from '@/lib/db/aggregation'
import { Track } from '@/lib/db/entities'
import { Upload } from '@/lib/db/entities/upload'
import senseBoxBikeDataSource from '@/lib/db/sources/senseBoxBikeDataSource'
import * as dfd from 'danfojs'
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
  console.log('--- OSEM --- Exporting data for trackId: ', trackId)

  await initializeConnection()

  const data = await getAggregatedData(trackId)

  const df = new dfd.DataFrame(data)

  console.log(df.head())

  df.print()

  // delete rows with all NaN values
  // df.dropNa({ axis: 0, inplace: true }) does not work because it deletes all columns
  // that have at least one NaN value
  for (const column of df.columns) {
    const values = df[column].values as number[]
    if (values.every(value => null === value)) {
      df.drop({ columns: [column], inplace: true })
    }
  }

  // delete track_id column
  df.drop({ columns: ['trackId'], inplace: true })

  // get group_number from data
  const groupNumbers = df.get('group_number').values as number[]

  // get unique group_numbers
  const uniqueGroupNumbers = Array.from(new Set(groupNumbers))

  // get all groups numbers that need to be uploaded
  const groupsToUpload = uniqueGroupNumbers.filter(
    groupNumber =>
      !uploadRepository.findOne({
        where: { group_number: groupNumber },
      }),
  )

  // get data to upload
  const dataToUpload = df.filter({
    column: 'group_number',
    isin: groupsToUpload,
  })

  console.log('--- OSEM --- Data to upload: ')

  dataToUpload.print()

  // for each row, read the data and send it to OpenSenseMap
  // for (const row of df.iterrows()) {
  //   const data = row[1]
  //   // send data to OpenSenseMap
  //   const timestamp = data['timestamp']
  //   const latitude = data['latitude']
  //   const longitude = data['longitude']

  //   // mark data as uploaded

  //   // save data to uploads table
  // }
}
