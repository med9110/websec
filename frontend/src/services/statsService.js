import api from './api'

export const statsService = {
  getDashboard: async () => {
    const response = await api.get('/stats/dashboard')
    return response.data
  },

  getTrends: async () => {
    const [registrations, events] = await Promise.all([
      api.get('/stats/registrations/trend'),
      api.get('/stats/events/trend')
    ])
    return {
      success: true,
      data: {
        registrations: registrations.data.data,
        events: events.data.data
      }
    }
  },

  getEventsByCategory: async () => {
    const response = await api.get('/stats/events/category')
    return response.data
  },

  getEventsByStatus: async () => {
    const response = await api.get('/stats/events/status')
    return response.data
  },

  getRegistrationsTrend: async () => {
    const response = await api.get('/stats/registrations/trend')
    return response.data
  },

  getEventsTrend: async () => {
    const response = await api.get('/stats/events/trend')
    return response.data
  },

  getTopEvents: async (limit = 5) => {
    const response = await api.get('/stats/events/top', { params: { limit } })
    return response.data
  },

  getUpcomingEvents: async (limit = 5) => {
    const response = await api.get('/stats/events/upcoming', { params: { limit } })
    return response.data
  },

  getAdminStats: async () => {
    const response = await api.get('/stats/admin')
    return response.data
  }
}

export default statsService
