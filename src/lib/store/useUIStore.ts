import { create } from 'zustand'

interface UIStoreInterface {
  showWizardDrawer: boolean
  setShowWizardDrawer: (_showWizardDrawer: boolean) => void
  reducedMotion: boolean
  setReducedMotion: (_reducedMotion: boolean) => void
}

export const useUIStore = create<UIStoreInterface>()(set => ({
  showWizardDrawer: false,
  setShowWizardDrawer: showWizardDrawer => set({ showWizardDrawer }),
  reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  setReducedMotion: reducedMotion => set({ reducedMotion }),
}))
