import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventSchema, eventDefaultValues } from '../../utils/validation'
import { categoryLabels, toInputDateTime } from '../../utils/helpers'
import FileUpload from '../UI/FileUpload'

const EventForm = ({ 
  onSubmit, 
  initialData, 
  isLoading,
  coverImage,
  onCoverChange,
  onCoverRemove
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: eventDefaultValues
  })

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        startDate: toInputDateTime(initialData.startDate),
        endDate: toInputDateTime(initialData.endDate),
        capacity: initialData.capacity || 100,
        price: initialData.price || 0
      })
    }
  }, [initialData, reset])

  const onFormSubmit = (data) => {
    const formattedData = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString()
    }
    onSubmit(formattedData)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Image de couverture */}
      <div>
        <label className="label">Image de couverture</label>
        <FileUpload
          currentFile={coverImage}
          onFileSelect={onCoverChange}
          onRemove={onCoverRemove}
          accept="image/*"
        />
      </div>

      {/* Titre */}
      <div>
        <label className="label">Titre *</label>
        <input
          type="text"
          {...register('title')}
          className={`input ${errors.title ? 'input-error' : ''}`}
          placeholder="Nom de votre événement"
        />
        {errors.title && (
          <p className="error-message">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="label">Description *</label>
        <textarea
          {...register('description')}
          rows={5}
          className={`input ${errors.description ? 'input-error' : ''}`}
          placeholder="Décrivez votre événement en détail..."
        />
        {errors.description && (
          <p className="error-message">{errors.description.message}</p>
        )}
      </div>

      {/* Catégorie et Statut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Catégorie *</label>
          <select
            {...register('category')}
            className={`input ${errors.category ? 'input-error' : ''}`}
          >
            <option value="">Sélectionner une catégorie</option>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {errors.category && (
            <p className="error-message">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="label">Statut</label>
          <select {...register('status')} className="input">
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
          </select>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Date et heure de début *</label>
          <input
            type="datetime-local"
            {...register('startDate')}
            className={`input ${errors.startDate ? 'input-error' : ''}`}
          />
          {errors.startDate && (
            <p className="error-message">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label className="label">Date et heure de fin *</label>
          <input
            type="datetime-local"
            {...register('endDate')}
            className={`input ${errors.endDate ? 'input-error' : ''}`}
          />
          {errors.endDate && (
            <p className="error-message">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      {/* Lieu */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Lieu</h3>
        
        <div>
          <label className="label">Adresse *</label>
          <input
            type="text"
            {...register('location.address')}
            className={`input ${errors.location?.address ? 'input-error' : ''}`}
            placeholder="123 Rue de l'exemple"
          />
          {errors.location?.address && (
            <p className="error-message">{errors.location.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Ville *</label>
            <input
              type="text"
              {...register('location.city')}
              className={`input ${errors.location?.city ? 'input-error' : ''}`}
              placeholder="Paris"
            />
            {errors.location?.city && (
              <p className="error-message">{errors.location.city.message}</p>
            )}
          </div>

          <div>
            <label className="label">Code postal</label>
            <input
              type="text"
              {...register('location.postalCode')}
              className="input"
              placeholder="75001"
            />
          </div>

          <div>
            <label className="label">Pays</label>
            <input
              type="text"
              {...register('location.country')}
              className="input"
              placeholder="France"
            />
          </div>
        </div>
      </div>

      {/* Capacité et Prix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Capacité *</label>
          <Controller
            name="capacity"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                className={`input ${errors.capacity ? 'input-error' : ''}`}
                min="1"
                placeholder="100"
              />
            )}
          />
          {errors.capacity && (
            <p className="error-message">{errors.capacity.message}</p>
          )}
        </div>

        <div>
          <label className="label">Prix (€)</label>
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                className={`input ${errors.price ? 'input-error' : ''}`}
                min="0"
                step="0.01"
                placeholder="0 = Gratuit"
              />
            )}
          />
          {errors.price && (
            <p className="error-message">{errors.price.message}</p>
          )}
        </div>
      </div>

      {/* Bouton de soumission */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary"
        >
          {isLoading ? 'Enregistrement...' : initialData ? 'Mettre à jour' : 'Créer l\'événement'}
        </button>
      </div>
    </form>
  )
}

export default EventForm
