import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '../contexts/AuthContext'
import { registerSchema } from '../utils/validation'
import { Calendar, Mail, Lock, Eye, EyeOff, User } from 'lucide-react'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const Register = () => {
  const { register: registerUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    await registerUser(data)
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
          <h2 className="text-3xl font-bold text-gray-900">Inscription</h2>
          <p className="mt-2 text-gray-600">
            Créez votre compte EventHub gratuitement
          </p>
        </div>

        {/* Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Nom et Prénom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Prénom</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    {...register('firstName')}
                    className={`input pl-10 ${errors.firstName ? 'input-error' : ''}`}
                    placeholder="Jean"
                  />
                </div>
                {errors.firstName && (
                  <p className="error-message">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="label">Nom</label>
                <input
                  type="text"
                  {...register('lastName')}
                  className={`input ${errors.lastName ? 'input-error' : ''}`}
                  placeholder="Dupont"
                />
                {errors.lastName && (
                  <p className="error-message">{errors.lastName.message}</p>
                )}
              </div>
            </div>

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
              <p className="text-xs text-gray-500 mt-1">
                Minimum 8 caractères avec majuscule, minuscule et chiffre
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="label">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className={`input pl-10 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword.message}</p>
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
                'Créer mon compte'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
