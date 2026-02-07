import { useState, useEffect } from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { categoryLabels, statusLabels } from '../../utils/helpers'

const EventFilters = ({ filters, onFilterChange, showStatusFilter = false }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localFilters, setLocalFilters] = useState(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleInputChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
  }

  const handleSearch = () => {
    onFilterChange(localFilters)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleClear = () => {
    const clearedFilters = {
      search: '',
      category: '',
      status: '',
      city: '',
      priceMin: '',
      priceMax: '',
      sort: '-startDate'
    }
    setLocalFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = Object.entries(localFilters).some(
    ([key, value]) => value && key !== 'sort' && key !== 'page' && key !== 'limit'
  )

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      {/* Barre de recherche principale */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un événement..."
            value={localFilters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
            onKeyDown={handleKeyPress}
            className="input pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`btn-outline flex items-center space-x-2 ${isExpanded ? 'bg-gray-50' : ''}`}
          >
            <Filter className="h-4 w-4" />
            <span>Filtres</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          <button onClick={handleSearch} className="btn-primary">
            Rechercher
          </button>
        </div>
      </div>

      {/* Filtres avancés */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Catégorie */}
            <div>
              <label className="label">Catégorie</label>
              <select
                value={localFilters.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="input"
              >
                <option value="">Toutes</option>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Statut (optionnel) */}
            {showStatusFilter && (
              <div>
                <label className="label">Statut</label>
                <select
                  value={localFilters.status || ''}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="input"
                >
                  <option value="">Tous</option>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Ville */}
            <div>
              <label className="label">Ville</label>
              <input
                type="text"
                placeholder="Ex: Casablanca"
                value={localFilters.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="input"
              />
            </div>

            {/* Prix */}
            <div>
              <label className="label">Prix</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  min="0"
                  value={localFilters.priceMin || ''}
                  onChange={(e) => handleInputChange('priceMin', e.target.value)}
                  className="input"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  min="0"
                  value={localFilters.priceMax || ''}
                  onChange={(e) => handleInputChange('priceMax', e.target.value)}
                  className="input"
                />
              </div>
            </div>

            {/* Tri */}
            <div>
              <label className="label">Trier par</label>
              <select
                value={localFilters.sort || '-startDate'}
                onChange={(e) => handleInputChange('sort', e.target.value)}
                className="input"
              >
                <option value="-startDate">Date (plus récent)</option>
                <option value="startDate">Date (plus ancien)</option>
                <option value="-createdAt">Création (récent)</option>
                <option value="price">Prix (croissant)</option>
                <option value="-price">Prix (décroissant)</option>
                <option value="-registrationCount">Popularité</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end mt-4 space-x-2">
            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="btn-outline flex items-center space-x-1 text-sm"
              >
                <X className="h-4 w-4" />
                <span>Effacer les filtres</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EventFilters
