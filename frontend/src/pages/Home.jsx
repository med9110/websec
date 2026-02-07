import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Calendar, 
  Users, 
  Shield, 
  Zap, 
  ArrowRight,
  CheckCircle 
} from 'lucide-react'

const Home = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: Calendar,
      title: 'Gestion complète',
      description: 'Créez, modifiez et gérez vos événements en quelques clics'
    },
    {
      icon: Users,
      title: 'Inscriptions simplifiées',
      description: 'Permettez aux participants de s\'inscrire facilement'
    },
    {
      icon: Shield,
      title: 'Sécurisé',
      description: 'Authentification JWT et gestion des rôles'
    },
    {
      icon: Zap,
      title: 'Tableau de bord',
      description: 'Visualisez vos statistiques en temps réel'
    }
  ]

  const benefits = [
    'Création d\'événements illimitée',
    'Gestion des inscriptions',
    'Statistiques détaillées',
    'Upload d\'images',
    'Filtres avancés',
    'Interface responsive'
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Organisez vos événements
              <span className="block text-primary-200">en toute simplicité</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              EventHub est votre plateforme tout-en-un pour créer, gérer et promouvoir 
              vos événements. Conférences, ateliers, concerts... tout est possible !
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/events"
                className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                Découvrir les événements
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="btn bg-primary-500 text-white hover:bg-primary-400 px-8 py-3 text-lg font-semibold border border-primary-400"
                >
                  Créer un compte gratuit
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une plateforme complète pour gérer vos événements de A à Z
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-8 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Prêt à organiser votre prochain événement ?
                </h2>
                <p className="text-primary-100 text-lg mb-6">
                  Rejoignez EventHub et commencez à créer des événements mémorables dès aujourd'hui.
                </p>
                <ul className="space-y-3 mb-8">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-white">
                      <CheckCircle className="h-5 w-5 text-primary-200 mr-3 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={isAuthenticated ? '/events/create' : '/register'}
                  className="inline-flex items-center btn bg-white text-primary-700 hover:bg-gray-100 px-6 py-3 font-semibold"
                >
                  {isAuthenticated ? 'Créer un événement' : 'Commencer gratuitement'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/10 rounded-2xl transform rotate-3" />
                  <div className="relative bg-white rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-20 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg" />
                      <div className="h-4 bg-gray-200 rounded w-5/6" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">100+</div>
              <div className="text-gray-600">Événements créés</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Utilisateurs actifs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">1000+</div>
              <div className="text-gray-600">Inscriptions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">6</div>
              <div className="text-gray-600">Catégories</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
