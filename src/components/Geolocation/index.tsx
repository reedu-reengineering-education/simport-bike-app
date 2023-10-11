'use client'

import { useEffect, useState } from 'react'
import { registerPlugin } from '@capacitor/core'
import {
  BackgroundGeolocationPlugin,
  Location,
} from '@capacitor-community/background-geolocation'
import { Button } from '../ui/button'
import MapComponent from '@/components/Map/Map'
import LocationMarker from '../Map/LocationMarker'

const BackgroundGeolocation = registerPlugin<BackgroundGeolocationPlugin>(
  'BackgroundGeolocation',
)

export default function Geolocation() {
  const [location, setLocation] = useState<Location>()

  useEffect(() => {
    let watcherId: string

    BackgroundGeolocation.addWatcher(
      {
        backgroundMessage: 'Cancel to prevent battery drain.',
        backgroundTitle: 'Tracking You.',
        requestPermissions: true,
        stale: false,
      },
      function callback(location, error) {
        if (error) {
          if (error.code === 'NOT_AUTHORIZED') {
            if (
              window.confirm(
                'This app needs your location, ' +
                  'but does not have permission.\n\n' +
                  'Open settings now?',
              )
            ) {
              BackgroundGeolocation.openSettings()
            }
          }
          console.error(error)
        } else {
          setLocation(location)
        }
      },
    ).then(watcherId => {
      watcherId = watcherId
    })

    return () => {
      console.log('in unmount')
      if (!watcherId) return

      console.log('removing watcher', watcherId)
      BackgroundGeolocation.removeWatcher({
        id: watcherId,
      })
    }
  }, [])

  return (
    <div>
      Geolocation
      <Button onClick={() => BackgroundGeolocation.openSettings()}>
        Settings
      </Button>
      <div className="h-96 w-full overflow-hidden rounded">
        <MapComponent>
          {location && <LocationMarker location={location} />}
        </MapComponent>
      </div>
      <div>{JSON.stringify(location, undefined, '\t')}</div>
    </div>
  )
}