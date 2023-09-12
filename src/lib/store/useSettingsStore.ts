import { create } from 'zustand'

interface SettingsStoreInterface {
  uploadInterval: number
  setUploadInterval: (uploadInterval: number) => void
  useDeviceGPS: boolean
  setUseDeviceGPS: (useDeviceGPS: boolean) => void
}

export const useSettingsStore = create<SettingsStoreInterface>(set => ({
  uploadInterval: 10,
  setUploadInterval: uploadInterval => set({ uploadInterval }),
  useDeviceGPS: false,
  setUseDeviceGPS: useDeviceGPS => set({ useDeviceGPS }),
}))
