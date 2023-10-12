import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'
import { useAuthStore } from './store/useAuthStore'

const OPEN_SENSE_MAP_API = 'https://api.opensensemap.org'

interface LoginResponse {
  code: string
  token: string
  data: Object
  refreshToken: string
  message: string
}

const useOpenSenseMapAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { toast } = useToast()

  const setToken = useAuthStore(state => state.setToken)
  const setRefreshToken = useAuthStore(state => state.setRefreshToken)
  const setEmail = useAuthStore(state => state.setEmail)
  const setPassword = useAuthStore(state => state.setPassword)
  const setBoxes = useAuthStore(state => state.setBoxes)

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${OPEN_SENSE_MAP_API}/users/sign-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      })

      if (response.status === 200) {
        // Erfolgreich eingeloggt
        setIsLoggedIn(true)
        const json: any = await response.json()
        setToken(json.token)
        setRefreshToken(json.refreshToken)
        setEmail(username)
        setPassword(password)

        try {
          console.log('boxesRequest', json.token)
          const boxesRequest = await fetch(
            `${OPEN_SENSE_MAP_API}/users/me/boxes`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${json.token}`,
              },
            },
          )
          console.log('boxesRequest', boxesRequest)
          const { data: boxesData } = await boxesRequest.json()
          setBoxes(boxesData)
        } catch (e) {
          console.log('boxesRequest error', e)
        }
        return true
      } else {
        // Einloggen fehlgeschlagen
        setIsLoggedIn(false)
        return false
      }
    } catch (error) {
      // Fehler beim Einloggen
      setIsLoggedIn(false)
      return false
    }
  }

  const logout = () => {
    // Hier kannst du die Logik für das Abmelden implementieren, z.B. das Löschen des Tokens oder Zurücksetzen von Zuständen.
    setIsLoggedIn(false)
  }

  return { isLoggedIn, login, logout }
}

export default useOpenSenseMapAuth
