import { useAuthStore } from './store/useAuthStore'
import { getBoxes, signin, signout } from './api/openSenseMapClient'

const useOpenSenseMapAuth = () => {
  const setBoxes = useAuthStore(state => state.setBoxes)

  const login = async (username: string, password: string) => {
    try {
      await signin(username, password)

      const boxesData = await getBoxes()
      if (boxesData) {
        setBoxes(boxesData)
      }
    } catch (error) {
      throw error
    }
  }

  return { login, logout: signout }
}

export default useOpenSenseMapAuth
