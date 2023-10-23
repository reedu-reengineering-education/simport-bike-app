import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { capPreferencesStorage } from './capPreferencesZustandStorage'

interface SettingsStoreInterface {
  uploadInterval: number
  setUploadInterval: (uploadInterval: number) => void
  useSenseBoxGPS: boolean
  setUseSenseBoxGPS: (useSenseBoxGPS: boolean) => void
}

export const useSettingsStore = create<SettingsStoreInterface>()(
  persist(
    set => ({
      uploadInterval: 10,
      setUploadInterval: uploadInterval => set({ uploadInterval }),
      useSenseBoxGPS: true,
      setUseSenseBoxGPS: useSenseBoxGPS => set({ useSenseBoxGPS }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => capPreferencesStorage),
    },
  ),
)
