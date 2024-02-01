import useSenseBox from '@/lib/useSenseBox'
import useUploadToOpenSenseMap from '@/lib/useUploadToOpenSenseMap'
import {
  Bluetooth,
  BluetoothOff,
  Circle,
  Square,
  UploadCloud,
} from 'lucide-react'
import { forwardRef } from 'react'
import ConnectWithCamera from '../Device/ConnectWithCamera'
import { Button } from '../ui/button'

const ControlBar = forwardRef<HTMLDivElement>(({}, ref) => {
  const { connect, isConnected, disconnect } = useSenseBox()

  // const selectedBox = useAuthStore(state => state.selectedBox)

  const { isRecording, start, stop, isLoading } = useUploadToOpenSenseMap()
  // const setShowWizardDrawer = useUIStore(state => state.setShowWizardDrawer)

  return (
    <div
      className="flex w-full justify-between gap-2 p-2 pb-safe-or-4"
      ref={ref}
    >
      {!isConnected ? (
        <div className="flex w-full rounded-md bg-primary/25">
          <Button size={'sm'} className="w-full" onClick={() => connect()}>
            <Bluetooth className="mr-2 h-4" />
            Verbinden
          </Button>
          <ConnectWithCamera />
        </div>
      ) : (
        <Button size={'sm'} className="w-full" onClick={() => disconnect()}>
          <BluetoothOff className="mr-2 h-4" />
          Trennen
        </Button>
      )}
      {isConnected ? (
        !isRecording ? (
          <Button
            size={'sm'}
            className="w-full"
            onClick={() => start()}
            variant={'secondary'}
          >
            <Circle className="mr-2 h-5 fill-red-500 text-red-500" />
            Aufzeichnen
          </Button>
        ) : (
          <>
            <Button
              size={'sm'}
              className="w-full"
              onClick={() => stop()}
              variant={'secondary'}
            >
              {isLoading && (
                <UploadCloud className="mr-2 h-5 animate-pulse opacity-50" />
              )}
              {!isLoading && (
                <Square className="mr-2 h-5 fill-red-500 text-red-500" />
              )}
              Stop
            </Button>
          </>
        )
      ) : (
        <></>
      )}
    </div>
  )
})

ControlBar.displayName = 'ControlBar'

export default ControlBar
