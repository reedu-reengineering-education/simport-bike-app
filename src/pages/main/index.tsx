import DeviceMapWrapper from '@/components/Device/DeviceMapWrapper'
import GeolocationPermissionDrawer from '@/components/Device/GeolocationPermissionDrawer'
import { TopBar } from '@/components/ui/TopBar'

export default function MainPage() {
  return (
    <div className="relative h-full w-full">
      <main className="h-full w-full overflow-auto landscape:pl-safe">
        <DeviceMapWrapper />
        <GeolocationPermissionDrawer />
      </main>
      <div className="absolute top-0 w-screen backdrop-blur pt-safe" />
      <header className="absolute right-0 top-0 w-fit mt-safe">
        <TopBar />
      </header>
    </div>
  )
}
