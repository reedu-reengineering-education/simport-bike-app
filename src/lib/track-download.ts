import { Directory, Encoding, Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import { format } from 'date-fns'
import { Track, useTracksStore } from './store/useTracksStore'

export default async function downloadTrack(id: Track['id']) {
  const track = useTracksStore.getState().tracks.find(track => track.id === id)

  if (!track) return

  const csvHeaders = [
    'timestamp',
    'temperature',
    'humidity',
    'pm1',
    'pm2_5',
    'pm4',
    'pm10',
    'acceleration_x',
    'acceleration_y',
    'acceleration_z',
    'distance_l',
    'gps_spd',
    'gps_lat',
    'gps_lng',
  ]
  const csvBody = track.measurements
    .map(measurement => {
      return `${measurement.timestamp},${measurement.temperature},${measurement.humidity},${measurement.pm1},${measurement.pm2_5},${measurement.pm4},${measurement.pm10},${measurement.acceleration_x},${measurement.acceleration_y},${measurement.acceleration_z},${measurement.distance_l},${measurement.gps_spd},${measurement.gps_lat},${measurement.gps_lng}`
    })
    .join('\n')

  const data = `${csvHeaders.join(',')}\n${csvBody}`

  const filename = `sb_track_${format(
    new Date(track.start),
    'yyyy-MM-dd_HH-mm-ss',
  )}.csv`

  const writeResult = await Filesystem.writeFile({
    path: filename,
    data: data,
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
