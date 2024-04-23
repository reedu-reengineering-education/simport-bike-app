'use client'

import { useThemeDetector } from '@/lib/useThemeDetector'
import 'mapbox-gl/dist/mapbox-gl.css'
import { forwardRef } from 'react'
import { MapProps, MapRef, Map as ReactMap } from 'react-map-gl'

const Map = forwardRef<MapRef, MapProps>(
  ({ children, mapStyle, ...props }, ref) => {
    const isDarkTheme = useThemeDetector()

    const basemap = isDarkTheme ? 'dataviz-dark' : 'streets-v2'

    const onMapLoad = (e: mapboxgl.MapboxEvent<undefined>) => {
      // @ts-ignore
      e.target.setConfigProperty(
        'basemap',
        'lightPreset',
        isDarkTheme ? 'night' : '',
      )
    }

    return (
      // @ts-ignore
      <ReactMap
        mapStyle={
          mapStyle || 'mapbox://styles/mapbox/standard?lightPreset=dawn'
        }
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
        }}
        onLoad={onMapLoad}
        projection={{
          name: 'globe',
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
