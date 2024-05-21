import { toast } from '@/components/ui/use-toast'
import { point } from '@turf/turf'
import { isInExclusionZone } from '../exclusion-zone'
import matchSensorToRecord from '../senseBoxSensorIdMatcher'
import { useAuthStore } from '../store/useAuthStore'
import { Track, useTracksStore } from '../store/useTracksStore'
import { ITrackExporter } from './ITrackExporter'

export class OpenSenseMapDirectExporter implements ITrackExporter {
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

    // slice data into chunks of 2500
    const chunkedData = []
    for (let i = 0; i < data.length; i += 2500) {
      chunkedData.push(data.slice(i, i + 2500))
    }

    // upload chunks to OpenSenseMap
    // for (const chunk of chunkedData) {
    //   await uploadData(currentSenseBox, chunk)
    // }

    toast({
      variant: 'default',
      title: 'Upload erfolgreich',
      description: 'Daten erfolgreich auf OpenSenseMap hochgeladen',
    })
  }
}
