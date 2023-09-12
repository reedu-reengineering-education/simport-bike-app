import {
  Bars3Icon,
  BeakerIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { InfoIcon } from 'lucide-react'

const TopBar = () => {
  return (
    <div className="sticky top-0 flex w-full justify-evenly border-b border-slate-300 py-2">
      <h1 className="basis-6/7 text-xl font-bold"> senseBox X SIMPORT </h1>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Bars3Icon className="absolute right-2 top-2 h-6 w-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <LockClosedIcon className="h-6 w-6" /> Privacy Policy
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BeakerIcon className="h-6 w-6" /> Über diese App
          </DropdownMenuItem>
          <DropdownMenuItem>
            <InfoIcon className="h-6 w-6" /> Hilfe
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export { TopBar }
