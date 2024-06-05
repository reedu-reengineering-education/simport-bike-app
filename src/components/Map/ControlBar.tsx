import useBLEDevice from '@/lib/useBLE'
import useRecordTrack from '@/lib/useRecordTrack'
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

const ControlBar = forwardRef<HTMLDivElement>((_, ref) => {
  const { connect, isConnected, disconnect } = useBLEDevice({
    namePrefix: 'senseBox',
  })

  // const selectedBox = useAuthStore(state => state.selectedBox)

  const { isRecording, start, stop, isLoading } = useRecordTrack()
  // const setShowWizardDrawer = useUIStore(state => state.setShowWizardDrawer)

  return (
    <div
      className="flex w-full justify-between gap-2 p-2 pb-safe-or-4"
      ref={ref}
    >
      {!isConnected ? (
        <div className="mx-auto flex w-full max-w-xl rounded-md bg-primary/25">
          <Button size={'sm'} className="w-full" onClick={() => connect()}>
            <Bluetooth className="mr-2 h-4" />
            Verbinden
          </Button>
          <ConnectWithCamera />
        </div>
      ) : (
        <Button
          size={'sm'}
          className="mx-auto w-full max-w-xl"
          onClick={() => disconnect()}
        >
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
