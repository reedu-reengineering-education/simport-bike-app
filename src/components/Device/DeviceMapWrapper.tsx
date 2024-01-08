'use client'

import { useState } from 'react'
import MeasurementsGrid from '../Map/MeasurementsGrid'
import WizardDrawer from '../Wizard/WizardDrawer'
import { Drawer, DrawerContent } from '../ui/drawer'
import TrajectoryMap from './TrajectoryMap'

export default function DeviceMapWrapper() {
  const [snap, setSnap] = useState(0.2)

  return (
    <>
      <div className="flex h-full w-full portrait:flex-col">
        <div className="relative h-full w-full">
          <TrajectoryMap paddingBottom={snap} />
        </div>
        <div className="portrait:border-b landscape:border-r-2">
          <Drawer
            open
            modal={false}
            dismissible={false}
            snapPoints={[0.2, 0.55]}
            activeSnapPoint={snap}
            shouldScaleBackground={false}
            setActiveSnapPoint={snap => {
              if (!snap) return
              if (typeof snap === 'string') {
                setSnap(parseFloat(snap))
              } else if (snap < 0.2) {
                setSnap(0.2)
              } else {
                setSnap(snap)
              }
            }}
          >
            <DrawerContent className="h-full">
              <MeasurementsGrid />
            </DrawerContent>
          </Drawer>
        </div>
      </div>
      <WizardDrawer />
    </>
  )
}
