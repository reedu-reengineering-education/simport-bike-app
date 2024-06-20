import DeviceMapWrapper from '@/components/Device/DeviceMapWrapper'
import GeolocationPermissionDrawer from '@/components/Device/GeolocationPermissionDrawer'
import KimsDataViz from '@/components/kims-data-viz'
import { TopBar } from '@/components/ui/TopBar'

export default function MainPage() {
  return (
    <div className="relative h-full w-full">
      <main className="h-full w-full overflow-auto landscape:pl-safe">
        <DeviceMapWrapper />
        <GeolocationPermissionDrawer />
      </main>
      <div className="absolute top-0 w-screen backdrop-blur pt-safe" />
      <div className="absolute top-0 left-0 h-full w-full pointer-events-none">
        <KimsDataViz />
      </div>
      <header className="absolute right-0 top-0 w-fit mt-safe">
        <TopBar />
      </header>
    </div>
  )
}
