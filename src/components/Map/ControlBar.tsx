import { PauseIcon, PlayIcon } from '@heroicons/react/24/outline'
import SettingsModal from './Settings'
import { Card } from '../ui/card'

export default function ControlBar({
  recording,
  toggleRecording,
}: {
  recording: boolean
  toggleRecording: () => void
}) {
  return (
    <Card className="pointer-events-auto flex w-fit items-center gap-2 rounded-lg bg-white p-2">
      {recording ? (
        <PauseIcon className="h-8 w-8" onClick={() => toggleRecording()} />
      ) : (
        <PlayIcon className="h-8 w-8" onClick={() => toggleRecording()} />
      )}
      <div className="h-10 border-l-2 border-gray-200"></div>
      <SettingsModal />
    </Card>
  )
}
