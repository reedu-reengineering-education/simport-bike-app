import { Track } from '@/lib/store/useTracksStore'

import {
  bbox,
  buffer,
  point,
  featureCollection,
  lineString,
  lineDistance,
} from '@turf/turf'

export function getBBox(track: Track) {
  return bbox(
    buffer(
      featureCollection(
        track.measurements.map(m => point([m.gps_lng!, m.gps_lat!])),
      ),
      0.2,
    ),
  )
}

export function getDistance(track: Track) {
  const line = lineString(track.measurements.map(m => [m.gps_lng!, m.gps_lat!]))
  return lineDistance(line, 'kilometers')
}
