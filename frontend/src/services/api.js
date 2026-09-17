import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('peopleos_access')
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  return config
})

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config
    const refreshToken = localStorage.getItem('peopleos_refresh')
    if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh/`, { refresh: refreshToken })
        localStorage.setItem('peopleos_access', data.access)
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        return api(originalRequest)
      } catch {
        localStorage.removeItem('peopleos_access')
        localStorage.removeItem('peopleos_refresh')
      }
    }
    return Promise.reject(error)
  },
)

export default api
