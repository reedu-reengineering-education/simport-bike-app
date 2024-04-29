'use client'

import { useEffect, useRef, useState } from 'react'
import ControlBar from '../Map/ControlBar'
import MeasurementsGrid from '../Map/MeasurementsGrid'
import WizardDrawer from '../Wizard/WizardDrawer'
import { Drawer, DrawerContent, DrawerFooter } from '../ui/drawer'
import TrajectoryMap from './TrajectoryMap'

const DRAG_HANDLE_HEIGHT = 8 + 16
const HANDLE_PADDING = 8

export default function DeviceMapWrapper() {
  const [snap, setSnap] = useState(
    (DRAG_HANDLE_HEIGHT + HANDLE_PADDING + 60 + 256) / window.innerHeight,
  )
  const [snapPoints, setSnapPoints] = useState<number[]>([
    (DRAG_HANDLE_HEIGHT + HANDLE_PADDING + 60) / window.innerHeight,
    (DRAG_HANDLE_HEIGHT + HANDLE_PADDING + 60 + 256) / window.innerHeight,
  ])

  const controlBarRef = useRef<HTMLDivElement>(null)
  const drawerContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!controlBarRef.current && !drawerContentRef.current) return

    const handleHeight = DRAG_HANDLE_HEIGHT + HANDLE_PADDING
    const controlBarHeight = controlBarRef.current?.offsetHeight || 0
    const drawerContentHeight = drawerContentRef.current?.offsetHeight || 0

    const minSnap = (handleHeight + controlBarHeight) / window.innerHeight
    const maxSnap =
      (handleHeight + controlBarHeight + drawerContentHeight) /
      window.innerHeight

    setSnapPoints([minSnap, maxSnap])
  }, [controlBarRef.current, drawerContentRef.current])

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
            snapPoints={snapPoints}
            activeSnapPoint={snap}
            shouldScaleBackground={false}
            setActiveSnapPoint={cursnap => {
              if (!cursnap) return
              if (typeof cursnap === 'string') {
                setSnap(parseFloat(cursnap))
              } else if (cursnap < snapPoints[0]) {
                setSnap(snapPoints[0])
              } else {
                setSnap(cursnap)
              }
            }}
          >
            <DrawerContent className="h-full">
              <div className="mt-2" />
              <ControlBar ref={controlBarRef} />
              <MeasurementsGrid ref={drawerContentRef} />
              <DrawerFooter />
            </DrawerContent>
          </Drawer>
        </div>
      </div>
      <WizardDrawer />
    </>
  )
}
