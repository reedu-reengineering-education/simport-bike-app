'use client'

import 'maplibre-gl/dist/maplibre-gl.css'
import { useTheme } from 'next-themes'
import { forwardRef } from 'react'
import { MapProps, MapRef, Map as ReactMap } from 'react-map-gl/maplibre'

const Map = forwardRef<MapRef, MapProps>(
  ({ children, mapStyle, ...props }, ref) => {
    const { theme } = useTheme()

    const basemap = theme === 'dark' ? 'dataviz-dark' : 'streets-v2'

    return (
      // @ts-ignore
      <ReactMap
        mapStyle={
          mapStyle ||
          `https://api.maptiler.com/maps/${basemap}/style.json?key=DT8RRRX6sOuzQrcuhKuE`
        }
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
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
