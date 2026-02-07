import { cn } from '../../utils/helpers'

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className 
}) => {
  return (
    <div className={cn('text-center py-12', className)}>
      {Icon && (
        <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
          <Icon className="h-full w-full" />
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}

export default EmptyState
