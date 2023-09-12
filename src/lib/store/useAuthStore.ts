import { create } from 'zustand'

interface AuthStoreInterface {
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
  token: string
  setToken: (token: string) => void
  refreshToken: string
  setRefreshToken: (refreshToken: string) => void
  isLoggedIn: boolean
  setIsLoggedIn: (isLoggedIn: boolean) => void
  boxes: string[]
  setBoxes: (data: string[]) => void
  selectedBox: string
  setSelectedBox: (boxId: string) => void
}

export const useAuthStore = create<AuthStoreInterface>(set => ({
  email: '',
  setEmail: email => set({ email }),
  password: '',
  setPassword: password => set({ password }),
  token: '',
  setToken: token => set({ token }),
  refreshToken: '',
  setRefreshToken: refreshToken => set({ refreshToken }),
  isLoggedIn: false,
  setIsLoggedIn: isLoggedIn => set({ isLoggedIn }),
  boxes: [],
  setBoxes: boxes => set({ boxes }),
  selectedBox: '',
  setSelectedBox: selectedBox => set({ selectedBox }),
}))
