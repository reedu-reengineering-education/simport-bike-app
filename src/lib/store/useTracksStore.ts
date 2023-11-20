import { create } from 'zustand'
import { senseBoxDataRecord } from './useSenseBoxValuesStore'
import { createJSONStorage, persist } from 'zustand/middleware'
import { capPreferencesStorage } from './capPreferencesZustandStorage'

export type Track = {
  id: string
  start: string
  end: string
  measurements: senseBoxDataRecord[]
}

interface TracksStore {
  tracks: Track[]
  addTrack: (_track: Track) => void
  removeTrack: (_track: Track) => void
}

export const useTracksStore = create<TracksStore>()(
  persist(
    set => ({
      tracks: [],
      addTrack: track => set(state => ({ tracks: [...state.tracks, track] })),
      removeTrack: track =>
        set(state => ({ tracks: state.tracks.filter(t => t.id !== track.id) })),
    }),
    {
      name: 'tracks-storage',
      storage: createJSONStorage(() => capPreferencesStorage),
    },
  ),
)
