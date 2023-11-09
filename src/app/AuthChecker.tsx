'use client'

import { getUser } from '@/lib/api/openSenseMapClient'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { App } from '@capacitor/app'
import { useEffect } from 'react'
import debounce from 'lodash.debounce'

export default function AuthChecker() {
  const { setIsLoggedIn } = useAuthStore()

  const debouncedAuthCheck = debounce(async () => {
    try {
      const userData = await getUser()
      if (userData) setIsLoggedIn(true)
      else setIsLoggedIn(false)
    } catch (e) {
      setIsLoggedIn(false)
    }
  }, 200)

  useEffect(() => {
    App.addListener('appStateChange', async ({ isActive }) => {
      if (isActive) {
        // if we can get user data, we are logged in
        await debouncedAuthCheck()
      }
    })

    return () => {
      App.removeAllListeners()
    }
  }, [])

  return null
}
