import { useAuthStore } from "@/lib/store/useAuthStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { Toggle } from "../ui/toggle";
import { Button } from "../ui/button";
import { cx } from "class-variance-authority";
import { useState } from "react";

export default function SelectDevice() {
  const boxes = useAuthStore((state) => state.boxes);

  const [selectedBox, setSelectedBox] = useState("");
  const selectBox = (box) => {
    setSelectedBox(box);
    console.log(box);
    useAuthStore.setState({ selectedBox: box });
  };

  return (
    <div className="flex w-full flex-col h-full items-center justify-center gap-4">
      <div>
        Wähle bitte nun die openSenseMap-Box aus, die du mit dem Gerät verbinden
        möchtest.
      </div>
      <div>
        <ScrollArea className="w-[350px] rounded-md border p-4 h-[200px]">
          {boxes.map((box) => (
            <div
              aria-label="Toggle"
              key={box}
              onClick={(e) => selectBox(box)}
              className={cx(
                "flex justify-center gap-2 items-center w-full h-12 border border-gray-300 rounded-md",
                selectedBox === box ? "bg-green-400" : "",
              )}
            >
              {box}
            </div>
          ))}{" "}
        </ScrollArea>

        <Button className="w-11/12 rounded-md border">Weiter</Button>
      </div>
    </div>
  );
}
