import { useAuthStore } from './store/useAuthStore'
import { getBoxes, signin, signout } from './api/openSenseMapClient'

const useOpenSenseMapAuth = () => {
  const setBoxes = useAuthStore(state => state.setBoxes)

  const login = async (username: string, password: string) => {
    try {
      await signin(username, password)

      await refreshBoxes()
    } catch (error) {
      throw error
    }
  }

  async function refreshBoxes() {
    const boxesData = await getBoxes()
    if (boxesData) {
      setBoxes(boxesData)
    }
  }

  return { login, logout: signout, refreshBoxes }
}

export default useOpenSenseMapAuth
