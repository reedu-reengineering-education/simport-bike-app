import { Drawer } from 'vaul'
import { AlertOctagon, AlertTriangle, Check, UserCog2 } from 'lucide-react'
import { Button } from '../ui/button'
import ConnectionSelection from '@/components/Wizard/ConnectionSelection'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import OpenSenseMapLogin from '@/components/Wizard/OpenSenseMapLogin'
import SelectDevice from '@/components/Wizard/SelectDevice'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

export default function WizardDrawer() {
  const [open, setOpen] = useState(false)
  const { selectedBox } = useAuthStore()

  // fix for disappearing map
  useEffect(() => {
    if (open) {
      document.body.style.height = '100%'
    }
  }, [open])

  return (
    <Drawer.Root open={open} onClose={() => setOpen(false)}>
      <Drawer.Trigger onClick={() => setOpen(true)}>
        <div className="relative">
          <UserCog2 className="w-6" />
          {!selectedBox && (
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
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex max-h-[75%] flex-col rounded-t-lg bg-zinc-100 pb-safe ">
          <div className="flex-1 overflow-auto rounded-t-[10px] bg-white p-4">
            <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-zinc-300" />
            <div className="mx-auto max-w-md">
              <Swiper
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
                  <OpenSenseMapLogin />
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
          <DrawerWizardFooter />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

function DrawerWizardFooter() {
  return (
    <div className="mt-auto border-t border-zinc-200 bg-zinc-100 p-4">
      <div className="mx-auto flex max-w-md justify-end gap-6">
        <a
          className="gap-0.25 flex items-center text-xs text-zinc-600"
          href="https://opensensemap.org"
          target="_blank"
        >
          openSenseMap
          <svg
            fill="none"
            height="16"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="16"
            aria-hidden="true"
            className="ml-1 h-3 w-3"
          >
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
            <path d="M15 3h6v6"></path>
            <path d="M10 14L21 3"></path>
          </svg>
        </a>
        <a
          className="gap-0.25 flex items-center text-xs text-zinc-600"
          href="https://reedu.de"
          target="_blank"
        >
          re:edu
          <svg
            fill="none"
            height="16"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="16"
            aria-hidden="true"
            className="ml-1 h-3 w-3"
          >
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
            <path d="M15 3h6v6"></path>
            <path d="M10 14L21 3"></path>
          </svg>
        </a>
      </div>
    </div>
  )
}
