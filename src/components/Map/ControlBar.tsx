import { PauseIcon, PlayIcon } from '@heroicons/react/24/outline'
import SettingsModal from './Settings'
import { Card } from '../ui/card'
import useSenseBox from '@/lib/useSenseBox'

export default function ControlBar() {
  const { connect, isConnected, disconnect } = useSenseBox()

  return (
    <Card className="pointer-events-auto flex w-fit items-center gap-2 rounded-lg bg-background p-2">
      {isConnected ? (
        <PauseIcon className="h-8 w-8" onClick={() => disconnect()} />
      ) : (
        <PlayIcon className="h-8 w-8" onClick={() => connect()} />
      )}
      <div className="h-10 border-l-2 border-gray-200"></div>
      <SettingsModal />
    </Card>
  )
}
