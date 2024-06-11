import { AbstractExporter } from './AbstractExporter'
import { BaseExporter } from './BaseExporter'

export class CSVExporter extends BaseExporter implements AbstractExporter {
  public async export() {
    // const track = await this.getMeasurementsPivotDynamic()
    // console.log(track)
    // const track = await this.fetchTrackMerge()
    // if (!track) throw new Error('Track not found')
    // const df = new dfd.DataFrame(track)
    // // const typeAttributePairs = df.unique(['type', 'attribute']).values as [
    // //   string,
    // //   string,
    // // ][]
    // // console.log(typeAttributePairs)
    // const csv = dfd.toCSV(df)
    // const writeResult = await Filesystem.writeFile({
    //   data: csv as string,
    //   path: `track.csv`,
    //   directory: Directory.Cache,
    //   recursive: true,
    //   encoding: Encoding.UTF8,
    // })
    // await Share.share({
    //   url: writeResult.uri,
    // })
    // // cleanup
    // await Filesystem.deleteFile({
    //   path: writeResult.uri,
    //   directory: Directory.Cache,
    // })
    // const { geolocations, measurements, ...track } = await this.fetchTrack()
    // if (!track) throw new Error('Track not found')
    // const measurementHeaders = Array.from(
    //   new Set(
    //     measurements.map(measurement => {
    //       const { type, attribute = '' } = measurement
    //       return `${type}${attribute ? `_${attribute}` : ''}`
    //     }),
    //   ),
    // )
    // const geoDf = new dfd.DataFrame({
    //   timestamp: geolocations.map(({ timestamp }) => timestamp.toISOString()),
    //   latitude: geolocations.map(({ latitude }) => latitude),
    //   longitude: geolocations.map(({ longitude }) => longitude),
    //   speed: geolocations.map(({ speed }) => speed),
    // })
    // const flattenedMeasurements = measurements.map(measurement => {
    //   const { type, attribute = '', value } = measurement
    //   return {
    //     timestamp: measurement.timestamp.toISOString(),
    //     [`${type}${attribute ? `_${attribute}` : ''}`]: value,
    //     // all other types are null
    //     ...measurementHeaders.reduce((acc, header) => {
    //       if (header !== `${type}${attribute ? `_${attribute}` : ''}`) {
    //         acc[header] = NaN
    //       }
    //       return acc
    //     }, {}),
    //   }
    // })
    // console.log(flattenedMeasurements.length)
    // const measurementDf = new dfd.DataFrame(flattenedMeasurements)
    // const dataDf = dfd.merge({
    //   left: measurementDf,
    //   right: geoDf,
    //   on: ['timestamp'],
    //   how: 'outer',
    // })
    // const timestamps = dataDf['timestamp'].dt
    // console.log(timestamps)
    // const csv = dfd.toCSV(dataDf)
    // const writeResult = await Filesystem.writeFile({
    //   path: `track.csv`,
    //   data: csv as string,
    //   directory: Directory.Cache,
    //   recursive: true,
    //   encoding: Encoding.UTF8,
    // })
    // await Share.share({
    //   url: writeResult.uri,
    // })
    // // cleanup
    // await Filesystem.deleteFile({
    //   path: writeResult.uri,
    //   directory: Directory.Cache,
    // })
  }
}
