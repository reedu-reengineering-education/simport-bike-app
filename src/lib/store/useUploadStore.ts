import { create } from 'zustand'

interface UploadStoreInterface {
  lastUpload: Date | undefined
  setLastUpload: (lastUpload: Date) => void
}

export const useUploadStore = create<UploadStoreInterface>()(set => ({
  lastUpload: undefined,
  setLastUpload: lastUpload => set({ lastUpload }),
}))
