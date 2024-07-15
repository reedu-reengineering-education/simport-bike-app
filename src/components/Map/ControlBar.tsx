import { useAuthStore } from '@/lib/store/useAuthStore'
import useBLEDevice from '@/lib/useBLE'
import useRecordTrack from '@/lib/useRecordTrack'
import {
  Bluetooth,
  BluetoothOff,
  Circle,
  Square,
  UploadCloud,
} from 'lucide-react'
import { forwardRef } from 'react'
import { useTranslation } from 'react-i18next'
import ConnectWithCamera from '../Device/ConnectWithCamera'
import SettingsDrawer from '../Device/SettingsDrawer'
import { Button } from '../ui/button'

const ControlBar = forwardRef<HTMLDivElement>((_, ref) => {
  const { connect, isConnected, disconnect } = useBLEDevice({
    namePrefix: 'senseBox',
  })

  const selectedBox = useAuthStore(state => state.selectedBox)

  const { isRecording, start, stop, isLoading } = useRecordTrack()
  // const setShowWizardDrawer = useUIStore(state => state.setShowWizardDrawer)

  const { t } = useTranslation('translation', { keyPrefix: 'controls' })

  return (
    <div
      className="flex w-full justify-between gap-2 p-2 pb-safe-or-4"
      ref={ref}
    >
      <SettingsDrawer />
      {!isConnected ? (
        <div className="mx-auto flex w-full max-w-xl rounded-md bg-secondary">
          <Button size={'sm'} className="w-full" onClick={() => connect()}>
            <Bluetooth className="mr-2 h-4" />
            {t('connect')}
          </Button>
          <ConnectWithCamera />
        </div>
      ) : (
        <Button
          size={'sm'}
          className="mx-auto w-full max-w-xl"
          onClick={() => disconnect()}
        >
          <BluetoothOff className="mr-2 h-4" />
          {t('disconnect')}
        </Button>
      )}
      {isConnected ? (
        !isRecording ? (
          <Button
            size={'sm'}
            className="w-full relative"
            onClick={() => start()}
            variant={'secondary'}
          >
            <Circle className="mr-2 h-5 fill-red-500 text-red-500" />
            {t('start')}
            {selectedBox && (
              <span className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
              </span>
            )}
          </Button>
        ) : (
          <>
            <Button
              size={'sm'}
              className="w-full relative"
              onClick={() => stop()}
              variant={'secondary'}
            >
              {isLoading && (
                <UploadCloud className="mr-2 h-5 animate-pulse opacity-50" />
              )}
              {!isLoading && (
                <Square className="mr-2 h-5 fill-red-500 text-red-500" />
              )}
              {t('stop')}
              {selectedBox && (
                <span className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
                </span>
              )}
            </Button>
          </>
        )
      ) : (
        <></>
      )}
    </div>
  )
})

ControlBar.displayName = 'ControlBar'

export default ControlBar
