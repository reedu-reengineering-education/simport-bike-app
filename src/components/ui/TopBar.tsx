'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Bars3Icon,
  BeakerIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'
import { ArrowLeftIcon, InfoIcon, WaypointsIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SettingsDrawer from '../Device/SettingsDrawer'
import WizardDrawer from '../Wizard/WizardDrawer'

const titles: Record<string, string> = {
  '/': 'senseBox:bike',
  '/tracks': 'Tracks',
}

const TopBar = () => {
  const pathname = usePathname()

  const isHome = pathname === '/'

  return (
    <div className="sticky top-0 flex w-full items-center justify-between border-b border-muted px-4 pb-2 pt-3 landscape:px-safe-or-4">
      <div className="flex items-center gap-2">
        {!isHome && (
          <Link href="/">
            <ArrowLeftIcon className="h-6 w-6" />
          </Link>
        )}
        <h1 className="text-xl">{titles[pathname]}</h1>
      </div>
      <div className="flex gap-4">
        <WizardDrawer />
        <SettingsDrawer />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Bars3Icon className="h-6 w-6" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-4 mr-safe-or-2">
            <Link href="/tracks">
              <DropdownMenuItem>
                <WaypointsIcon className="mr-2 h-6 w-6" /> Tracks
              </DropdownMenuItem>
            </Link>
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
