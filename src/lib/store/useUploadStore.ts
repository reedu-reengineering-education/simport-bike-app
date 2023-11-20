import { create } from 'zustand'

interface UploadStoreInterface {
  isRecording: boolean
  setRecording: (_isRecording: boolean) => void
  lastUpload: Date | undefined
  setLastUpload: (_lastUpload: Date) => void
}

export const useUploadStore = create<UploadStoreInterface>()(set => ({
  isRecording: false,
  setRecording: isRecording => set({ isRecording }),
  lastUpload: undefined,
  setLastUpload: lastUpload => set({ lastUpload }),
}))
