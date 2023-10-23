'use client'

import { getUser } from '@/lib/api/openSenseMapClient'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { App } from '@capacitor/app'

export default function AuthChecker() {
  const { setIsLoggedIn } = useAuthStore()

  App.addListener('appStateChange', async ({ isActive }) => {
    if (isActive) {
      // if we can get user data, we are logged in
      try {
        const userData = await getUser()
        if (userData) setIsLoggedIn(true)
        else setIsLoggedIn(false)
      } catch (e) {
        setIsLoggedIn(false)
      }
    }
  })

  return null
}
