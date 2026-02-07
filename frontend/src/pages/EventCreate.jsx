import { useNavigate } from 'react-router-dom'
import EventForm from '../components/Events/EventForm'
import eventService from '../services/eventService'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

const EventCreate = () => {
  const navigate = useNavigate()

  const handleSubmit = async (data) => {
    try {
      const response = await eventService.create(data)
      toast.success('Événement créé avec succès !')
      navigate(`/events/${response.data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la création')
      throw err
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Créer un événement
          </h1>
          <p className="mt-2 text-gray-600">
            Remplissez les informations ci-dessous pour créer votre événement
          </p>
        </div>

        {/* Formulaire */}
        <EventForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

export default EventCreate
