"use client";

import { Button } from "../ui/button";
import Logo from "../../../public/bike.png";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ConnectionSelection() {
  return (
    <div className="flex h-full flex-col justify-center gap-10">
      <div className="flex flex-col items-center text-center gap-5">
        <Image alt="bike" src={Logo} width={100} height={100} />
        <div>
          Nicht mit senseBox verbunden. Ürprüfen Sie, ob das Gerät eingeschaltet
          ist und verbinden Sie das Gerät über Bluetooth
        </div>
      </div>
      <Link href="/device" className="mx-auto">
        <Button>
          Bluetooth Device <ArrowRight className="inline-block w-4 h-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}
