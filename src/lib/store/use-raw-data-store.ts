import { create } from 'zustand'

type Characteristic = string

export interface RawBLESensorData<T> {
  measurement: T
  timestamp: Date
}

interface RawBLEDataStore<T> {
  rawBleSensorData: Record<Characteristic, RawBLESensorData<T>[]>
  addRawBLESensorData: (
    _characteristic: Characteristic,
    _measurements: RawBLESensorData<T>,
  ) => void
  reset: () => void
}

export const useRawBLEDataStore = create<RawBLEDataStore<number[]>>(set => ({
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
