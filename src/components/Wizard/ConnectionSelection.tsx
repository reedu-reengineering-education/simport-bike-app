'use client'

import { Button } from '../ui/button'
import Logo from '../../../public/bike.png'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, CircleIcon } from 'lucide-react'
import useSenseBox from '@/lib/useSenseBox'
import { cn } from '@/lib/utils'
import PreviewModal from '../Device/PreviewModal'
import WizardSlide from './WizardSlide'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { useSwiper } from 'swiper/react'

export default function ConnectionSelection({
  onClose,
}: {
  onClose: () => void
}) {
  const selectedBox = useAuthStore(state => state.selectedBox)

  const swiper = useSwiper()

  return (
    <WizardSlide className="flex h-full w-full flex-col justify-between gap-8">
      <Button
        variant={'secondary'}
        className="w-fit"
        onClick={() => swiper.slidePrev()}
      >
        <ArrowLeft className="mr-2 w-5" /> Bearbeiten
      </Button>

      <p className="font-medium">Verknüpfte Box</p>
      <div className="flex items-center gap-2">
        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
        {selectedBox?.name}
      </div>

      <Button
        onClick={() => {
          onClose()
        }}
      >
        OK
      </Button>
    </WizardSlide>
  )
}
