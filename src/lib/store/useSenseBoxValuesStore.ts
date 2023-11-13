import { create } from 'zustand'

export type senseBoxDataRecord = {
  timestamp: Date
  temperature?: number
  humidity?: number
  pm1?: number
  pm2_5?: number
  pm4?: number
  pm10?: number
  acceleration_x?: number
  acceleration_y?: number
  acceleration_z?: number
  gps_lat?: number
  gps_lng?: number
  gps_spd?: number
  distance_l?: number
}

interface senseBoxValuesStore {
  values: senseBoxDataRecord[]
  setValues: (values: senseBoxDataRecord[]) => void
  addValues: (values: senseBoxDataRecord[]) => void
  uploadStart: Date | undefined
  setUploadStart: (uploadStart: Date | undefined) => void
}

export const useSenseBoxValuesStore = create<senseBoxValuesStore>(set => ({
  values: [],
  setValues: values => set({ values }),
  addValues: values =>
    set(state => ({
      values: [...state.values, ...values],
    })),
  uploadStart: undefined,
  setUploadStart: uploadStart => set({ uploadStart }),
}))
