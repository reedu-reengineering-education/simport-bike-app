import { useAuthStore } from '@/lib/store/useAuthStore'
import { cn } from '@/lib/utils'
import { cx } from 'class-variance-authority'
import { CheckCircle, Circle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSwiper } from 'swiper/react'
import { Button } from '../ui/button'
import { ScrollArea } from '../ui/scroll-area'
import CreateBikeBoxDialog from './CreateBikeBoxDialog'
import WizardSlide from './WizardSlide'

export default function SelectDevice() {
  const { boxes } = useAuthStore(state => state.boxes)
  const selectedBox = useAuthStore(state => state.selectedBox)
  const setSelectedBox = useAuthStore(state => state.setSelectedBox)
  const swiper = useSwiper()

  const { t } = useTranslation('translation', { keyPrefix: 'opensensemap' })

  return (
    <WizardSlide className="flex h-full w-full flex-col items-center justify-center gap-4">
      <p className="mb-4 font-medium">{t('select-box')}</p>
      <CreateBikeBoxDialog />
      <ScrollArea className="flex max-h-[15rem] w-full flex-col gap-2">
        {boxes &&
          boxes.map((box, i) => (
            <div
              aria-label="Toggle"
              key={box._id}
              onClick={_ => setSelectedBox(box)}
              className={cn(
                'flex h-12 w-full items-center',
                i !== boxes.length - 1 && 'border-b', // exclude last item
              )}
            >
              {selectedBox?._id === box._id && (
                <CheckCircle className={cx('mr-2 h-5 w-5 text-green-500')} />
              )}
              {selectedBox?._id !== box._id && (
                <Circle className={cx('mr-2 h-5 w-5')} />
              )}
              {box.name}
            </div>
          ))}
      </ScrollArea>

      <Button
        disabled={selectedBox === undefined}
        className="w-11/12 rounded-md border"
        onClick={() => swiper.slideNext()}
      >
        {t('next')}
      </Button>
    </WizardSlide>
  )
}
