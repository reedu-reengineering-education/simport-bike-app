import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { capPreferencesStorage } from './capPreferencesZustandStorage'

interface SettingsStoreInterface {
  useSIMPORTToolkit: boolean
  setUseSIMPORTToolkit: (_useSIMPORTToolkit: boolean) => void
  uploadInterval: number
  setUploadInterval: (_uploadInterval: number) => void
  useSenseBoxGPS: boolean
  setUseSenseBoxGPS: (_useSenseBoxGPS: boolean) => void
  reducedMotion: boolean
  setReducedMotion: (_reducedMotion: boolean) => void
}

export const useSettingsStore = create<SettingsStoreInterface>()(
  persist(
    set => ({
      useSIMPORTToolkit: false,
      setUseSIMPORTToolkit: useSIMPORTToolkit => set({ useSIMPORTToolkit }),
      uploadInterval: 10,
      setUploadInterval: uploadInterval => set({ uploadInterval }),
      useSenseBoxGPS: true,
      setUseSenseBoxGPS: useSenseBoxGPS => set({ useSenseBoxGPS }),
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)')
        .matches,
      setReducedMotion: reducedMotion => set({ reducedMotion }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => capPreferencesStorage),
    },
  ),
)
