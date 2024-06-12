import { ViewState } from 'react-map-gl/dist/esm/types'
import { create } from 'zustand'

interface MapViewportStoreInterface {
  viewport: ViewState | undefined
  setViewport: (_viewport: ViewState) => void
}

export const useMapViewportState = create<MapViewportStoreInterface>(set => ({
  viewport: {
    latitude: 45.1657,
    longitude: 10.4515,
    zoom: 3,
    bearing: 0,
    pitch: 25,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  },
  setViewport: viewport => set({ viewport }),
}))
