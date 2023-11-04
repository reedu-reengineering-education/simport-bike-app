import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { capPreferencesStorage } from './capPreferencesZustandStorage'

export interface BoxResponse {
  boxes?: BoxEntity[] | null
  boxes_count: number
  sharedBoxes?: null[] | null
}
export interface BoxEntity {
  createdAt: string
  exposure: string
  model: string
  grouptag?: (string | null)[] | null
  name: string
  updatedAt: string
  lastMeasurementAt?: string | null
  _id: string
  description?: string | null
  sensors: Sensor[]
  access_token: string
}

export interface Sensor {
  icon: string
  title: string
  unit: string
  sensorType: string
  _id: string
  lastMeasurement: any
}

interface AuthStoreInterface {
  email: string
  setEmail: (email: string) => void
  token: string
  setToken: (token: string) => void
  refreshToken: string
  setRefreshToken: (refreshToken: string) => void
  isLoggedIn: boolean
  setIsLoggedIn: (isLoggedIn: boolean) => void
  boxes: BoxResponse
  setBoxes: (data: BoxResponse) => void
  selectedBox: BoxEntity | undefined
  setSelectedBox: (box: BoxEntity | undefined) => void
}

export const useAuthStore = create<AuthStoreInterface>()(
  persist(
    set => ({
      email: '',
      setEmail: email => set({ email }),
      token: '',
      setToken: token => set({ token }),
      refreshToken: '',
      setRefreshToken: refreshToken => set({ refreshToken }),
      isLoggedIn: false,
      setIsLoggedIn: isLoggedIn => {
        set({ isLoggedIn })
        if (!isLoggedIn) {
          set({
            email: '',
            token: '',
            refreshToken: '',
            boxes: { boxes_count: 0 },
            selectedBox: undefined,
          })
        }
      },
      boxes: { boxes_count: 0 },
      setBoxes: boxes => set({ boxes }),
      selectedBox: undefined,
      setSelectedBox: selectedBox => set({ selectedBox }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => capPreferencesStorage),
    },
  ),
)
