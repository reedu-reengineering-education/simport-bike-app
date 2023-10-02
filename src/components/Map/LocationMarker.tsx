import { Location } from '@capacitor-community/background-geolocation'
import Layer from 'react-map-gl/dist/esm/components/layer'
import Source from 'react-map-gl/dist/esm/components/source'
// @ts-ignore
import circle from '@turf/circle'

export default function LocationMarker({ location }: { location: Location }) {
  const circlePoly = circle(
    [location?.longitude, location?.latitude],
    location.accuracy,
    {
      units: 'meters',
    },
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
          }}
        />
      </Source>
    </>
  )
}
