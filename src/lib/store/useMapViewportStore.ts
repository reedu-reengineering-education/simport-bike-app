import { ViewState } from 'react-map-gl/dist/esm/types'
import { create } from 'zustand'

interface MapViewportStoreInterface {
  viewport: ViewState | undefined
  setViewport: (_viewport: ViewState) => void
}

export const useMapViewportState = create<MapViewportStoreInterface>(set => ({
  viewport: {
    latitude: 50,
    longitude: 10,
    zoom: 3,
    pitch: 50,
    bearing: 0,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
  setViewport: viewport => set({ viewport }),
}))
