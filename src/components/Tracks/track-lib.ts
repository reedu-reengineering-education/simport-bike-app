import { Geolocation } from '@/lib/db/entities'
import { Track } from '@/lib/store/useTracksStore'

import {
  buffer,
  bbox,
  featureCollection,
  lineDistance,
  lineString,
  point,
} from '@turf/turf'

export function getGeolocationBBox(geolocations: Geolocation[]) {
  return bbox(
    buffer(
      featureCollection(
        geolocations.map(g => point([g.longitude, g.latitude])),
      ),
      0.2,
    ),
  )
}

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
