import { getBoxes, signin, signout } from './api/openSenseMapClient'
import { useAuthStore } from './store/useAuthStore'

const useOpenSenseMapAuth = () => {
  const setBoxes = useAuthStore(state => state.setBoxes)

  const login = async (username: string, password: string) => {
    await signin(username, password)
    await refreshBoxes()
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
