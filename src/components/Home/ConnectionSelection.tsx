"use client";

import { Button } from "../ui/button";
import Logo from "../../../public/bike.png";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import useSenseBox from "@/lib/useSenseBox";
import { cn } from "@/lib/utils";
import PreviewModal from "../Device/PreviewModal";

export default function ConnectionSelection() {
  const { isConnected, connect, values, disconnect, resetValues } =
    useSenseBox();

  return (
    <div className="flex w-full flex-col h-full">
      <div className="flex h-full flex-col justify-center gap-10">
        <div className="flex flex-col items-center text-center gap-5">
          <div>
            Super! Der Login hat funktioniert und deine Box ist ausgewählt !
            Jetzt müssen wir nur noch die Box mit dem Gerät verbinden.
          </div>
          <Image
            alt="bike"
            src={Logo}
            width={100}
            height={100}
            className={cn(isConnected ? "animate-spin" : "")}
          />
          {!isConnected && (
            <div>
              Nicht mit senseBox verbunden. Überprüfen Sie, ob das Gerät
              eingeschaltet ist und verbinden Sie das Gerät über Bluetooth
            </div>
          )}
          {isConnected && (
            <div>
              Erfolgreich mit senseBox verbunden! Letzte Messung um{" "}
              {values
                .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
                .at(-1)
                ?.timestamp.toLocaleTimeString() || "-"}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          {!isConnected && (
            <Button variant="default" onClick={connect}>
              Verbinden
            </Button>
          )}
          {isConnected && (
            <Button variant="default" onClick={disconnect}>
              Verbindung trennen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
