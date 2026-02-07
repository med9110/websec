import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken')
      
      if (token) {
        try {
          const response = await api.get('/auth/me')
          setUser(response.data.data)
        } catch (error) {
          console.error('Erreur chargement utilisateur:', error)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      }
      
      setLoading(false)
    }

    loadUser()
  }, [])

  const register = useCallback(async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      const { user, accessToken, refreshToken } = response.data.data
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      setUser(user)
      
      toast.success('Inscription réussie ! Bienvenue sur EventHub')
      navigate('/')
      
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de l\'inscription'
      toast.error(message)
      return { success: false, error: error.response?.data }
    }
  }, [navigate])

  const login = useCallback(async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials)
      const { user, accessToken, refreshToken } = response.data.data
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      setUser(user)
      
      toast.success(`Bienvenue, ${user.firstName} !`)
      navigate('/')
      
      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || 'Identifiants incorrects'
      toast.error(message)
      return { success: false, error: error.response?.data }
    }
  }, [navigate])

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Erreur déconnexion:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      toast.success('Déconnexion réussie')
      navigate('/login')
    }
  }, [navigate])

  const refreshToken = useCallback(async () => {
    const token = localStorage.getItem('refreshToken')
    
    if (!token) {
      throw new Error('Pas de refresh token')
    }

    try {
      const response = await api.post('/auth/refresh', { refreshToken: token })
      const { accessToken, refreshToken: newRefreshToken } = response.data.data
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)
      
      return accessToken
    } catch (error) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      throw error
    }
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    register,
    login,
    logout,
    refreshToken,
    setUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
