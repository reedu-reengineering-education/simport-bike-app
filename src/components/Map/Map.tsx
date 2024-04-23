'use client'

import 'mapbox-gl/dist/mapbox-gl.css'
import { useTheme } from 'next-themes'
import { forwardRef, useEffect } from 'react'
import { MapProps, MapRef, Map as ReactMap } from 'react-map-gl'

const Map = forwardRef<MapRef, MapProps>(
  ({ children, mapStyle, ...props }, ref) => {
    const { theme } = useTheme()

    useEffect(() => {
      // @ts-ignore
      if (!ref.current) return

      // @ts-ignore
      onMapLoad({ target: ref.current })
    }, [theme])

    const onMapLoad = (e: mapboxgl.MapboxEvent<undefined>) => {
      // @ts-ignore
      e.target.setConfigProperty(
        'basemap',
        'lightPreset',
        theme === 'dark' ? 'night' : '',
      )
    }

    return (
      // @ts-ignore
      <ReactMap
        mapStyle={mapStyle || 'mapbox://styles/mapbox/standard'}
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
