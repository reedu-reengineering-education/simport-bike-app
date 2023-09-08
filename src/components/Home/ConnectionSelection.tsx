"use client";
import { Button } from "../ui/button";
import Logo from "../../../public/bike.png";
import Image from "next/image";
import { useState } from "react";

import { BleClient } from "@capacitor-community/bluetooth-le";
import { cn } from "@/lib/utils";

const HEART_RATE_SERVICE = "CF06A218-F68E-E0BE-AD04-8EBC1EB0BC84";
const HEART_RATE_MEASUREMENT_CHARACTERISTIC =
  "2CDF2174-35BE-FDC4-4CA2-6FD173F8B3A8";

export default function ConnectionSelection() {
  const [connected, setConnected] = useState(false);
  const [values, setValues] = useState<number[]>([]);

  async function connect() {
    try {
      await BleClient.initialize();

      const device = await BleClient.requestDevice({
        namePrefix: "senseBox",
      });

      console.log("found device", device);

      // connect to device, the onDisconnect callback is optional
      await BleClient.connect(device.deviceId, (deviceId) =>
        console.log(deviceId + " got disconnected")
      );
      console.log("connected to device", device);
      setConnected(true);

      await BleClient.startNotifications(
        device.deviceId,
        HEART_RATE_SERVICE,
        HEART_RATE_MEASUREMENT_CHARACTERISTIC,
        (value) => {
          setValues((old) => [...old, value.getFloat32(0, true)]);
          console.log("current value", value.getFloat32(0, true));
        }
      );

      // disconnect after 10 sec
      setTimeout(async () => {
        await BleClient.stopNotifications(
          device.deviceId,
          HEART_RATE_SERVICE,
          HEART_RATE_MEASUREMENT_CHARACTERISTIC
        );
        await BleClient.disconnect(device.deviceId);
        console.log("disconnected from device", device);
        setConnected(false);
      }, 10000);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex w-full flex-col h-full">
      <div className="flex h-full flex-col justify-center gap-10">
        <div className="flex flex-col items-center text-center gap-5">
          <Image
            alt="bike"
            src={Logo}
            width={100}
            height={100}
            className={cn(connected ? "animate-spin" : "")}
          />
          {!connected && (
            <div>
              Nicht mit senseBox verbunden. Ürprüfen Sie, ob das Gerät
              eingeschaltet ist und verbinden Sie das Gerät über Bluetooth
            </div>
          )}
          {connected && (
            <div>
              {values.map((value) => (
                <div>{value}</div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          {!connected && (
            <Button variant="default" onClick={connect}>
              Verbinden
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
