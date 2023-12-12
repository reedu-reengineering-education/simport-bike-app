import { ViewState } from 'react-map-gl/dist/esm/types'
import { create } from 'zustand'

interface MapViewportStoreInterface {
  viewport: ViewState | undefined
  setViewport: (_viewport: ViewState) => void
}

export const useMapViewportState = create<MapViewportStoreInterface>(set => ({
  viewport: undefined,
  setViewport: viewport => set({ viewport }),
}))
