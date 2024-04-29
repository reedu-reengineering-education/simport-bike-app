import { useRawBLEDataStore } from './store/use-raw-data-store'

export default function useRawSensorValues(characteristic: string) {
  const values = useRawBLEDataStore(state => state.rawBleSensorData)

  const value = values[characteristic]?.at(-1)

  const historyValues = values[characteristic]

  return { value, historyValues }
}
