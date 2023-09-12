"use client";
import MapComponent from "@/components/Map/Map";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cx } from "class-variance-authority";
import { Settings2Icon, SettingsIcon } from "lucide-react";
import { useState } from "react";
import { DialogTrigger } from "@radix-ui/react-dialog";
import SettingsModal from "@/components/Map/Settings";
import RecordButton from "@/components/Map/RecordButton";
import MeasurementsOverview from "@/components/Map/MeasurementsOverview";

export default function Home() {
  const [recording, setRecording] = useState(false);

  const [data, setData] = useState({
    temperature: 0,
    humidity: 0,
    pm1: 0,
    pm25: 0,
    pm4: 0,
    pm10: 0,
    accelerationX: 0,
    accelerationY: 0,
    accelerationZ: 0,
    speed: 0,
  });
  const toggleRecording = () => {
    setRecording(!recording);
  };

  return (
    <div className="h-full w-full">
      <MapComponent />
      <div className="flex flex-col items-center">
        <div className="absolute left-5 top-20 bg-slate-100 rounded-lg">
          <MeasurementsOverview data={data} />
        </div>
        <div className="absolute top-20 right-5 rounded-lg">
          <RecordButton recording={recording} />
        </div>
        <div className="absolute bottom-20 right-5 rounded-lg flex gap-2 flex-col bg-white">
          {recording ? (
            <PauseIcon
              className="h-10 w-10"
              onClick={() => toggleRecording()}
            />
          ) : (
            <PlayIcon className="h-10 w-10" onClick={() => toggleRecording()} />
          )}
          <SettingsModal />
        </div>
      </div>
    </div>
  );
}
