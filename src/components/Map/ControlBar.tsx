import { PauseIcon, PlayIcon } from '@heroicons/react/24/outline'
import { Card } from '../ui/card'
import useSenseBox from '@/lib/useSenseBox'
import { BluetoothIcon, BluetoothOffIcon, Circle, Square } from 'lucide-react'
import useUploadToOpenSenseMap from '@/lib/useUploadToOpenSenseMap'
import { useAuthStore } from '@/lib/store/useAuthStore'
import WizardDrawer from '../Wizard/WizardDrawer'

export default function ControlBar() {
  const { connect, isConnected, disconnect } = useSenseBox()
  const { selectedBox } = useAuthStore()
  const { isRecording, start, stop } = useUploadToOpenSenseMap()

  return (
    <Card className="pointer-events-auto flex w-fit items-center gap-2 rounded-lg bg-background p-4">
      {isConnected ? (
        <BluetoothOffIcon className="h-8 w-8" onClick={() => disconnect()} />
      ) : (
        <BluetoothIcon className="h-8 w-8" onClick={() => connect()} />
      )}
      {isConnected && !selectedBox && <WizardDrawer />}
      {selectedBox && isConnected && (
        <>
          <div className="mx-2 h-full border border-muted" />
          {isRecording ? (
            <Square
              className="h-8 w-8 fill-red-500 text-red-500"
              onClick={() => stop()}
            />
          ) : (
            <Circle
              className="h-8 w-8 fill-red-500 text-red-500"
              onClick={() => start()}
            />
          )}
        </>
      )}
    </Card>
  )
}
