import { getUser } from '@/lib/api/openSenseMapClient'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { App } from '@capacitor/app'
import debounce from 'lodash.debounce'
import { useEffect } from 'react'

export default function AuthChecker() {
  const setIsLoggedIn = useAuthStore(state => state.setIsLoggedIn)

  const debouncedAuthCheck = debounce(async () => {
    try {
      const userData = await getUser()
      if (userData) setIsLoggedIn(true)
      else setIsLoggedIn(false)
    } catch (_e) {
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
