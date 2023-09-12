'use client'

import MapComponent from '@/components/Map/Map'
import { useEffect, useState } from 'react'
import MeasurementsOverview from '@/components/Map/MeasurementsOverview'
import ControlBar from '@/components/Map/ControlBar'
import useSenseBox from '@/lib/useSenseBox'
import { Source, Layer } from 'react-map-gl/maplibre'

export default function Home() {
  const [recording, setRecording] = useState(false)

  const { values, connect, isConnected, disconnect } = useSenseBox()

  useEffect(() => {
    if (recording && !isConnected) {
      connect()
      return
    }
    if (!recording && isConnected) {
      disconnect()
      return
    }
  })

  return (
    <div className="relative h-full w-full">
      <MapComponent>
        <Source
          id="location"
          type="geojson"
          data={{
            type: 'Point',
            coordinates: [
              values.at(-1)?.gps_lat || 0,
              values.at(-1)?.gps_lng || 0,
            ],
          }}
        >
          <Layer
            id="point"
            type="circle"
            paint={{
              'circle-radius': 10,
              'circle-color': '#007cbf',
            }}
          />
        </Source>
        <Source
          id="location-history"
          type="geojson"
          data={{
            features: values.map(v => ({
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: [v.gps_lat || 0, v.gps_lng || 0],
              },
            })),
            type: 'FeatureCollection',
          }}
        >
          <Layer id="point" type="line" />
        </Source>
      </MapComponent>
      <div className="pointer-events-none absolute inset-0 left-0 top-0 flex h-full w-full flex-col items-center justify-between gap-2 p-4">
        <MeasurementsOverview data={values.at(-1)} isConnected={isConnected} />

        <ControlBar
          recording={recording}
          toggleRecording={() => setRecording(!recording)}
        />
      </div>
    </div>
  )
}
