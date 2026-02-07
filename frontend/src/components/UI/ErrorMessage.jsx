import { cn } from '../../utils/helpers'

const ErrorMessage = ({ title, message, onRetry, className }) => {
  return (
    <div className={cn('bg-red-50 border border-red-200 rounded-xl p-6 text-center', className)}>
      <div className="mx-auto h-12 w-12 text-red-500 mb-4">
        <svg
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-full w-full"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-red-800 mb-2">
        {title || 'Une erreur est survenue'}
      </h3>
      {message && (
        <p className="text-sm text-red-600 mb-4">{message}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn bg-red-600 text-white hover:bg-red-700"
        >
          Réessayer
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
