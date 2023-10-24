'use client'

import MapComponent from '@/components/Map/Map'
import MeasurementsOverview from '@/components/Map/MeasurementsOverview'
import ControlBar from '@/components/Map/ControlBar'
import useSenseBox from '@/lib/useSenseBox'
import LocationMarker from '@/components/Map/LocationMarker'
import LocationHistory from '@/components/Map/LocationHistory'
import MeasurementsGrid from '../Map/MeasurementsGrid'
import { useEffect, useRef } from 'react'
import { MapRef } from 'react-map-gl/dist/esm/exports-maplibre'
import { map } from 'zod'

export default function DeviceMapWrapper() {
  const { values } = useSenseBox()

  const mapRef = useRef<MapRef>(null)

  useEffect(() => {
    const latestValue = values.at(-1)
    if (latestValue && latestValue.gps_lat && latestValue.gps_lng) {
      mapRef.current?.flyTo({
        center: [latestValue.gps_lng, latestValue.gps_lat],
        zoom: mapRef.current?.getZoom() > 10 ? mapRef.current.getZoom() : 15,
      })
    }
  }, [values])

  return (
    <div className="flex h-full w-full portrait:flex-col">
      <div className="border-b-2">
        <MeasurementsGrid />
      </div>
      <div className="relative h-full w-full">
        <MapComponent ref={mapRef}>
          {values && values.length > 0 && (
            <>
              <LocationHistory values={values} />
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
        <div className="pointer-events-none absolute inset-0 bottom-0 left-0 flex h-full w-full flex-col items-center justify-end gap-2 p-4 pb-safe-offset-2">
          <ControlBar />
        </div>
      </div>
    </div>
  )
}
