import 'mapbox-gl/dist/mapbox-gl.css'
import { useTheme } from 'next-themes'
import { forwardRef, useEffect, useRef } from 'react'
import { MapProps, MapRef, Map as ReactMap } from 'react-map-gl'

const InteractiveMap = forwardRef<MapRef, MapProps>(
  ({ children, mapStyle, ...props }, ref) => {
    const { theme } = useTheme()

    const localRef = useRef<MapRef>(null)
    const mapRef = ref || localRef

    useEffect(() => {
      // @ts-ignore
      if (!mapRef.current) return

      // @ts-ignore
      // onMapLoad({ target: mapRef.current })
    }, [theme])

    // const onMapLoad = (e: mapboxgl.MapboxEvent<undefined>) => {
    //   if (!e.target) return

    //   if (!e.target.isStyleLoaded()) return

    //   // @ts-ignore
    //   e.target.setConfigProperty(
    //     'basemap',
    //     'lightPreset',
    //     theme === 'dark' ? 'night' : '',
    //   )
    // }

    return (
      // @ts-ignore
      <ReactMap
        mapStyle={
          mapStyle || theme === 'dark'
            ? 'mapbox://styles/mapbox/dark-v11'
            : 'mapbox://styles/mapbox/outdoors-v12'
        }
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
        }}
        // onLoad={onMapLoad}
        // @ts-ignore
        projection={{
          name: 'mercator',
        }}
        {...props}
      >
        {children}
      </ReactMap>
    )
  },
)

InteractiveMap.displayName = 'Map'

export default InteractiveMap
