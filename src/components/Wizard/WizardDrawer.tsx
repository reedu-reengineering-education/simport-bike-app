import ConnectionSelection from '@/components/Wizard/ConnectionSelection'
import SelectDevice from '@/components/Wizard/SelectDevice'
import { signout } from '@/lib/api/openSenseMapClient'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useUIStore } from '@/lib/store/useUIStore'
import { AlertOctagon, Check, ExternalLinkIcon, UserCog2 } from 'lucide-react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer'
import { toast } from '../ui/use-toast'
import LoginOrRegister from './LoginOrRegister'

export default function WizardDrawer() {
  const open = useUIStore(state => state.showWizardDrawer)
  const setOpen = useUIStore(state => state.setShowWizardDrawer)

  const selectedBox = useAuthStore(state => state.selectedBox)
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)

  return (
    <Drawer
      shouldScaleBackground
      open={open}
      onOpenChange={setOpen}
      onClose={() => setOpen(false)}
    >
      <DrawerTrigger>
        <div className="relative">
          <UserCog2 className="w-6" />
          {(!isLoggedIn || !selectedBox) && (
            <div className="absolute -right-1 -top-1 rounded-full bg-amber-400 p-0.5">
              <AlertOctagon className="h-2 w-2 text-background" />
            </div>
          )}
          {selectedBox && (
            <div className="absolute -right-1 -top-1 rounded-full bg-green-500 p-0.5">
              <Check className="h-2 w-2 text-background" />
            </div>
          )}
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md p-4">
          <Swiper
            initialSlide={isLoggedIn ? (selectedBox ? 2 : 1) : 0}
            spaceBetween={48}
            modules={[Navigation]}
            slidesPerView={1}
            threshold={20}
            allowTouchMove={false}
          >
            <SwiperSlide>
              <LoginOrRegister />
            </SwiperSlide>
            <SwiperSlide>
              <SelectDevice />
            </SwiperSlide>
            <SwiperSlide>
              <ConnectionSelection onClose={() => setOpen(false)} />
            </SwiperSlide>
          </Swiper>
        </div>
        <DrawerWizardFooter setOpen={setOpen} />
      </DrawerContent>
    </Drawer>
  )
}

function DrawerWizardFooter({
  setOpen,
}: {
  setOpen: (_open: boolean) => void
}) {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  return (
    <div className="mt-auto border-t bg-muted p-4 pb-safe-or-4">
      <div className="mx-auto flex max-w-md justify-end gap-6">
        <a
          className="gap-0.25 flex items-center text-xs text-muted-foreground"
          href="https://opensensemap.org"
          target="_blank"
        >
          openSenseMap
          <ExternalLinkIcon className="ml-1 h-3 w-3" />
        </a>
        <a
          className="gap-0.25 flex items-center text-xs text-muted-foreground"
          href="https://reedu.de"
          target="_blank"
        >
          re:edu
          <ExternalLinkIcon className="ml-1 h-3 w-3" />
        </a>
        {isLoggedIn && (
          <p
            className="cursor-pointer text-xs text-muted-foreground"
            onClick={async () => {
              try {
                await signout()
                setOpen(false)
              } catch (e) {
                toast({
                  variant: 'destructive',
                  title: 'Logout fehlgeschlagen',
                })
              }
            }}
          >
            Logout
          </p>
        )}
      </div>
    </div>
  )
}
