import { StateStorage } from 'zustand/middleware'
import { Preferences } from '@capacitor/preferences'

/**
 * @description a custom storage engine for zustand. uses the capacitor preferences plugin. only suitable for small amounts of data
 * @see https://capacitorjs.com/docs/apis/preferences
 */
export const capPreferencesStorage: StateStorage = {
  getItem: async (key: string): Promise<string | null> => {
    return (await Preferences.get({ key })).value || null
  },
  setItem: async (key: string, value: string): Promise<void> => {
    await Preferences.set({ key, value })
  },
  removeItem: async (key: string): Promise<void> => {
    await Preferences.remove({ key })
  },
}
