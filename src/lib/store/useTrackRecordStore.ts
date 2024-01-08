import { point } from '@turf/helpers'
import { create } from 'zustand'
import { isInExclusionZone } from '../exclusion-zone'
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
  addMeasurements: measurements => {
    // filter out all records that are outside the exclusion zone
    const filteredMeasurements = measurements.filter(
      record => !isInExclusionZone(point([record.gps_lng!, record.gps_lat!])),
    )
    set(state => ({
      measurements: [...state.measurements, ...filteredMeasurements],
    }))
  },
  reset: () => set({ measurements: [], start: undefined, end: undefined }),
}))
