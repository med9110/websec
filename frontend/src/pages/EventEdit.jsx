import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import EventForm from '../components/Events/EventForm'
import eventService from '../services/eventService'
import { getFileUrl } from '../utils/helpers'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import ErrorMessage from '../components/UI/ErrorMessage'

const EventEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await eventService.getById(id)
      setEvent(response.data)
      // Set existing cover image preview if available
      if (response.data.coverImage) {
        setCoverPreview(getFileUrl(response.data.coverImage._id || response.data.coverImage))
      }
    } catch (err) {
      console.error('Erreur chargement événement:', err)
      setError('Impossible de charger l\'événement')
    } finally {
      setLoading(false)
    }
  }

  const handleCoverChange = (file) => {
    setCoverFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setCoverPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleCoverRemove = () => {
    setCoverFile(null)
    setCoverPreview(null)
  }

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      await eventService.update(id, data)

      // Upload new cover image if selected
      if (coverFile) {
        try {
          await eventService.uploadCover(id, coverFile)
        } catch (err) {
          console.error('Erreur upload couverture:', err)
          toast.error('Événement mis à jour mais l\'image n\'a pas pu être uploadée')
        }
      }

      toast.success('Événement mis à jour avec succès !')
      navigate(`/events/${id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la mise à jour')
      throw err
    } finally {
      setIsSubmitting(false)
    }
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
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ErrorMessage 
          title="Erreur de chargement"
          message={error}
          onRetry={fetchEvent}
        />
      </div>
    )
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
            Modifier l'événement
          </h1>
          <p className="mt-2 text-gray-600">
            Modifiez les informations de votre événement
          </p>
        </div>

        {/* Formulaire */}
        <EventForm 
          initialData={event}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          coverImage={coverPreview}
          onCoverChange={handleCoverChange}
          onCoverRemove={handleCoverRemove}
        />
      </div>
    </div>
  )
}

export default EventEdit
