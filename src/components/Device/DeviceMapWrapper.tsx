'use client'

import { useState } from 'react'
import { Drawer } from 'vaul'
import MeasurementsGrid from '../Map/MeasurementsGrid'
import TrajectoryMap from './TrajectoryMap'

export default function DeviceMapWrapper() {
  const [snap, setSnap] = useState(0.2)

  return (
    <div className="flex h-full w-full flex-row-reverse portrait:flex-col">
      <div className="relative h-full w-full">
        <TrajectoryMap paddingBottom={snap} />
      </div>
      <div className="hidden portrait:visible portrait:border-b">
        <Drawer.Root
          open
          modal={false}
          dismissible={false}
          snapPoints={[0.2, 0.55]}
          activeSnapPoint={snap}
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
          <Drawer.Portal>
            <Drawer.Content className="fixed bottom-0 left-0 right-0 z-30 flex h-full max-h-[95%] flex-col rounded-t-lg border-t bg-background pb-safe focus:outline-none">
              <div
                className="mx-auto mb-2 mt-4 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted"
                onClick={() => setSnap(0.55)}
              />
              <MeasurementsGrid />
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
      <div className="portrait:hidden landscape:border-r-2">
        <MeasurementsGrid />
      </div>
    </div>
  )
}
