"use client";
import { Button } from "../ui/button";
import Logo from "../../../public/bike.png";
import Image from "next/image";
import { useState } from "react";

export default function ConnectionSelection() {
  const [showLoading, setShowLoading] = useState(false);

  return (
    <div className="flex w-full flex-col h-full">
      <div className="flex h-full flex-col justify-center gap-10 ">
        <div className="flex flex-col items-center text-center gap-5">
          <Image alt="bike" src={Logo} width={100} height={100} />
          <div>
            Nicht mit senseBox verbunden. Ürprüfen Sie, ob das Gerät
            eingeschaltet ist und verbinden Sie das Gerät über Bluetooth
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Button
            className="w-1/2 h-1/2 border-2 bg-green-500 rounded-xl"
          >
            Verbinden
          </Button>
          <Button className="w-1/2 h-1/2 border-2 bg-green-500 rounded-xl">
            Zu einem anderen Gerät wechseln
          </Button>
        </div>
      </div>
    </div>
  );
}
