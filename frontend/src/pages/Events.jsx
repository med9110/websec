import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import eventService from '../services/eventService'
import EventCard from '../components/Events/EventCard'
import EventFilters from '../components/Events/EventFilters'
import Pagination from '../components/UI/Pagination'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import EmptyState from '../components/UI/EmptyState'
import ErrorMessage from '../components/UI/ErrorMessage'

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [events, setEvents] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    city: searchParams.get('city') || '',
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    sort: searchParams.get('sort') || '-startDate',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12
  })

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = {
        ...filters,
        status: 'published'
      }
      
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null) {
          delete params[key]
        }
      })

      const response = await eventService.getAll(params)
      setEvents(response.data)
      setPagination(response.pagination)
    } catch (err) {
      console.error('Erreur chargement événements:', err)
      setError('Impossible de charger les événements')
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

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1, limit: filters.limit })
  }

  const handlePageChange = (page) => {
    setFilters({ ...filters, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Événements
          </h1>
          <p className="text-gray-600">
            Découvrez tous les événements disponibles et inscrivez-vous
          </p>
        </div>

        {/* Filtres */}
        <EventFilters 
          filters={filters}
          onFilterChange={handleFilterChange}
        />

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
            title="Aucun événement trouvé"
            description="Aucun événement ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
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
                <EventCard key={event._id} event={event} />
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

export default Events
