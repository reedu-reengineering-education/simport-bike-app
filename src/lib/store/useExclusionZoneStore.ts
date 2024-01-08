import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { capPreferencesStorage } from './capPreferencesZustandStorage'

interface ExclusionZoneStore {
  zones: GeoJSON.FeatureCollection<GeoJSON.Polygon>
  overwriteZones: (_zones: GeoJSON.FeatureCollection<GeoJSON.Polygon>) => void
}

export const useExclusionZoneStore = create<ExclusionZoneStore>()(
  persist(
    set => ({
      zones: {
        type: 'FeatureCollection',
        features: [],
      },
      overwriteZones: zones => set({ zones }),
    }),
    {
      name: 'exclusion-zone-storage',
      storage: createJSONStorage(() => capPreferencesStorage),
    },
  ),
)
