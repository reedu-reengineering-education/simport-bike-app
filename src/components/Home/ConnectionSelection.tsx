"use client";

import { Button } from "../ui/button";
import Logo from "../../../public/bike.png";
import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import useBLEDevice from "@/lib/useBLE";

const BLE_SOME_SERVICE = "CF06A218-F68E-E0BE-AD04-8EBC1EB0BC84";
const BLE_SOME_CHARACTERISTIC = "2CDF2174-35BE-FDC4-4CA2-6FD173F8B3A8";

export default function ConnectionSelection() {
  const [values, setValues] = useState<number[]>([]);

  const { isConnected, connect, listen, disconnect } = useBLEDevice({
    namePrefix: "senseBox",
  });

  useEffect(() => {
    if (!isConnected) return;

    listen(BLE_SOME_SERVICE, BLE_SOME_CHARACTERISTIC, (data) => {
      setValues((values) => [...values, data.getFloat32(0, true)]);
    });
  }, [isConnected, listen]);

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
              Nicht mit senseBox verbunden. Ürprüfen Sie, ob das Gerät
              eingeschaltet ist und verbinden Sie das Gerät über Bluetooth
            </div>
          )}
          {isConnected && (
            <div>
              {values.map((value) => (
                <div key={value}>{value}</div>
              ))}
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
