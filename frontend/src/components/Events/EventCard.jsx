import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'
import Badge from '../UI/Badge'
import { 
  formatDate, 
  formatPrice, 
  truncate, 
  categoryLabels, 
  statusLabels,
  statusColors,
  categoryColors,
  getFileUrl 
} from '../../utils/helpers'

const EventCard = ({ event }) => {
  const {
    _id,
    title,
    description,
    category,
    status,
    startDate,
    location,
    capacity,
    registrationCount,
    price,
    coverImage
  } = event

  const availableSpots = capacity - (registrationCount || 0)
  const isFull = availableSpots <= 0

  return (
    <Link 
      to={`/events/${_id}`}
      className="card group hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {coverImage ? (
          <img
            src={getFileUrl(coverImage._id || coverImage)}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-secondary-100">
            <Calendar className="h-16 w-16 text-primary-300" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge variant={categoryColors[category]}>
            {categoryLabels[category]}
          </Badge>
          {status !== 'published' && (
            <Badge variant={statusColors[status]}>
              {statusLabels[status]}
            </Badge>
          )}
        </div>

        {/* Prix */}
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-900">
            {formatPrice(price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
          {title}
        </h3>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {truncate(description, 100)}
        </p>

        <div className="space-y-2">
          {/* Date */}
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span>{formatDate(startDate, "EEE d MMM yyyy 'à' HH:mm")}</span>
          </div>

          {/* Lieu */}
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span className="truncate">{location?.city}, {location?.country}</span>
          </div>

          {/* Places */}
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            {isFull ? (
              <span className="text-red-600 font-medium">Complet</span>
            ) : (
              <span className="text-gray-600">
                {availableSpots} place{availableSpots > 1 ? 's' : ''} disponible{availableSpots > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default EventCard
