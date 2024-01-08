import DeviceMapWrapper from '@/components/Device/DeviceMapWrapper'
import GeolocationPermissionDrawer from '@/components/Device/GeolocationPermissionDrawer'

export default function Home() {
  return (
    <>
      <DeviceMapWrapper />
      <GeolocationPermissionDrawer />
    </>
  )
}
