import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import eventService from '../services/eventService'
import { formatDateTime, categoryLabels, getFileUrl } from '../utils/helpers'
import Pagination from '../components/UI/Pagination'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import EmptyState from '../components/UI/EmptyState'
import ErrorMessage from '../components/UI/ErrorMessage'
import Badge from '../components/UI/Badge'
import { Ticket, Calendar, MapPin, Clock, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const MyRegistrations = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [registrations, setRegistrations] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [unregisteringId, setUnregisteringId] = useState(null)

  const [filters, setFilters] = useState({
    sort: searchParams.get('sort') || '-registeredAt',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 10
  })

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = { ...filters }
      
      const response = await eventService.getMyRegistrations(params)
      setRegistrations(response.data)
      setPagination(response.pagination)
    } catch (err) {
      console.error('Erreur chargement inscriptions:', err)
      setError('Impossible de charger vos inscriptions')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchRegistrations()
  }, [fetchRegistrations])

  const handleUnregister = async (eventId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir vous désinscrire de cet événement ?')) {
      return
    }

    try {
      setUnregisteringId(eventId)
      await eventService.unregister(eventId)
      toast.success('Désinscription réussie')
      fetchRegistrations()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la désinscription')
    } finally {
      setUnregisteringId(null)
    }
  }

  const handlePageChange = (page) => {
    setFilters({ ...filters, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mes inscriptions
          </h1>
          <p className="text-gray-600">
            Retrouvez tous les événements auxquels vous êtes inscrit
          </p>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <ErrorMessage 
            title="Erreur de chargement"
            message={error}
            onRetry={fetchRegistrations}
          />
        ) : registrations.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title="Aucune inscription"
            description="Vous n'êtes inscrit à aucun événement pour le moment. Découvrez les événements disponibles !"
            action={
              <Link to="/events" className="btn-primary">
                Explorer les événements
              </Link>
            }
          />
        ) : (
          <>
            {/* Résultats */}
            <div className="mb-4 text-sm text-gray-600">
              {pagination?.total} inscription{pagination?.total > 1 ? 's' : ''}
            </div>

            {/* Liste des inscriptions */}
            <div className="space-y-4 mb-8">
              {registrations.map((registration) => {
                const event = registration.event
                const isPast = new Date(event.endDate) < new Date()

                return (
                  <div 
                    key={registration._id}
                    className={`card overflow-hidden ${isPast ? 'opacity-75' : ''}`}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Image */}
                      <div className="md:w-48 h-32 md:h-auto flex-shrink-0">
                        {event.coverImage ? (
                          <img
                            src={getFileUrl(event.coverImage._id || event.coverImage)}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                            <Calendar className="h-12 w-12 text-primary-300" />
                          </div>
                        )}
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 p-4">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="primary">
                                {categoryLabels[event.category]}
                              </Badge>
                              {isPast && (
                                <Badge variant="gray">Passé</Badge>
                              )}
                              {registration.status === 'confirmed' && (
                                <Badge variant="success">Confirmé</Badge>
                              )}
                            </div>

                            <Link
                              to={`/events/${event._id}`}
                              className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                            >
                              {event.title}
                            </Link>

                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>{formatDateTime(event.startDate)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span>{event.location?.city}</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            <Link
                              to={`/events/${event._id}`}
                              className="btn-outline text-sm text-center"
                            >
                              Voir les détails
                            </Link>
                            {!isPast && (
                              <button
                                onClick={() => handleUnregister(event._id)}
                                disabled={unregisteringId === event._id}
                                className="btn text-sm bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center space-x-1"
                              >
                                {unregisteringId === event._id ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4" />
                                    <span>Se désinscrire</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default MyRegistrations
