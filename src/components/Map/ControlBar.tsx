import {
  BeakerIcon,
  ChartBarIcon,
  CloudIcon,
  PauseIcon,
  PlayIcon,
  RssIcon,
  SignalIcon,
  SunIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import SettingsModal from "./Settings";

export default function ControlBar({
  recording,
  toggleRecording,
}: {
  recording: boolean;
  toggleRecording: () => void;
}) {
  return (
    <div className="rounded-lg flex gap-2 flex-col bg-white">
      {recording ? (
        <PauseIcon className="h-10 w-10" onClick={() => toggleRecording()} />
      ) : (
        <PlayIcon className="h-10 w-10" onClick={() => toggleRecording()} />
      )}
      <SettingsModal />
    </div>
  );
}
