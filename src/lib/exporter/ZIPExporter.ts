import { Directory, Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import { format } from 'date-fns'
import JSZip from 'jszip'
import { AbstractExporter } from './AbstractExporter'
import { BaseExporter } from './BaseExporter'

export class ZipExporter extends BaseExporter implements AbstractExporter {
  public async export() {
    const track = await this.fetchTrack()

    if (!track) throw new Error('Track not found')

    const zip = new JSZip()

    const trackFolder = zip.folder(
      `track_${format(new Date(track.start), 'yyyy-MM-dd_HH-mm-ss')}`,
    )

    if (!trackFolder) throw new Error('Track folder not found')

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

    trackFolder.file(geolocationFilename, geolocationData)

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

      trackFolder.file(filename, data)
    }
    const zipString = await zip.generateAsync({ type: 'base64' })

    console.log('ZIP File - writing to filesystem')
    const tempZipFile = await Filesystem.writeFile({
      path: `track_${format(new Date(track.start), 'yyyy-MM-dd_HH-mm-ss')}.zip`,
      data: zipString,
      directory: Directory.Cache,
    })

    await Share.share({
      url: tempZipFile.uri,
    })

    // cleanup
    await Filesystem.deleteFile({
      path: tempZipFile.uri,
      directory: Directory.Cache,
    })
  }
}
