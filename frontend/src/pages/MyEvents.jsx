import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import eventService from '../services/eventService'
import EventCard from '../components/Events/EventCard'
import Pagination from '../components/UI/Pagination'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import EmptyState from '../components/UI/EmptyState'
import ErrorMessage from '../components/UI/ErrorMessage'
import { Calendar, Plus, Search } from 'lucide-react'
import { statusLabels, categoryLabels } from '../utils/helpers'

const MyEvents = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [events, setEvents] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    status: searchParams.get('status') || '',
    sort: searchParams.get('sort') || '-createdAt',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12
  })

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = { ...filters }
      
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null) {
          delete params[key]
        }
      })

      const response = await eventService.getMyEvents(params)
      setEvents(response.data)
      setPagination(response.pagination)
    } catch (err) {
      console.error('Erreur chargement événements:', err)
      setError('Impossible de charger vos événements')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'limit') {
        params.set(key, value)
      }
    })
    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value, page: 1 })
  }

  const handlePageChange = (page) => {
    setFilters({ ...filters, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mes événements
            </h1>
            <p className="text-gray-600">
              Gérez les événements que vous avez créés
            </p>
          </div>
          <Link
            to="/events/create"
            className="btn-primary mt-4 md:mt-0 inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Créer un événement</span>
          </Link>
        </div>

        {/* Filtres */}
        <div className="card p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Rechercher..."
                className="input pl-10"
              />
            </div>

            {/* Catégorie */}
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">Toutes catégories</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            {/* Statut */}
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">Tous les statuts</option>
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            {/* Tri */}
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="-createdAt">Plus récent</option>
              <option value="createdAt">Plus ancien</option>
              <option value="-startDate">Date (décroissant)</option>
              <option value="startDate">Date (croissant)</option>
              <option value="title">Titre (A-Z)</option>
              <option value="-title">Titre (Z-A)</option>
            </select>
          </div>
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
            onRetry={fetchEvents}
          />
        ) : events.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="Aucun événement"
            description="Vous n'avez pas encore créé d'événements. Commencez dès maintenant !"
            action={
              <Link to="/events/create" className="btn-primary inline-flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Créer mon premier événement</span>
              </Link>
            }
          />
        ) : (
          <>
            {/* Résultats */}
            <div className="mb-4 text-sm text-gray-600">
              {pagination?.total} événement{pagination?.total > 1 ? 's' : ''} trouvé{pagination?.total > 1 ? 's' : ''}
            </div>

            {/* Grille d'événements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {events.map((event) => (
                <EventCard 
                  key={event._id} 
                  event={event} 
                  showStatus
                />
              ))}
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

export default MyEvents
