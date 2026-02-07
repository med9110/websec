import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  password: z
    .string()
    .min(1, 'Le mot de passe est requis')
})

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères'),
  lastName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  email: z
    .string()
    .min(1, 'L\'email est requis')
    .email('Format d\'email invalide'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre'
    ),
  confirmPassword: z
    .string()
    .min(1, 'La confirmation du mot de passe est requise')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
})

export const eventSchema = z.object({
  title: z
    .string()
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  description: z
    .string()
    .min(20, 'La description doit contenir au moins 20 caractères')
    .max(5000, 'La description ne peut pas dépasser 5000 caractères'),
  category: z
    .enum(['conference', 'workshop', 'concert', 'sport', 'networking', 'other'], {
      errorMap: () => ({ message: 'Veuillez sélectionner une catégorie' })
    }),
  status: z
    .enum(['draft', 'published', 'cancelled', 'completed'])
    .default('draft'),
  startDate: z
    .string()
    .min(1, 'La date de début est requise'),
  endDate: z
    .string()
    .min(1, 'La date de fin est requise'),
  location: z.object({
    address: z
      .string()
      .min(1, 'L\'adresse est requise')
      .max(300, 'L\'adresse ne peut pas dépasser 300 caractères'),
    city: z
      .string()
      .min(1, 'La ville est requise')
      .max(100, 'La ville ne peut pas dépasser 100 caractères'),
    postalCode: z
      .string()
      .max(20, 'Le code postal ne peut pas dépasser 20 caractères')
      .optional(),
    country: z
      .string()
      .max(100, 'Le pays ne peut pas dépasser 100 caractères')
      .default('Maroc')
  }),
  capacity: z
    .number({ invalid_type_error: 'La capacité doit être un nombre' })
    .int('La capacité doit être un nombre entier')
    .min(1, 'La capacité doit être d\'au moins 1')
    .max(100000, 'La capacité ne peut pas dépasser 100 000'),
  price: z
    .number({ invalid_type_error: 'Le prix doit être un nombre' })
    .min(0, 'Le prix ne peut pas être négatif')
    .default(0),
  tags: z
    .array(z.string().max(50))
    .max(10, 'Maximum 10 tags')
    .optional()
}).refine((data) => {
  const start = new Date(data.startDate)
  const end = new Date(data.endDate)
  return end > start
}, {
  message: 'La date de fin doit être après la date de début',
  path: ['endDate']
})

export const eventDefaultValues = {
  title: '',
  description: '',
  category: '',
  status: 'draft',
  startDate: '',
  endDate: '',
  location: {
    address: '',
    city: '',
    postalCode: '',
    country: 'Maroc'
  },
  capacity: 100,
  price: 0,
  tags: []
}
