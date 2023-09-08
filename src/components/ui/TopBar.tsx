import {
  Bars3Icon,
  BeakerIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { InfoIcon } from "lucide-react";

const TopBar = () => {
  return (
    <div className="flex justify-evenly sticky top-0 w-full py-2 border-b border-slate-300">
      <h1 className="basis-6/7 font-bold text-xl"> senseBox X SIMPORT </h1>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Bars3Icon className="absolute top-2 right-2 w-6 h-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <LockClosedIcon className="w-6 h-6" /> Privacy Policy
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BeakerIcon className="w-6 h-6" /> Über diese App
          </DropdownMenuItem>
          <DropdownMenuItem>
            <InfoIcon className="w-6 h-6" /> Hilfe
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { TopBar };
