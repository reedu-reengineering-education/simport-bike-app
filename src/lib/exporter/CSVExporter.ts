import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import * as dfd from 'danfojs'
import { format } from 'date-fns'
import { AbstractExporter } from './AbstractExporter'
import { BaseExporter } from './BaseExporter'

export class CSVExporter extends BaseExporter implements AbstractExporter {
  public async export() {
    const track = await this.fetchTrackMerge()
    if (!track) throw new Error('Track not found')

    const metadata = await this.getTrackMetadata()
    if (!metadata) throw new Error('Track metadata not found')

    const df = new dfd.DataFrame(track)

    // delete rows with NaN latitude and longitude
    df.dropNa({ axis: 1, inplace: true })

    // remove group_number column
    df.drop({ columns: ['group_number'], inplace: true })

    const mycsv = dfd.toCSV(df)

    const mywriteResult = await Filesystem.writeFile({
      data: mycsv as string,
      path: `senseBox_bike_${format(metadata.start, 'yyyy-MM-dd_HH-mm')}.csv`,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    })
    await Share.share({
      url: mywriteResult.uri,
    })
    // cleanup
    await Filesystem.deleteFile({
      path: mywriteResult.uri,
    })

    // const rowCount = df.shape[0]

    // // Identify geolocation changes
    // // Add a column to identify geolocation changes

    // // Iterate through the DataFrame and assign groups
    // let currentGroup = 0
    // let lastLat = 0
    // let lastLon = 0
    // const series = []
    // for (let i = 0; i < rowCount; i++) {
    //   const row = df.iloc({ rows: [i] }).values[0] as number[]
    //   const latitude = row[1]
    //   const longitude = row[2]
    //   if (
    //     latitude !== null &&
    //     (latitude !== lastLat || longitude !== lastLon)
    //   ) {
    //     currentGroup++
    //     lastLat = latitude
    //     lastLon = longitude
    //   }
    //   series.push(currentGroup)
    // }
    // df.addColumn('geo_id', series, { inplace: true })

    // // danfo js timestamp to unix timestamp
    // df.addColumn(
    //   'timestamp_unix',
    //   df['timestamp'].apply((x: string) => new Date(x).getTime()),
    //   {
    //     inplace: true,
    //   },
    // )

    // // Specify aggregation functions for each column
    // const aggregationFunctions: { [key: string]: any } = {
    //   timestamp_unix: 'min',
    //   latitude: 'max',
    //   longitude: 'max',
    //   overtaking: 'sum',
    //   finedust_pm1: 'mean',
    //   finedust_pm2_5: 'mean',
    //   finedust_pm4: 'mean',
    //   finedust_pm10: 'mean',
    //   distance: 'sum',
    //   humidity: 'mean',
    //   accelerometer_x: 'mean',
    //   accelerometer_y: 'mean',
    //   accelerometer_z: 'mean',
    //   temperature: 'mean',
    // }

    // // Group by geolocation and apply aggregations
    // // TODO: Exclude null values from aggregation
    // const grouped = df.groupby(['geo_id']).agg(aggregationFunctions)

    // // calculate renamed columns by aggregation functions
    // const renamedColumns: { [key: string]: string } = {}
    // for (const column of Object.keys(aggregationFunctions)) {
    //   renamedColumns[`${column}_${aggregationFunctions[column]}`] = column
    // }

    // // timestamp_unix_min to date
    // grouped.addColumn(
    //   'timestamp',
    //   grouped['timestamp_unix_min'].apply((x: number) =>
    //     new Date(x).toISOString(),
    //   ),
    //   {
    //     inplace: true,
    //   },
    // )

    // // Drop the helper columns
    // grouped.drop({ columns: ['geo_id', 'timestamp_unix_min'], inplace: true })

    // // Rename the columns
    // grouped.rename(renamedColumns, {
    //   inplace: true,
    // })

    // // delete rows with NaN values
    // grouped.dropNa({ axis: 1, inplace: true })

    // const csv = dfd.toCSV(grouped)

    // const writeResult = await Filesystem.writeFile({
    //   data: csv as string,
    //   path: `senseBox_bike_${format(metadata.start, 'yyyy-MM-dd_HH-mm')}.csv`,
    //   directory: Directory.Cache,
    //   encoding: Encoding.UTF8,
    // })
    // await Share.share({
    //   url: writeResult.uri,
    // })
    // // cleanup
    // await Filesystem.deleteFile({
    //   path: writeResult.uri,
    // })
  }
}
