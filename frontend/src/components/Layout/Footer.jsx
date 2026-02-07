import { Link } from 'react-router-dom'
import { Calendar, Github, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold text-white">EventHub</span>
            </div>
            <p className="text-sm text-gray-400 mb-4 max-w-md">
              EventHub est votre plateforme de gestion d'événements. Créez, organisez et participez 
              à des événements uniques en toute simplicité.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-sm hover:text-white transition-colors">
                  Événements
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm hover:text-white transition-colors">
                  Tableau de bord
                </Link>
              </li>
            </ul>
          </div>

          {/* Compte */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Compte
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="text-sm hover:text-white transition-colors">
                  Connexion
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm hover:text-white transition-colors">
                  Inscription
                </Link>
              </li>
              <li>
                <Link to="/my-events" className="text-sm hover:text-white transition-colors">
                  Mes événements
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} EventHub. Tous droits réservés. 
            Projet Full Stack - INE 3 WebSec
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
