'use client'

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
import { InfoIcon, UserCog2 } from 'lucide-react'
import WizardDrawer from '../Wizard/WizardDrawer'
import SettingsDrawer from '../Device/SettingsDrawer'

const TopBar = () => {
  return (
    <div className="sticky top-0 flex w-full items-center justify-between border-b border-slate-300 px-4 py-2">
      <h1 className="text-xl font-semibold">senseBox:bike</h1>
      <div className="flex gap-4">
        <WizardDrawer />
        <SettingsDrawer />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Bars3Icon className="h-6 w-6" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-2 mt-4">
            <DropdownMenuItem>
              <LockClosedIcon className="mr-2 h-6 w-6" /> Privacy Policy
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BeakerIcon className="mr-2 h-6 w-6" /> Über diese App
            </DropdownMenuItem>
            <DropdownMenuItem>
              <InfoIcon className="mr-2 h-6 w-6" /> Hilfe
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export { TopBar }
