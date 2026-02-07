import api from './api'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const fileService = {
  getMyFiles: async () => {
    const response = await api.get('/files')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/files/${id}`)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/files/${id}`)
    return response.data
  },

  getPreviewUrl: (id) => {
    return `${API_URL}/files/${id}/preview`
  },

  getDownloadUrl: (id) => {
    return `${API_URL}/files/${id}/download`
  },

  uploadAvatar: async (file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await api.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}

export default fileService
