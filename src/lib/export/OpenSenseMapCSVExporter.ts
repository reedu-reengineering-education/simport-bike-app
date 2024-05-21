import { toast } from '@/components/ui/use-toast'
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import { point } from '@turf/turf'
import { format } from 'date-fns'
import { isInExclusionZone } from '../exclusion-zone'
import matchSensorToRecord from '../senseBoxSensorIdMatcher'
import { useAuthStore } from '../store/useAuthStore'
import { Track, useTracksStore } from '../store/useTracksStore'
import { ITrackExporter } from './ITrackExporter'

export class OpenSenseMapCSVExporter implements ITrackExporter {
  filenamePrefix: string = 'sb_track_opensensemap'

  async exportTrack(trackId: Track['id']) {
    console.log('Hello from OpenSenseMapExporter')

    const track = useTracksStore
      .getState()
      .tracks.find(track => track.id === trackId)

    if (!track) return

    const currentSenseBox = useAuthStore.getState().selectedBox

    console.log('currentSenseBox', currentSenseBox)

    if (currentSenseBox == undefined) {
      toast({
        title: 'Fehler',
        description: 'Bitte wähle eine SenseBox aus',
      })
      return
    }

    const data = track.measurements
      .filter(
        record => !isInExclusionZone(point([record.gps_lng!, record.gps_lat!])),
      )
      .flatMap(record => matchSensorToRecord(currentSenseBox, record))
      .map(record => ({
        ...record,
        value: record.value.toFixed(2),
      }))
      .slice(-2500) // max data to upload

    console.log('data', data)

    const csvBody = data
      .map(measurement => {
        return `${measurement.sensor},${measurement.value},${measurement.createdAt},${measurement.location.lng},${measurement.location.lat}`
      })
      .join('\n')

    console.log('csvBody', csvBody)

    const filename = `${this.filenamePrefix}_${format(
      new Date(track.start),
      'yyyy-MM-dd_HH-mm-ss',
    )}.csv`

    const writeResult = await Filesystem.writeFile({
      path: filename,
      data: csvBody,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    })

    await Share.share({
      url: writeResult.uri,
    })

    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Cache,
    })
  }
}
