'use client'

import { getUser } from '@/lib/api/openSenseMapClient'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { App } from '@capacitor/app'
import { useEffect } from 'react'

export default function AuthChecker() {
  const { setIsLoggedIn } = useAuthStore()

  useEffect(() => {
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

    return () => {
      App.removeAllListeners()
    }
  }, [setIsLoggedIn])

  return null
}
