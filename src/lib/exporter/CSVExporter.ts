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

    const csv = dfd.toCSV(df)
    const writeResult = await Filesystem.writeFile({
      data: csv as string,
      path: `senseBox_bike_${format(metadata.start, 'yyyy-MM-dd_HH-mm')}.csv`,
      directory: Directory.Cache,
      recursive: true,
      encoding: Encoding.UTF8,
    })
    await Share.share({
      url: writeResult.uri,
    })
    // cleanup
    await Filesystem.deleteFile({
      path: writeResult.uri,
      directory: Directory.Cache,
    })
  }
}
