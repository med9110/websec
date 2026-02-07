import { cn } from '../../utils/helpers'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendLabel,
  variant = 'default',
  className 
}) => {
  const variants = {
    default: 'bg-white',
    primary: 'bg-primary-50',
    secondary: 'bg-secondary-50',
    success: 'bg-green-50',
    warning: 'bg-yellow-50',
    info: 'bg-blue-50'
  }

  const iconVariants = {
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    info: 'bg-blue-100 text-blue-600'
  }

  const getTrendIcon = () => {
    if (trend === undefined || trend === null) return null
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getTrendColor = () => {
    if (trend === undefined || trend === null) return ''
    if (trend > 0) return 'text-green-600'
    if (trend < 0) return 'text-red-600'
    return 'text-gray-500'
  }

  return (
    <div className={cn('card p-6', variants[variant], className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          
          {(trend !== undefined || trendLabel) && (
            <div className="flex items-center mt-2 space-x-1">
              {getTrendIcon()}
              {trend !== undefined && (
                <span className={cn('text-sm font-medium', getTrendColor())}>
                  {trend > 0 ? '+' : ''}{trend}%
                </span>
              )}
              {trendLabel && (
                <span className="text-sm text-gray-500">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        
        {Icon && (
          <div className={cn('p-3 rounded-xl', iconVariants[variant])}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
