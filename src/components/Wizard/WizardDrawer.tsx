import { Drawer } from 'vaul'
import { AlertOctagon, Check, ExternalLinkIcon, UserCog2 } from 'lucide-react'
import ConnectionSelection from '@/components/Wizard/ConnectionSelection'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import SelectDevice from '@/components/Wizard/SelectDevice'
import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { signout } from '@/lib/api/openSenseMapClient'
import { toast } from '../ui/use-toast'
import { useUIStore } from '@/lib/store/useUIStore'
import LoginOrRegister from './LoginOrRegister'

export default function WizardDrawer({
  trigger,
}: {
  trigger?: React.ReactNode
}) {
  const { showWizardDrawer: open, setShowWizardDrawer: setOpen } = useUIStore()

  const { selectedBox, isLoggedIn } = useAuthStore()

  // fix for disappearing map
  useEffect(() => {
    if (open) {
      document.body.style.height = '100%'
    }
  }, [open])

  return (
    <Drawer.Root
      open={open}
      onClose={() => setOpen(false)}
      shouldScaleBackground
    >
      <Drawer.Trigger
        onClick={() => setOpen(true)}
        className="w-full focus:outline-none"
        asChild
      >
        {trigger ? (
          trigger
        ) : (
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
        )}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-20 bg-black/60" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-30 mt-24 flex max-h-[85%] flex-col rounded-t-lg border-t bg-background focus:outline-none">
          <div className="flex-1 overflow-auto rounded-t-[10px] p-4">
            <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            <div className="mx-auto max-w-md">
              <Swiper
                initialSlide={isLoggedIn ? (selectedBox ? 2 : 1) : 0}
                spaceBetween={48}
                modules={[Navigation]}
                slidesPerView={1}
                threshold={20}
                allowTouchMove={false}
              >
                {/* <SwiperSlide>
                  <Welcome />
                </SwiperSlide> */}
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
          </div>
          <DrawerWizardFooter setOpen={setOpen} />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

function DrawerWizardFooter({ setOpen }: { setOpen: (open: boolean) => void }) {
  const { isLoggedIn } = useAuthStore()
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
