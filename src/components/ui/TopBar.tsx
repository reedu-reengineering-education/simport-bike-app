'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Browser } from '@capacitor/browser'
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
    <div className="sticky top-0 z-10 flex w-full items-center justify-between px-4 pb-3 pt-4 shadow landscape:px-safe-or-4">
      <div className="flex items-center gap-2">
        {!isHome && (
          <Link href="/">
            <ArrowLeftIcon className="h-7 w-7" />
          </Link>
        )}
        <h1 className="text-xl">{titles[pathname]}</h1>
      </div>
      <div className="flex gap-6">
        <WizardDrawer />
        <SettingsDrawer />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Bars3Icon className="h-7 w-7" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-4 p-2 mr-safe-or-2">
            <Link href="/tracks">
              <DropdownMenuItem>
                <WaypointsIcon className="mr-2 h-7 w-7" /> Tracks
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              onClick={async () =>
                await Browser.open({
                  url: 'https://sensebox.de/sensebox-bike-privacy-policy/',
                  presentationStyle: 'popover',
                })
              }
            >
              <LockClosedIcon className="mr-2 h-7 w-7" /> Privacy Policy
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BeakerIcon className="mr-2 h-7 w-7" /> Über diese App
            </DropdownMenuItem>
            <DropdownMenuItem>
              <InfoIcon className="mr-2 h-7 w-7" /> Hilfe
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export { TopBar }
