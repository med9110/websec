import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../UI/LoadingSpinner'

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
