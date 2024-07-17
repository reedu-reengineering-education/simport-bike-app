import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
import * as dfd from 'danfojs'
import { AbstractExporter } from './AbstractExporter'
import { BaseExporter } from './BaseExporter'
import { dfToOsemCSV } from './live/opensensemap-live-exporter'

import { toast } from '@/components/ui/use-toast'
import i18n from '@/i18n'
import { Capacitor } from '@capacitor/core'
import { Share } from '@capacitor/share'
import { format } from 'date-fns'

export class OpenSenseMapExporter
  extends BaseExporter
  implements AbstractExporter
{
  public async export() {
    const metadata = await this.getTrackMetadata()
    if (!metadata) throw new Error('Track metadata not found')

    const track = await this.fetchTrackMerge()
    if (!track) throw new Error('Track not found')

    const df = new dfd.DataFrame(track)

    // delete track_id column
    df.drop({ columns: ['trackId'], inplace: true })

    // delete rows with all NaN values
    // df.dropNa({ axis: 0, inplace: true }) does not work because it deletes all columns
    // that have at least one NaN value
    for (const column of df.columns) {
      const values = df[column].values as number[]
      if (values.every(value => null === value)) {
        df.drop({ columns: [column], inplace: true })
      }
    }

    // rename column group_number to group_id
    df.rename({ group_number: 'group_id' }, { inplace: true })

    const mycsv = dfToOsemCSV(df)

    // if platform is android
    if (Capacitor.getPlatform() === 'android') {
      await Filesystem.writeFile({
        data: mycsv as string,
        path: `senseBox_bike_osem_${format(metadata.start, 'yyyy-MM-dd_HH-mm')}.csv`,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      })
      toast({
        title: i18n.t('notifications.track-exported.title'),
        description: i18n.t('notifications.track-exported.description'),
      })
      return
    }

    // if platform is ios
    const mywriteResult = await Filesystem.writeFile({
      data: mycsv as string,
      path: `senseBox_bike_osem_${format(metadata.start, 'yyyy-MM-dd_HH-mm')}.csv`,
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
  }
}
