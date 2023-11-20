import { Location } from '@felixerdy/background-geolocation'
import { Source, Layer } from 'react-map-gl/maplibre'

import { point, circle } from '@turf/turf'

export default function LocationMarker({ location }: { location: Location }) {
  const circlePoly = circle(
    point([location?.longitude, location?.latitude]),
    location.accuracy / 1000,
    64,
    'kilometers',
  )

  return (
    <>
      <Source id="location-accuracy" type="geojson" data={circlePoly}>
        <Layer
          id="accuracy"
          type="fill"
          paint={{
            'fill-color': '#007cbf',
            'fill-opacity': 0.2,
          }}
        />
      </Source>
      <Source
        id="location"
        type="geojson"
        data={{
          type: 'Point',
          coordinates: [location?.longitude, location?.latitude],
        }}
      >
        <Layer
          id="point"
          type="circle"
          paint={{
            'circle-radius': 8,
            'circle-color': '#007cbf',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
            'circle-pitch-alignment': 'map',
          }}
        />
      </Source>
    </>
  )
}
