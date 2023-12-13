'use client'

import { useThemeDetector } from '@/lib/useThemeDetector'
import 'mapbox-gl/dist/mapbox-gl.css'
import { forwardRef } from 'react'
import { MapProps, MapRef, Map as ReactMap } from 'react-map-gl'

const Map = forwardRef<MapRef, MapProps>(
  ({ children, mapStyle, ...props }, ref) => {
    const isDarkTheme = useThemeDetector()

    const basemap = isDarkTheme ? 'dataviz-dark' : 'streets-v2'

    return (
      <ReactMap
        // mapStyle={
        //   mapStyle ||
        //   `https://api.maptiler.com/maps/${basemap}/style.json?key=DT8RRRX6sOuzQrcuhKuE`
        // }
        mapStyle={'mapbox://styles/mapbox/standard-beta'}
        mapboxAccessToken="pk.eyJ1IjoiZmVsaXhhZXRlbSIsImEiOiJjbHEzcjU3NzYwMnoyMmxxc2tlMW1vbmFwIn0.siWJ5A1mROXYdu-Fv2-k5w"
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
        }}
        // TODO: add dawn, day, dusk, night mode depending on time
        // onLoad={e =>
        // e.target.setConfigProperty('basemap', 'lightPreset', 'night')
        // }
        {...props}
      >
        {children}
      </ReactMap>
    )
  },
)

Map.displayName = 'Map'

export default Map
