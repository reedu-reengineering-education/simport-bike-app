import axios from 'axios'
import { BoxResponse, useAuthStore } from '../store/useAuthStore'

const axiosApiInstance = axios.create({
  baseURL: 'https://api.opensensemap.org',
})
const axiosApiInstanceWithoutInterceptor = axios.create({
  baseURL: 'https://api.opensensemap.org',
})

// Request interceptor for API calls
axiosApiInstance.interceptors.request.use(
  async config => {
    const token = useAuthStore.getState().token
    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  error => {
    Promise.reject(error)
  },
)

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use(
  response => {
    return response
  },
  async function (error) {
    const originalRequest = error.config
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true
      const access_token = await refreshAccessToken()
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token
      return axiosApiInstance(originalRequest)
    }
    return Promise.reject(error)
  },
)

const refreshAccessToken = async () => {
  const refreshToken = useAuthStore.getState().refreshToken
  const response = await axiosApiInstance.post('/users/refresh-auth', {
    token: refreshToken,
  })
  if (response.status === 200) {
    const { token } = response.data
    useAuthStore.getState().setToken(token)
    return token
  }
}

export async function signin(username: string, password: string) {
  try {
    // dont use the axiosApiInstance here, because we dont want to send the token
    const response = await axiosApiInstanceWithoutInterceptor.post(
      '/users/sign-in',
      {
        email: username,
        password: password,
      },
    )
    if (response.status === 200) {
      const { token, refreshToken } = response.data
      useAuthStore.getState().setToken(token)
      useAuthStore.getState().setRefreshToken(refreshToken)
      useAuthStore.getState().setEmail(username)
      useAuthStore.getState().setPassword(password)
      useAuthStore.getState().setIsLoggedIn(true)
      return response.data
    } else {
      throw new Error(response.data.message)
    }
  } catch (error) {
    throw error
  }
}

export async function getBoxes() {
  const response = await axiosApiInstance.get('/users/me/boxes')
  if (response.status === 200) {
    const { data } = response.data
    return data as BoxResponse
  } else {
    throw new Error(response.data.message)
  }
}

export async function getUser() {
  const response = await axiosApiInstance.get('/users/me')
  if (response.status === 200) {
    const { data } = response.data
    return data
  } else {
    throw new Error(response.data.message)
  }
}

export async function signout() {
  const response = await axiosApiInstance.post('/users/sign-out')
  if (response.status === 200) {
    useAuthStore.getState().setToken('')
    useAuthStore.getState().setRefreshToken('')
    useAuthStore.getState().setEmail('')
    useAuthStore.getState().setPassword('')
    useAuthStore.getState().setIsLoggedIn(false)
    return true
  } else {
    throw new Error(response.data.message)
  }
}
