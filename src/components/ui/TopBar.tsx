import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUIStore } from '@/lib/store/useUIStore'
import { Browser } from '@capacitor/browser'
import {
  Bars3Icon,
  BeakerIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline'
import { Link } from '@tanstack/react-router'
import {
  InfoIcon,
  MoonIcon,
  SunIcon,
  UserCog,
  WaypointsIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import SettingsDrawer from '../Device/SettingsDrawer'
import { Button } from './button'

const TopBar = () => {
  // const pathname = usePathname()
  const { setShowWizardDrawer } = useUIStore()

  const { theme, setTheme } = useTheme()

  return (
    <div className="pointer-events-auto sticky top-0 z-10 flex w-full items-center justify-between px-4 pt-2 landscape:px-safe-or-4">
      <div className="flex items-center gap-2"></div>
      <div className="flex flex-col-reverse gap-4">
        <SettingsDrawer />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'secondary'} size={'icon'}>
              <Bars3Icon className="h-7" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mt-2 p-2 mr-safe-or-2">
            <Link to="/tracks">
              <DropdownMenuItem>
                <WaypointsIcon className="mr-2 h-7 w-7" /> Tracks
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={() => setShowWizardDrawer(true)}>
              <UserCog className="mr-2 h-7 w-7" /> openSenseMap
            </DropdownMenuItem>
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
            {theme === 'light' ? (
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <MoonIcon className="mr-2 h-7 w-7" /> Dunkles Design
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <SunIcon className="mr-2 h-7 w-7" /> Helles Design
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export { TopBar }
