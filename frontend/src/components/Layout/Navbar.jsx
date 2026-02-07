import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Menu, 
  X, 
  Calendar, 
  User, 
  LogOut, 
  LayoutDashboard,
  PlusCircle,
  Ticket,
  ChevronDown
} from 'lucide-react'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const navLinks = [
    { to: '/events', label: 'Événements', icon: Calendar },
  ]

  const authLinks = [
    { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { to: '/events/create', label: 'Créer un événement', icon: PlusCircle },
    { to: '/my-events', label: 'Mes événements', icon: Calendar },
    { to: '/my-registrations', label: 'Mes inscriptions', icon: Ticket },
  ]

  const handleLogout = () => {
    setIsUserMenuOpen(false)
    logout()
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">EventHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </NavLink>
            ))}

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                  <span>{user?.firstName}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                        {user?.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      </span>
                    </div>

                    {authLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <link.icon className="h-4 w-4" />
                        <span>{link.label}</span>
                      </Link>
                    ))}

                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </NavLink>
            ))}

            {isAuthenticated ? (
              <>
                <div className="border-t border-gray-200 my-2 pt-2">
                  {authLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                          isActive
                            ? 'bg-primary-50 text-primary-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`
                      }
                    >
                      <link.icon className="h-4 w-4" />
                      <span>{link.label}</span>
                    </NavLink>
                  ))}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <div className="border-t border-gray-200 my-2 pt-2 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white text-center"
                >
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
