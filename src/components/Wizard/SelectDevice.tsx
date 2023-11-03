import { useAuthStore } from '@/lib/store/useAuthStore'
import { ScrollArea } from '../ui/scroll-area'
import { Button } from '../ui/button'
import { cx } from 'class-variance-authority'
import { useSwiper } from 'swiper/react'
import WizardSlide from './WizardSlide'
import { Separator } from '../ui/separator'
import { CheckCircle, Circle } from 'lucide-react'
import CreateBikeBoxDialog from './CreateBikeBoxDialog'

export default function SelectDevice() {
  const { boxes } = useAuthStore(state => state.boxes)
  const selectedBox = useAuthStore(state => state.selectedBox)
  const setSelectedBox = useAuthStore(state => state.setSelectedBox)
  const swiper = useSwiper()

  return (
    <WizardSlide className="flex h-full w-full flex-col items-center justify-center gap-4">
      <p className="mb-4 font-medium">Box auswählen</p>
      <CreateBikeBoxDialog />
      <ScrollArea className="flex h-60 w-full flex-col gap-2">
        {boxes &&
          boxes.map(box => (
            <>
              <div
                aria-label="Toggle"
                key={box._id}
                onClick={e => setSelectedBox(box)}
                className={cx('flex h-12 w-full items-center')}
              >
                {selectedBox?._id === box._id && (
                  <CheckCircle className={cx('mr-2 h-5 w-5 text-green-500')} />
                )}
                {selectedBox?._id !== box._id && (
                  <Circle className={cx('mr-2 h-5 w-5')} />
                )}
                {box.name}
              </div>
              <Separator className="my-2" />
            </>
          ))}
      </ScrollArea>

      <Button
        disabled={selectedBox === undefined}
        className="w-11/12 rounded-md border"
        onClick={() => swiper.slideNext()}
      >
        Weiter
      </Button>
    </WizardSlide>
  )
}
