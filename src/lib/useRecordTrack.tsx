import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/components/ui/use-toast'
import { useRouter } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { disconnectFromDevice, unsubscribeFromAvailableSensors } from './ble'
import { useTrack } from './db/hooks/useTrack'
import { useTracks } from './db/hooks/useTracks'
import senseBoxBikeDataSource from './db/sources/senseBoxBikeDataSource'
import { exportData } from './exporter/live/opensensemap-live-exporter'
import { useAuthStore } from './store/useAuthStore'
import { useSenseBoxValuesStore } from './store/useSenseBoxValuesStore'
import { useSettingsStore } from './store/useSettingsStore'
import { useTrackRecordStore } from './store/useTrackRecordStore'
import { useUploadStore } from './store/useUploadStore'
import useSenseBox from './useSenseBox'

const useRecordTrack = () => {
  const [isLoading, _setIsLoading] = useState(false)
  const selectedBox = useAuthStore(state => state.selectedBox)
  const values = useSenseBoxValuesStore(state => state.values)
  const valuesRef = useRef<typeof values>()
  valuesRef.current = values

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>()
  const lastUpload = useUploadStore(state => state.lastUpload)
  const setRecording = useUploadStore(state => state.setRecording)
  const lastUploadRef = useRef<typeof lastUpload>()
  lastUploadRef.current = lastUpload

  const interval_in_s = useSettingsStore(state => state.uploadInterval)
  const interval = interval_in_s * 1000

  const uploadStart = useSenseBoxValuesStore(state => state.uploadStart)
  const setUploadStart = useSenseBoxValuesStore(state => state.setUploadStart)
  const uploadStartRef = useRef<typeof uploadStart>()
  uploadStartRef.current = uploadStart

  const currentTrackId = useTrackRecordStore(state => state.currentTrackId)
  const lcurrentTrackIdRef = useRef<typeof currentTrackId>()
  lcurrentTrackIdRef.current = currentTrackId
  const setCurrentTrackId = useTrackRecordStore(
    state => state.setCurrentTrackId,
  )

  const { createTrack } = useTracks()
  const { endTrack } = useTrack()

  const { isConnected } = useSenseBox()

  const router = useRouter()

  const { t } = useTranslation('translation')

  useEffect(() => {
    // when the connection is lost, stop uploading
    if (!isConnected && intervalId) {
      stop()
    }
  }, [isConnected])

  async function start() {
    await senseBoxBikeDataSource.dataSource.query(`DELETE FROM upload;`)

    setUploadStart(new Date())

    const intervalId = setInterval(() => {
      uploadToOpenSenseMap()
    }, interval)
    setIntervalId(intervalId)

    setRecording(true)
    const trackId = await createTrack()
    setCurrentTrackId(trackId)
  }

  async function stop() {
    clearInterval(intervalId)
    setIntervalId(undefined)
    setUploadStart(undefined)
    uploadToOpenSenseMap() // upload last data

    setRecording(false)
    if (!currentTrackId) {
      return
    }
    endTrack(currentTrackId)
    await senseBoxBikeDataSource.dataSource.query(`DELETE FROM upload;`)
    await disconnectFromDevice()
    toast({
      description: t('notifications.track-saved.description'),
      title: t('notifications.track-saved.title'),
      action: (
        <ToastAction
          altText={t('notifications.track-saved.action')}
          onClick={() => {
            router.navigate({
              to: `/tracks/${currentTrackId}`,
            })
          }}
        >
          {t('notifications.track-saved.action')}
        </ToastAction>
      ),
    })
    setCurrentTrackId(undefined)
    unsubscribeFromAvailableSensors()
  }

  async function uploadToOpenSenseMap() {
    console.log('uploadToOpenSenseMap')
    console.log('selectedBox', selectedBox)
    console.log('currentTrackId', lcurrentTrackIdRef.current)

    if (!selectedBox || !lcurrentTrackIdRef.current) {
      return
      // throw new Error('No box selected.')
    }
    exportData(lcurrentTrackIdRef.current)
    // const uploader = OpenSenseMapLiveExporter.getInstance(currentTrackId)
    // await uploader.export()

    // if (!valuesRef.current) {
    //   throw new Error('No values.')
    // }

    // const data = valuesRef.current
    //   .filter(
    //     record => !isInExclusionZone(point([record.gps_lng!, record.gps_lat!])),
    //   )
    //   .flatMap(record => match(selectedBox, record))
    //   .map(record => ({
    //     ...record,
    //     value: record.value.toFixed(2),
    //   }))
    //   .slice(-2500) // max data to upload

    // let filteredData = data

    // if (lastUploadRef.current && uploadStartRef.current) {
    //   filteredData = data.filter(
    //     record =>
    //       new Date(record.createdAt).getTime() >
    //         uploadStartRef.current!.getTime() &&
    //       new Date(record.createdAt).getTime() >
    //         lastUploadRef.current!.getTime(),
    //   )
    // }

    // if (filteredData.length === 0) {
    //   console.log('No new data to upload.')
    //   return
    // }

    // try {
    //   setIsLoading(true)
    //   await uploadData(selectedBox, filteredData)
    //   const maxTimestamp = new Date(
    //     Math.max(...data.map(record => new Date(record.createdAt).getTime())),
    //   )
    //   setLastUpload(maxTimestamp)
    // } catch (error) {
    //   console.error(error)
    // } finally {
    //   setIsLoading(false)
    // }
  }

  return { isRecording: intervalId !== undefined, isLoading, start, stop }
}

export default useRecordTrack
