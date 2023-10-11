import { create } from 'zustand'

interface SettingsStoreInterface {
  uploadInterval: number
  setUploadInterval: (uploadInterval: number) => void
  useSenseBoxGPS: boolean
  setUseSenseBoxGPS: (useSenseBoxGPS: boolean) => void
}

export const useSettingsStore = create<SettingsStoreInterface>(set => ({
  uploadInterval: 10,
  setUploadInterval: uploadInterval => set({ uploadInterval }),
  useSenseBoxGPS: true,
  setUseSenseBoxGPS: useSenseBoxGPS => set({ useSenseBoxGPS }),
}))
