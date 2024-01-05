'use client'

import { useState } from 'react'
import MeasurementsGrid from '../Map/MeasurementsGrid'
import { Drawer, DrawerContent } from '../ui/drawer'
import TrajectoryMap from './TrajectoryMap'

export default function DeviceMapWrapper() {
  const [snap, setSnap] = useState(0.2)

  return (
    <div className="flex h-full w-full flex-row-reverse portrait:flex-col">
      <div className="relative h-full w-full">
        <TrajectoryMap paddingBottom={snap} />
      </div>
      <div className="hidden portrait:visible portrait:border-b">
        <Drawer
          shouldScaleBackground={false}
          open
          modal={false}
          dismissible={false}
          snapPoints={[0.2]}
          // activeSnapPoint={snap}
          // setActiveSnapPoint={snap => {
          //   if (!snap) return
          //   if (typeof snap === 'string') {
          //     setSnap(parseFloat(snap))
          //   } else if (snap < 0.2) {
          //     setSnap(0.2)
          //   } else {
          //     setSnap(snap)
          //   }
          // }}
        >
          <DrawerContent>
            <MeasurementsGrid />
          </DrawerContent>
        </Drawer>
      </div>
      <div className="portrait:hidden landscape:border-r-2">
        <MeasurementsGrid />
      </div>
    </div>
  )
}
