import { Link } from 'react-router-dom'
import { Home, Search, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Illustration 404 */}
        <div className="mb-8">
          <div className="relative inline-block">
            <span className="text-9xl font-bold text-primary-100">404</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary-600">Oups !</span>
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Page non trouvée
        </h1>
        <p className="text-gray-600 mb-8">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center"
          >
            <Home className="h-5 w-5" />
            <span>Retour à l'accueil</span>
          </Link>
          <Link
            to="/events"
            className="btn-outline flex items-center space-x-2 w-full sm:w-auto justify-center"
          >
            <Search className="h-5 w-5" />
            <span>Voir les événements</span>
          </Link>
        </div>

        {/* Lien retour */}
        <button
          onClick={() => window.history.back()}
          className="mt-8 text-gray-500 hover:text-gray-700 flex items-center justify-center space-x-2 mx-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Revenir en arrière</span>
        </button>
      </div>
    </div>
  )
}

export default NotFound
