import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'
import { fr } from 'date-fns/locale'

export const formatDate = (date, formatStr = 'dd MMMM yyyy') => {
  if (!date) return ''
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(parsedDate)) return ''
  return format(parsedDate, formatStr, { locale: fr })
}

export const formatDateTime = (date) => {
  return formatDate(date, "dd MMMM yyyy 'à' HH:mm")
}

export const formatShortDate = (date) => {
  return formatDate(date, 'dd/MM/yyyy')
}

export const formatTime = (date) => {
  return formatDate(date, 'HH:mm')
}

export const timeAgo = (date) => {
  if (!date) return ''
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(parsedDate)) return ''
  return formatDistanceToNow(parsedDate, { addSuffix: true, locale: fr })
}

export const toInputDateTime = (date) => {
  if (!date) return ''
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  if (!isValid(parsedDate)) return ''
  return format(parsedDate, "yyyy-MM-dd'T'HH:mm")
}

export const formatPrice = (price) => {
  if (price === 0) return 'Gratuit'
  return new Intl.NumberFormat('fr-MA', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price) + ' DH'
}

export const formatNumber = (num) => {
  return new Intl.NumberFormat('fr-FR').format(num)
}

export const truncate = (text, length = 100) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

export const categoryLabels = {
  conference: 'Conférence',
  workshop: 'Atelier',
  concert: 'Concert',
  sport: 'Sport',
  networking: 'Networking',
  other: 'Autre'
}

export const statusLabels = {
  draft: 'Brouillon',
  published: 'Publié',
  cancelled: 'Annulé',
  completed: 'Terminé'
}

export const statusColors = {
  draft: 'gray',
  published: 'success',
  cancelled: 'danger',
  completed: 'primary'
}

export const categoryColors = {
  conference: 'primary',
  workshop: 'secondary',
  concert: 'warning',
  sport: 'success',
  networking: 'primary',
  other: 'gray'
}

export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  
  return searchParams.toString()
}

export const getFileUrl = (fileId) => {
  if (!fileId) return null
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  return `${API_URL}/files/${fileId}/preview`
}

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}
