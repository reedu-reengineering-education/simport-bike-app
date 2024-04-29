import { create } from 'zustand'

type Characteristic = string

export interface RawBLESensorData {
  measurement: number[]
  timestamp: Date
}

interface RawBLEDataStore {
  rawBleSensorData: Record<Characteristic, RawBLESensorData[]>
  addRawBLESensorData: (
    _characteristic: Characteristic,
    _measurements: RawBLESensorData,
  ) => void
  reset: () => void
}

export const useRawBLEDataStore = create<RawBLEDataStore>(set => ({
  rawBleSensorData: {},
  addRawBLESensorData: (characteristic, measurement) => {
    set(state => ({
      rawBleSensorData: {
        ...state.rawBleSensorData,
        [characteristic]: [
          ...(state.rawBleSensorData[characteristic] || []),
          measurement,
        ],
      },
    }))
  },
  reset: () => set({ rawBleSensorData: {} }),
}))
