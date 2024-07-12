import { CapacitorHttp } from '@capacitor/core'
import axios from 'axios'
import { BoxEntity, BoxResponse, useAuthStore } from '../store/useAuthStore'
import {
  senseBoxBikeModel,
  senseBoxBikeModelFactory,
} from './opensensemap-bike-model-factory'

const OSEM_BASE_URL = 'https://api.opensensemap.org'

const axiosApiInstance = axios.create({
  baseURL: OSEM_BASE_URL,
})
const axiosApiInstanceWithoutInterceptor = axios.create({
  baseURL: OSEM_BASE_URL,
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
    if (error?.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true
      const accessToken = await refreshAccessToken()
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      return axiosApiInstance(originalRequest)
    }
    return Promise.reject(error)
  },
)

const refreshAccessToken = async () => {
  const refreshToken = useAuthStore.getState().refreshToken
  const response = await axiosApiInstanceWithoutInterceptor.post(
    '/users/refresh-auth',
    {
      token: refreshToken,
    },
  )
  if (response.status === 200) {
    const { token, refreshToken } = response.data
    useAuthStore.getState().setToken(token)
    useAuthStore.getState().setRefreshToken(refreshToken)
    return token
  } else {
    throw new Error(response.data.message)
  }
}

export async function signin(username: string, password: string) {
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
    useAuthStore.getState().setIsLoggedIn(true)
    return response.data
  } else {
    throw new Error(response.data.message)
  }
}

export async function register(name: string, email: string, password: string) {
  // dont use the axiosApiInstance here, because we dont want to send the token
  const response = await axiosApiInstanceWithoutInterceptor.post(
    '/users/register',
    {
      name: name,
      email: email,
      password: password,
    },
  )
  if (response.status === 201) {
    const { token, refreshToken } = response.data
    useAuthStore.getState().setToken(token)
    useAuthStore.getState().setRefreshToken(refreshToken)
    useAuthStore.getState().setEmail(email)
    useAuthStore.getState().setIsLoggedIn(true)
    return response.data
  } else {
    throw new Error(response.data.message)
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
    useAuthStore.getState().setIsLoggedIn(false)
    useAuthStore.getState().setSelectedBox(undefined)
    return true
  } else {
    throw new Error(response.data.message)
  }
}

export type UploadData = {
  sensor: string
  value: number | string
  createdAt: string
  location: {
    lng: number
    lat: number
  }
}[]

export async function uploadData(box: BoxEntity, data: UploadData) {
  const response = await CapacitorHttp.post({
    url: `${OSEM_BASE_URL}/boxes/${box._id}/data`,
    headers: {
      Authorization: box.access_token,
      'Content-Type': 'application/json',
    },
    data,
  })
  if (response.status === 201) {
    return true
  } else {
    throw new Error(response.data.message)
  }
}

export async function uploadDataCSV(box: BoxEntity, data: string) {
  const response = await CapacitorHttp.post({
    url: `${OSEM_BASE_URL}/boxes/${box._id}/data`,
    headers: {
      Authorization: box.access_token,
      'Content-Type': 'text/csv',
    },
    data,
  })
  if (response.status === 201) {
    return true
  } else {
    throw new Error(response.data.message)
  }
}

export async function createSenseBoxBike(
  name: string,
  latitude: number,
  longitude: number,
  model: senseBoxBikeModel = 'default',
) {
  const boxData = senseBoxBikeModelFactory(
    name,
    longitude,
    latitude,
    undefined,
    model,
  )
  const response = await axiosApiInstance.post('/boxes', boxData)
  if (response.status === 201) {
    const { data } = response.data
    return data as BoxEntity
  } else {
    throw new Error(response.data.message)
  }
}
