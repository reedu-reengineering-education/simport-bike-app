import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from './store/useAuthStore'
import { useSenseBoxValuesStore } from './store/useSenseBoxValuesStore'
import match from './senseBoxSensorIdMatcher'
import { uploadData } from './api/openSenseMapClient'
import { useUploadStore } from './store/useUploadStore'
import { useSettingsStore } from './store/useSettingsStore'
import { useTracksStore } from './store/useTracksStore'
import { useTrackRecordStore } from './store/useTrackRecordStore'
import { v4 as uuidv4 } from 'uuid'

const useUploadToOpenSenseMap = () => {
  const [isLoading, setIsLoading] = useState(false)
  const selectedBox = useAuthStore(state => state.selectedBox)
  const values = useSenseBoxValuesStore(state => state.values)
  const valuesRef = useRef<typeof values>()
  valuesRef.current = values

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout>()
  const lastUpload = useUploadStore(state => state.lastUpload)
  const setRecording = useUploadStore(state => state.setRecording)
  const lastUploadRef = useRef<typeof lastUpload>()
  lastUploadRef.current = lastUpload
  const setLastUpload = useUploadStore(state => state.setLastUpload)

  const interval_in_s = useSettingsStore(state => state.uploadInterval)
  const interval = interval_in_s * 1000

  const uploadStart = useSenseBoxValuesStore(state => state.uploadStart)
  const setUploadStart = useSenseBoxValuesStore(state => state.setUploadStart)
  const uploadStartRef = useRef<typeof uploadStart>()
  uploadStartRef.current = uploadStart

  const {
    setStart,
    setEnd,
    measurements,
    start: recordStart,
    end,
    reset,
  } = useTrackRecordStore()
  const addTrack = useTracksStore(state => state.addTrack)

  useEffect(() => {
    if (!intervalId) {
      return
    }

    stop(true)
    start(true)

    return () => {
      console.log('in effect cleanup')
      clearInterval(intervalId)
      setIntervalId(undefined)
    }
  }, [interval])

  useEffect(() => {
    if (end) {
      addTrack({
        id: uuidv4(),
        start: recordStart?.toISOString()!,
        end: end.toISOString()!,
        measurements,
      })
      reset()
    }
  }, [end])

  function start(intervalChange?: boolean) {
    setUploadStart(new Date())
    const intervalId = setInterval(() => {
      uploadToOpenSenseMap()
    }, interval)
    setIntervalId(intervalId)

    if (!intervalChange) {
      setRecording(true)
      setStart(new Date())
    }
  }

  function stop(intervalChange?: boolean) {
    clearInterval(intervalId)
    setIntervalId(undefined)
    setUploadStart(undefined)
    uploadToOpenSenseMap() // upload last data

    if (!intervalChange) {
      setRecording(false)
      setEnd(new Date())
    }
  }

  async function uploadToOpenSenseMap() {
    if (!selectedBox) {
      throw new Error('No box selected.')
    }
    if (!valuesRef.current) {
      throw new Error('No values.')
    }

    const data = valuesRef.current
      .flatMap(record => match(selectedBox, record))
      .map(record => ({
        ...record,
        value: record.value.toFixed(2),
      }))
      .slice(-2500) // max data to upload

    let filteredData = data

    if (lastUploadRef.current && uploadStartRef.current) {
      filteredData = data.filter(
        record =>
          new Date(record.createdAt).getTime() >
            uploadStartRef.current!.getTime() &&
          new Date(record.createdAt).getTime() >
            lastUploadRef.current!.getTime(),
      )
    }

    if (filteredData.length === 0) {
      console.log('No new data to upload.')
      return
    }

    try {
      setIsLoading(true)
      await uploadData(selectedBox, filteredData)
      const maxTimestamp = new Date(
        Math.max(...data.map(record => new Date(record.createdAt).getTime())),
      )
      setLastUpload(maxTimestamp)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { isRecording: intervalId !== undefined, isLoading, start, stop }
}

export default useUploadToOpenSenseMap
