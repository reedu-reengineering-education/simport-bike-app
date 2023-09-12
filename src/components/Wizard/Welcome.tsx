import { useSwiper } from "swiper/react";
import { Button } from "../ui/button";
import Logo from "../../../public/senseboxbike.png";
import Image from "next/image";

export default function Welcome() {
  const swiper = useSwiper();

  return (
    <div className="flex justify-center content-center flex-col gap-4 h-full">
      <div className="flex flex-col items-center gap-2">
        <Image src={Logo} alt="senseBox:bike" width={100} height={100} />
        Willkommen beim senseBox Wizard In den nächsten Schritten werden Sie
        durch die Einrichtung Ihrer senseBox geführt. Dazu brauchen sie einen
        Account auf der <a href="https://opensensemap.org">openSenseMap</a>{" "}
        sowie eine senseBox:bike mit einem Bluetooth-Modul.
      </div>
      <Button onClick={() => swiper.slideNext()}>Weiter</Button>
    </div>
  );
}
