import { create } from 'zustand'

interface TrackRecordStore {
  currentTrackId?: string
  setCurrentTrackId: (id: string | undefined) => void
}

export const useTrackRecordStore = create<TrackRecordStore>(set => ({
  currentTrackId: undefined,
  setCurrentTrackId: id => set({ currentTrackId: id }),
}))
