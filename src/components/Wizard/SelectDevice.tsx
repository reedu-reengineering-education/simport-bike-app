import { useAuthStore } from '@/lib/store/useAuthStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { ScrollArea } from '../ui/scroll-area'
import { Toggle } from '../ui/toggle'
import { Button } from '../ui/button'
import { cx } from 'class-variance-authority'
import { useState } from 'react'
import { useSwiper } from 'swiper/react'

export default function SelectDevice() {
  const boxes = useAuthStore(state => state.boxes)

  const swiper = useSwiper();
  const [selectedBox, setSelectedBox] = useState("");
  const selectBox = (box: string) => {
    setSelectedBox(box);
    useAuthStore.setState({ selectedBox: box });
  };


  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div>
        Wähle bitte nun die openSenseMap-Box aus, die du mit dem Gerät verbinden
        möchtest.
      </div>
      <div>
        <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
          {boxes.map(box => (
            <div
              aria-label="Toggle"
              key={box}
              onClick={e => selectBox(box)}
              className={cx(
                'flex h-12 w-full items-center justify-center gap-2 rounded-md border border-gray-300',
                selectedBox === box ? 'bg-green-400' : '',
              )}
            >
              {box}
            </div>
          ))}{' '}
        </ScrollArea>

        <Button
          disabled={selectedBox === ''}
          className="w-11/12 rounded-md border"
          onClick={() => swiper.slideNext()}
        >
          Weiter
        </Button>
      </div>
    </div>
  )
}
