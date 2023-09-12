"use client";
import MapComponent from "@/components/Map/Map";
import { PauseIcon, PlayIcon } from "@heroicons/react/24/outline";
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

export default function Home() {
  const [recording, setRecording] = useState(false);

  const toggleRecording = () => {
    setRecording(!recording);
  };

  return (
    <div className="h-full w-full">
      <MapComponent />
      <div className="flex flex-col items-center">
        <div className="absolute left-5 top-20 bg-slate-100 rounded-lg">
          <div className="flex flex-col ">
            <span>31°C</span>
            <span>55%</span>
            <span>1/2/3/4 µg/m³</span>
            <span>240/234/129 m²/s</span>
            <span>22km/h</span>
            <span>55cm</span>
          </div>
        </div>
        <div className="absolute top-20 right-5 rounded-lg">
          <div
            className={cx(
              "rounded-full w-6 h-6",
              recording ? "bg-green-500" : "bg-red-500",
            )}
          ></div>
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
