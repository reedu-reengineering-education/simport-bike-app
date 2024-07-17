import { useAuthStore } from '@/lib/store/useAuthStore'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSwiper } from 'swiper/react'
import { Button } from '../ui/button'
import WizardSlide from './WizardSlide'

export default function ConnectionSelection({
  onClose,
}: {
  onClose: () => void
}) {
  const selectedBox = useAuthStore(state => state.selectedBox)

  const swiper = useSwiper()

  const { t } = useTranslation('translation', { keyPrefix: 'opensensemap' })

  return (
    <WizardSlide className="flex h-full w-full flex-col justify-between gap-8">
      <Button
        variant={'secondary'}
        className="w-fit"
        onClick={() => swiper.slidePrev()}
      >
        <ArrowLeft className="mr-2 w-5" /> {t('edit')}
      </Button>

      <p className="font-medium">{t('linked-sensebox')}</p>
      <div className="flex items-center gap-2">
        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
        {selectedBox?.name}
      </div>

      <Button
        onClick={() => {
          onClose()
        }}
      >
        {t('okay')}
      </Button>
    </WizardSlide>
  )
}
