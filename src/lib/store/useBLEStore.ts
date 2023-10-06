import { BleDevice } from '@capacitor-community/bluetooth-le'
import { create } from 'zustand'

interface BLEStoreInterface {
  device: BleDevice | undefined
  setDevice: (device: BleDevice | undefined) => void
  connected: boolean
  setConnected: (connected: boolean) => void
}

export const useBLEStore = create<BLEStoreInterface>(set => ({
  device: undefined,
  setDevice: device => set({ device }),
  connected: false,
  setConnected: connected => set({ connected }),
}))
