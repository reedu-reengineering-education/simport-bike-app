import { create } from 'zustand'
import { senseBoxDataRecord } from './useSenseBoxValuesStore'

interface TrackRecordStore {
  start: Date | undefined
  setStart: (_start: Date) => void
  end: Date | undefined
  setEnd: (_end: Date) => void
  measurements: senseBoxDataRecord[]
  addMeasurements: (_measurements: senseBoxDataRecord[]) => void
  reset: () => void
}

export const useTrackRecordStore = create<TrackRecordStore>(set => ({
  start: undefined,
  setStart: start => set({ start }),
  end: undefined,
  setEnd: end => set({ end }),
  measurements: [],
  addMeasurements: measurements =>
    set(state => ({ measurements: [...state.measurements, ...measurements] })),
  reset: () => set({ measurements: [], start: undefined, end: undefined }),
}))
