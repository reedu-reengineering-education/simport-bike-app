import { create } from 'zustand'

interface UIStoreInterface {
  showWizardDrawer: boolean
  setShowWizardDrawer: (_showWizardDrawer: boolean) => void
}

export const useUIStore = create<UIStoreInterface>()(set => ({
  showWizardDrawer: false,
  setShowWizardDrawer: showWizardDrawer => set({ showWizardDrawer }),
}))
