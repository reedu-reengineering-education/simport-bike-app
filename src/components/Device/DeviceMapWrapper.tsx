'use client'

import MapComponent from '@/components/Map/Map'
import useSenseBox from '@/lib/useSenseBox'
import LocationMarker from '@/components/Map/LocationMarker'
import LocationHistory from '@/components/Map/LocationHistory'
import MeasurementsGrid from '../Map/MeasurementsGrid'
import { useEffect, useRef, useState } from 'react'
import { MapRef } from 'react-map-gl/dist/esm/exports-maplibre'
import { Drawer } from 'vaul'

export default function DeviceMapWrapper() {
  const { values } = useSenseBox()

  const mapRef = useRef<MapRef>(null)

  const [snap, setSnap] = useState(0.2)

  useEffect(() => {
    const latestValue = values.at(-1)
    if (latestValue && latestValue.gps_lat && latestValue.gps_lng) {
      mapRef.current?.flyTo({
        center: [latestValue.gps_lng, latestValue.gps_lat],
        zoom: mapRef.current?.getZoom() > 10 ? mapRef.current.getZoom() : 15,
        padding: {
          bottom: mapRef.current.getContainer().clientHeight * snap,
        },
      })
    }
  }, [values])

  return (
    <div className="flex h-full w-full portrait:flex-col">
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
      </div>
      <div className="portrait:border-b landscape:border-r-2">
        <Drawer.Root
          open
          modal={false}
          dismissible={false}
          snapPoints={[0.2, 0.55, 0.85]}
          activeSnapPoint={snap}
          setActiveSnapPoint={snap => {
            if (!snap) return
            if (typeof snap === 'string') {
              setSnap(parseFloat(snap))
            } else if (snap < 0.2) {
              setSnap(0.2)
            } else {
              setSnap(snap)
            }
          }}
        >
          <Drawer.Portal>
            <Drawer.Content className="fixed bottom-0 left-0 right-0 z-30 flex h-full max-h-[95%] flex-col rounded-t-lg border-t bg-background pb-safe focus:outline-none">
              <div
                className="mx-auto mb-2 mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted"
                onClick={() => setSnap(0.55)}
              />
              <MeasurementsGrid layoutFull={snap > 0.7} />
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </div>
  )
}
