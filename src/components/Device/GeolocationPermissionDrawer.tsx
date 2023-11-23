'use client'

import { usePermissionsStore } from '@/lib/store/usePermissionsStore'
import { Drawer } from 'vaul'
import { Button } from '../ui/button'
import SliderDrawer from '../ui/slider-drawer'

export default function GeolocationPermissionDrawer() {
  const showGeolocationPermissionsDrawer = usePermissionsStore(
    state => state.showGeolocationPermissionsDrawer,
  )
  const setShowGeolocationPermissionsDrawer = usePermissionsStore(
    state => state.setShowGeolocationPermissionsDrawer,
  )
  const setGeolocationPermissionGranted = usePermissionsStore(
    state => state.setGeolocationPermissionGranted,
  )

  return (
    <SliderDrawer
      open={showGeolocationPermissionsDrawer}
      onOpenChange={setShowGeolocationPermissionsDrawer}
    >
      <div className="mx-auto max-w-md">
        <Drawer.Title>Geolocation permission required</Drawer.Title>

        <p className="my-6">
          senseBox:bike erhebt Standortdaten, um deine Fahrt aufzuzeichnen und
          deine Positionen mit Umweltdaten zu verknüpfen, auch wenn die App
          geschlossen ist oder nicht verwendet wird.
        </p>
        <div className="flex w-full gap-2">
          <Drawer.Close className="flex-1" asChild>
            <Button variant={'secondary'}>Ablehnen</Button>
          </Drawer.Close>
          <Button
            className="flex-1"
            onClick={() => setGeolocationPermissionGranted(true)}
          >
            Akzeptieren
          </Button>
        </div>
      </div>
    </SliderDrawer>
  )
}
