import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach token from localStorage to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally — clear token and redirect
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

// ─── AUTH ──────────────────────────────────────────────────
export const authAPI = {
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
}

// ─── USER ──────────────────────────────────────────────────
export const userAPI = {
  profile: () => api.get('/user/profile'),
  saveKeys: (keys: Record<string, string>) => api.post('/user/keys', keys),
}

// ─── BOTS ──────────────────────────────────────────────────
export const botsAPI = {
  list: ()                  => api.get('/bots'),
  create: (data: object)    => api.post('/bots', data),
  update: (id: string, data: object) => api.put(`/bots/${id}`, data),
  updateStatus: (id: string, status: string) => api.patch(`/bots/${id}/status`, { status }),
  delete: (id: string)      => api.delete(`/bots/${id}`),
}

// ─── LOGS ──────────────────────────────────────────────────
export const logsAPI = {
  list: (params?: { botId?: string; page?: number; limit?: number }) =>
    api.get('/logs', { params }),
  delete: (id: string) => api.delete(`/logs/${id}`),
}

// ─── AUTOPOST ──────────────────────────────────────────────
export const autopostAPI = {
  run: (botId: string) => api.post('/autopost', { botId }),
}
