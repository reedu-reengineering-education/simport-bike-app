'use client'

import MapComponent from '@/components/Map/Map'
import { useEffect, useState } from 'react'
import MeasurementsOverview from '@/components/Map/MeasurementsOverview'
import ControlBar from '@/components/Map/ControlBar'
import useSenseBox from '@/lib/useSenseBox'
import LocationMarker from '@/components/Map/LocationMarker'

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
  }, [connect, disconnect, isConnected, recording])

  return (
    <div className="relative h-full w-full">
      <MapComponent>
        {values && values.length > 0 && (
          <>
            <LocationMarker
              location={{
                latitude: values.at(-1)?.gps_lat || 0,
                longitude: values.at(-1)?.gps_lng || 0,
                accuracy: 10,
                simulated: false,
                altitude: null,
                altitudeAccuracy: null,
                bearing: null,
                speed: null,
                time: null,
              }}
            />
          </>
        )}
      </MapComponent>
      <div className="pointer-events-none absolute inset-0 left-0 top-0 flex h-full w-full flex-col items-center justify-between gap-2 p-4">
        {values && values.length > 0 && (
          <MeasurementsOverview
            data={values.at(-1)}
            isConnected={isConnected}
          />
        )}
        <ControlBar
          recording={recording}
          toggleRecording={() => setRecording(!recording)}
        />
      </div>
    </div>
  )
}
