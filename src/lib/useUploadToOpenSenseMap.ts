import { use, useState } from 'react'
import { useAuthStore } from './store/useAuthStore'

interface UploadToOpenSenseMapProps {
  sensorid: string
  value: number
  createdAt: string
}

const useUploadToOpenSenseMap = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const boxId = useAuthStore(state => state.selectedBox)

  const uploadToOpenSenseMap = async (data: UploadToOpenSenseMapProps) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `https://api.opensensemap.org/boxes/${boxId}/sensors/${data.sensorid}/data`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            value: data.value, // Deine Messwertdaten hier
            createdAt: data.createdAt,
          }),
        },
      )

      if (!response.ok) {
        throw new Error('Fehler beim Hochladen der Daten')
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, success, error, uploadToOpenSenseMap }
}

export default useUploadToOpenSenseMap
