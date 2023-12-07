import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { capPreferencesStorage } from './capPreferencesZustandStorage'

interface PermissionsStoreInterface {
  geolocationPermissionGranted: boolean
  setGeolocationPermissionGranted: (_granted: boolean) => void
  showGeolocationPermissionsDrawer: boolean
  setShowGeolocationPermissionsDrawer: (_show: boolean) => void
}

export const usePermissionsStore = create<PermissionsStoreInterface>()(
  persist(
    set => ({
      geolocationPermissionGranted: false,
      setGeolocationPermissionGranted: granted => {
        if (granted) {
          set({
            geolocationPermissionGranted: granted,
            showGeolocationPermissionsDrawer: false,
          })
        } else {
          set({ geolocationPermissionGranted: granted })
        }
      },

      showGeolocationPermissionsDrawer: false,
      setShowGeolocationPermissionsDrawer: show =>
        set({ showGeolocationPermissionsDrawer: show }),
    }),
    {
      name: 'permissions-storage',
      storage: createJSONStorage(() => capPreferencesStorage),
    },
  ),
)
