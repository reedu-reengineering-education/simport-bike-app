import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import { BlobWriter, ZipWriter } from '@zip.js/zip.js'
import { format } from 'date-fns'
import { AbstractExporter } from './AbstractExporter'
import { BaseExporter } from './BaseExporter'

export class MultiFileExporter
  extends BaseExporter
  implements AbstractExporter
{
  public async export() {
    const track = await this.fetchTrack()

    if (!track) throw new Error('Track not found')

    const filepaths = []

    const zipWriter = new ZipWriter(new BlobWriter('application/zip'))

    // create geolocation CSV
    const geolocationCSV = track.geolocations
      .map(geolocation => {
        return `${geolocation.timestamp.toISOString()},${
          geolocation.latitude
        },${geolocation.longitude},${geolocation.speed}`
      })
      .join('\n')

    const geolocationHeader = 'timestamp,latitude,longitude,speed'
    const geolocationData = `${geolocationHeader}\n${geolocationCSV}`
    const geolocationFilename = `geolocations_${format(
      new Date(track.start),
      'yyyy-MM-dd_HH-mm-ss',
    )}.csv`

    const writeGeolocationResult = await Filesystem.writeFile({
      path: `track/${geolocationFilename}`,
      data: geolocationData,
      directory: Directory.Cache,
      recursive: true,
      encoding: Encoding.UTF8,
    })

    filepaths.push(writeGeolocationResult.uri)

    // await zipWriter.add(geolocationFilename, new TextReader(geolocationData))

    const types = Array.from(new Set(track.measurements.map(m => m.type)))

    for (const type of types) {
      const measurements = track.measurements
        .filter(m => m.type === type)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

      const measurementCSV = measurements
        .map(measurement => {
          return `${measurement.timestamp.toISOString()},${measurement.value},${
            measurement.attribute
          }`
        })
        .join('\n')

      const data = `timestamp,${type},attribute\n${measurementCSV}`

      const filename = `${type}_${format(
        new Date(track.start),
        'yyyy-MM-dd_HH-mm-ss',
      )}.csv`

      const writeResult = await Filesystem.writeFile({
        path: `track/${filename}`,
        data,
        directory: Directory.Cache,
        recursive: true,
        encoding: Encoding.UTF8,
      })
      filepaths.push(writeResult.uri)

      // await zipWriter.add(filename, new TextReader(data))
    }

    // const { files } = await Filesystem.readdir({
    //   path: 'track',
    //   directory: Directory.Cache,
    // })

    // for (const file of files) {
    //   const { data } = await Filesystem.readFile({
    //     path: 'track/' + file.name,
    //     directory: Directory.Cache,
    //   })
    //   console.log(data)
    //   await zipWriter.add(file.name, new Reader())
    // }

    // const { data } = await Filesystem.readFile({
    //   path: 'track/' + geolocationFilename,
    //   directory: Directory.Cache,
    // })
    // await zipWriter.add(
    //   'geolocations.csv',
    //   new FileReader().readAsText(data as String),
    // )

    const zipResult = await zipWriter.close()
    const zipContent = await zipResult.text()

    const writeResult = await Filesystem.writeFile({
      path: `track.zip`,
      data: zipContent,
      directory: Directory.Cache,
      recursive: true,
      encoding: Encoding.UTF8,
    })

    await Share.share({
      url: writeResult.uri,
      files: filepaths,
    })

    // cleanup
    await Filesystem.deleteFile({
      path: 'track',
      directory: Directory.Cache,
    })
    await Filesystem.deleteFile({
      path: `track_${format(new Date(track.start), 'yyyy-MM-dd_HH-mm-ss')}.zip`,
    })
  }
}
