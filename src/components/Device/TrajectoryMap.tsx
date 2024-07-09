import { useRawBLEDataStore } from '@/lib/store/use-raw-data-store'
import { useExclusionZoneStore } from '@/lib/store/useExclusionZoneStore'
import { useMapViewportState } from '@/lib/store/useMapViewportStore'
import { useEffect, useRef } from 'react'
import { AttributionControl, Layer, MapRef, Source } from 'react-map-gl'
import MapComponent from '../Map/Map'
import TrajectoryLayer from '../Map/layers/trajectory'

export default function TrajectoryMap() {
  const initialViewState = useMapViewportState(state => state.viewport)
  const setViewport = useMapViewportState(state => state.setViewport)

  const zones = useExclusionZoneStore(state => state.zones)

  const mapRef = useRef<MapRef>(null)

  const trajectory = useRawBLEDataStore(state => state.rawGeolocationData)

  useEffect(() => {
    const center = trajectory?.coordinates?.at(-1) as [number, number]

    if (center && mapRef.current && !mapRef.current?.isMoving()) {
      const zoom =
        mapRef.current?.getZoom() > 10 ? mapRef.current.getZoom() : 18

      mapRef.current?.flyTo({
        center,
        zoom,
        pitch: 45,
      })
    }
  }, [trajectory])

  return (
    <MapComponent
      ref={mapRef}
      initialViewState={initialViewState}
      onMove={({ viewState }) => setViewport(viewState)}
      attributionControl={false}
      reuseMaps
    >
      <AttributionControl
        position="top-left"
        style={{
          marginTop: 'calc(0.75rem + env(safe-area-inset-top))',
        }}
      />
      {zones && zones.features.length > 0 && (
        <Source data={zones} type="geojson">
          <Layer
            id="exclusion-zones"
            type="fill"
            paint={{
              'fill-color': '#f00',
              'fill-opacity': 0.2,
            }}
          />
        </Source>
      )}
      <TrajectoryLayer
        // @ts-ignore
        trajectory={trajectory.coordinates.map(g => ({
          latitude: g[1],
          longitude: g[0],
        }))}
      />
    </MapComponent>
  )
}
