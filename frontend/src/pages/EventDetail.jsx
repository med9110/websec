import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import eventService from '../services/eventService'
import { 
  formatDateTime, 
  formatPrice, 
  categoryLabels, 
  statusLabels,
  statusColors,
  categoryColors,
  getFileUrl 
} from '../utils/helpers'
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  Euro,
  User,
  Edit,
  Trash2,
  ArrowLeft,
  Share2,
  CheckCircle,
  XCircle
} from 'lucide-react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import ErrorMessage from '../components/UI/ErrorMessage'
import Badge from '../components/UI/Badge'

const EventDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const isOrganizer = user && event && (user.id === event.organizer?._id || user.role === 'admin')
  const isRegistered = event?.isRegistered
  const canRegister = isAuthenticated && !isOrganizer && !isRegistered && !event?.isFull && event?.status === 'published'
  const canUnregister = isAuthenticated && isRegistered

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await eventService.getById(id)
      setEvent(response.data)
    } catch (err) {
      console.error('Erreur chargement événement:', err)
      setError('Impossible de charger l\'événement')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } })
      return
    }

    try {
      setActionLoading(true)
      await eventService.register(id)
      toast.success('Inscription réussie !')
      fetchEvent()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUnregister = async () => {
    try {
      setActionLoading(true)
      await eventService.unregister(id)
      toast.success('Désinscription réussie')
      fetchEvent()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la désinscription')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      return
    }

    try {
      setActionLoading(true)
      await eventService.delete(id)
      toast.success('Événement supprimé')
      navigate('/my-events')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression')
    } finally {
      setActionLoading(false)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Lien copié dans le presse-papier !')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorMessage 
          title="Événement non trouvé"
          message={error}
          onRetry={fetchEvent}
        />
      </div>
    )
  }

  if (!event) return null

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Image de couverture */}
      <div className="relative h-64 md:h-96 bg-gray-200">
        {event.coverImage ? (
          <img
            src={getFileUrl(event.coverImage._id || event.coverImage)}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
            <Calendar className="h-24 w-24 text-primary-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-700 hover:bg-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Retour</span>
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* En-tête */}
            <div className="card p-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant={categoryColors[event.category]}>
                  {categoryLabels[event.category]}
                </Badge>
                <Badge variant={statusColors[event.status]}>
                  {statusLabels[event.status]}
                </Badge>
                {event.isFull && (
                  <Badge variant="danger">Complet</Badge>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>

              {/* Organisateur */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Organisé par</p>
                  <p className="font-medium text-gray-900">
                    {event.organizer?.firstName} {event.organizer?.lastName}
                  </p>
                </div>
              </div>

              {/* Actions organisateur */}
              {isOrganizer && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                  <Link
                    to={`/events/${id}/edit`}
                    className="btn-outline flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Modifier</span>
                  </Link>
                  <button
                    onClick={handleDelete}
                    disabled={actionLoading}
                    className="btn-danger flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Supprimer</span>
                  </button>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                À propos de cet événement
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Lieu */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Lieu
              </h2>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-gray-900">{event.location?.address}</p>
                  <p className="text-gray-600">
                    {event.location?.postalCode} {event.location?.city}, {event.location?.country}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Card d'inscription */}
            <div className="card p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-gray-900">
                  {formatPrice(event.price)}
                </p>
                <p className="text-sm text-gray-500">par personne</p>
              </div>

              {/* Infos */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Date et heure</p>
                    <p className="text-sm">{formatDateTime(event.startDate)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Places</p>
                    <p className="text-sm">
                      {event.availableSpots} / {event.capacity} disponibles
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Lieu</p>
                    <p className="text-sm">{event.location?.city}</p>
                  </div>
                </div>
              </div>

              {/* Bouton d'action */}
              {isRegistered ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 p-3 bg-green-50 rounded-lg text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Vous êtes inscrit</span>
                  </div>
                  <button
                    onClick={handleUnregister}
                    disabled={actionLoading}
                    className="btn-outline w-full text-red-600 border-red-300 hover:bg-red-50"
                  >
                    {actionLoading ? 'Chargement...' : 'Se désinscrire'}
                  </button>
                </div>
              ) : canRegister ? (
                <button
                  onClick={handleRegister}
                  disabled={actionLoading}
                  className="btn-primary w-full py-3"
                >
                  {actionLoading ? 'Chargement...' : 'S\'inscrire'}
                </button>
              ) : event.isFull ? (
                <div className="flex items-center justify-center space-x-2 p-3 bg-red-50 rounded-lg text-red-700">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">Événement complet</span>
                </div>
              ) : !isAuthenticated ? (
                <Link
                  to="/login"
                  state={{ from: { pathname: `/events/${id}` } }}
                  className="btn-primary w-full py-3 text-center block"
                >
                  Se connecter pour s'inscrire
                </Link>
              ) : isOrganizer ? (
                <p className="text-center text-sm text-gray-500">
                  Vous êtes l'organisateur de cet événement
                </p>
              ) : null}

              {/* Partager */}
              <button
                onClick={handleShare}
                className="btn-outline w-full mt-3 flex items-center justify-center space-x-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Partager</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetail
