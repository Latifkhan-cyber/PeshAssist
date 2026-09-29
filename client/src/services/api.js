import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach user ID header if available in localStorage
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('peshass_user')
  if (user) {
    try {
      const parsed = JSON.parse(user)
      config.headers['x-user-id'] = parsed.id || 'default_user'
    } catch (e) {
      // ignore
    }
  }
  return config
})

// API Service functions
export const chatService = {
  sendMessage: (message, history = []) => api.post('/chat', { message, history }),
  getSuggestions: () => api.get('/chat/suggestions'),
}

export const placesService = {
  getAll: (params) => api.get('/places', { params }),
  getById: (id) => api.get(`/places/${id}`),
  getCategories: () => api.get('/categories'),
  getAreas: () => api.get('/areas'),
}

export const reviewsService = {
  getByPlace: (placeId) => api.get(`/reviews/${placeId}`),
  submit: (data) => api.post('/reviews', data),
}

export const favoritesService = {
  getAll: () => api.get('/favorites'),
  toggle: (placeId) => api.post(`/favorites/${placeId}`),
}

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getPlaces: () => api.get('/admin/places'),
  addPlace: (data) => api.post('/admin/places', data),
  updatePlace: (id, data) => api.put(`/admin/places/${id}`, data),
  deletePlace: (id) => api.delete(`/admin/places/${id}`),
}
