'use client'

import { useMapViewportState } from '@/lib/store/useMapViewportStore'
import { useSettingsStore } from '@/lib/store/useSettingsStore'
import useSenseBox from '@/lib/useSenseBox'
import { bearing, point } from '@turf/turf'
import { LngLatLike } from 'maplibre-gl'
import { useEffect, useRef } from 'react'
import { MapRef } from 'react-map-gl/dist/esm/exports-maplibre'
import LocationHistory from '../Map/LocationHistory'
import LocationMarker from '../Map/LocationMarker'
import MapComponent from '../Map/Map'

export default function TrajectoryMap() {
  const { values } = useSenseBox()
  const reducedMotion = useSettingsStore(state => state.reducedMotion)

  const initialViewState = useMapViewportState(state => state.viewport)
  const setViewport = useMapViewportState(state => state.setViewport)

  const mapRef = useRef<MapRef>(null)

  useEffect(() => {
    const latestValue = values.at(-1)
    if (
      latestValue &&
      latestValue.gps_lat &&
      latestValue.gps_lng &&
      mapRef.current &&
      !mapRef.current?.isMoving()
    ) {
      const center = [latestValue.gps_lng, latestValue.gps_lat] as LngLatLike
      const zoom =
        mapRef.current?.getZoom() > 10 ? mapRef.current.getZoom() : 18
      let mapBearing = mapRef.current?.getBearing()
      let pitch = mapRef.current?.getPitch()
      const valueBefore = values.at(-2)
      if (
        valueBefore?.gps_lat &&
        valueBefore?.gps_lng &&
        (latestValue?.gps_spd ?? 0) > 5
      ) {
        mapBearing = bearing(
          point([valueBefore.gps_lng, valueBefore.gps_lat]),
          point([latestValue.gps_lng, latestValue.gps_lat]),
        )
        pitch = 60
      } else {
        mapBearing = 0
        pitch = 0
      }

      if (reducedMotion) {
        mapRef.current?.setCenter(center)
        mapRef.current?.setZoom(zoom)
        mapRef.current?.setBearing(mapBearing)
        mapRef.current?.setPitch(pitch)
      } else {
        mapRef.current?.flyTo({
          center,
          zoom,
          bearing: mapBearing,
          pitch,
        })
      }
    }
  }, [values])

  return (
    <MapComponent
      ref={mapRef}
      initialViewState={initialViewState}
      onMove={({ viewState }) => setViewport(viewState)}
    >
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
  )
}
