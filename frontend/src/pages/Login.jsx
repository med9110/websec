import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../contexts/AuthContext'
import { loginSchema } from '../utils/validation'
import { Calendar, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const Login = () => {
  const { login } = useAuth()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const from = location.state?.from?.pathname || '/'

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    await login(data)
    setIsLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6">
            <Calendar className="h-10 w-10 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">EventHub</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Connexion</h2>
          <p className="mt-2 text-gray-600">
            Connectez-vous à votre compte EventHub
          </p>
        </div>

        {/* Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  {...register('email')}
                  className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                  placeholder="votre@email.com"
                />
              </div>
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="label">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="error-message">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" className="text-white" />
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-primary-600 font-medium hover:text-primary-700">
                S'inscrire
              </Link>
            </p>
          </div>

          {/* Test accounts */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-500 mb-2">Comptes de test :</p>
            <div className="text-xs text-gray-600 space-y-1">
              <p><span className="font-medium">Admin:</span> admin@eventhub.ma / Admin123!</p>
              <p><span className="font-medium">User:</span> user@eventhub.ma / User123!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
