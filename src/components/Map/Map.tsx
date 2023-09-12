'use client'

import { MapProps, MapRef, Map as ReactMap } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
// import 'maplibre-gl/dist/maplibre-gl.css'
import { forwardRef } from 'react'
import { Props } from 'maplibre-gl'

const Map = forwardRef<MapRef, MapProps>(
  ({ children, mapStyle, ...props }, ref) => {
    return (
      // @ts-ignore
      <ReactMap
        initialViewState={{
          longitude: 7.629040078544051,
          latitude: 51.95991276754322,
          zoom: 14,
          pitch: 45,
        }}
        mapStyle={
          mapStyle ||
          'https://api.maptiler.com/maps/streets/style.json?key=DT8RRRX6sOuzQrcuhKuE'
        }
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
        }}
        {...props}
      >
        {children}
      </ReactMap>
    )
  },
)

Map.displayName = 'Map'

export default Map
