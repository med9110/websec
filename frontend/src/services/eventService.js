import api from './api'

export const eventService = {
  getAll: async (params = {}) => {
    const response = await api.get('/events', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/events/${id}`)
    return response.data
  },

  create: async (eventData) => {
    const response = await api.post('/events', eventData)
    return response.data
  },

  update: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/events/${id}`)
    return response.data
  },

  register: async (id) => {
    const response = await api.post(`/events/${id}/register`)
    return response.data
  },

  unregister: async (id) => {
    const response = await api.delete(`/events/${id}/register`)
    return response.data
  },

  getRegistrations: async (id) => {
    const response = await api.get(`/events/${id}/registrations`)
    return response.data
  },

  uploadCover: async (id, file) => {
    const formData = new FormData()
    formData.append('cover', file)
    
    const response = await api.post(`/events/${id}/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  getMyEvents: async (params = {}) => {
    const response = await api.get('/users/me/events', { params })
    return response.data
  },

  getMyRegistrations: async (params = {}) => {
    const response = await api.get('/users/me/registrations', { params })
    return response.data
  }
}

export default eventService
