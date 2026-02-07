import Joi from 'joi';
import { AppError } from './errorHandler.js';
import { ErrorCodes } from '../config/errorCodes.js';

export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, '')
      }));

      return next(new AppError(ErrorCodes.VALIDATION_ERROR, 400, details));
    }

    req[property] = value;
    next();
  };
};

export const authSchemas = {
  register: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Format d\'email invalide',
        'any.required': 'L\'email est requis'
      }),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
        'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
        'any.required': 'Le mot de passe est requis'
      }),
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.only': 'Les mots de passe ne correspondent pas',
        'any.required': 'La confirmation du mot de passe est requise'
      }),
    firstName: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': 'Le prénom doit contenir au moins 2 caractères',
        'string.max': 'Le prénom ne peut pas dépasser 50 caractères',
        'any.required': 'Le prénom est requis'
      }),
    lastName: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.min': 'Le nom doit contenir au moins 2 caractères',
        'string.max': 'Le nom ne peut pas dépasser 50 caractères',
        'any.required': 'Le nom est requis'
      })
  }),

  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Format d\'email invalide',
        'any.required': 'L\'email est requis'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Le mot de passe est requis'
      })
  }),

  refresh: Joi.object({
    refreshToken: Joi.string()
      .required()
      .messages({
        'any.required': 'Le refresh token est requis'
      })
  })
};

export const eventSchemas = {
  create: Joi.object({
    title: Joi.string()
      .trim()
      .min(5)
      .max(200)
      .required()
      .messages({
        'string.min': 'Le titre doit contenir au moins 5 caractères',
        'string.max': 'Le titre ne peut pas dépasser 200 caractères',
        'any.required': 'Le titre est requis'
      }),
    description: Joi.string()
      .trim()
      .min(20)
      .max(5000)
      .required()
      .messages({
        'string.min': 'La description doit contenir au moins 20 caractères',
        'string.max': 'La description ne peut pas dépasser 5000 caractères',
        'any.required': 'La description est requise'
      }),
    category: Joi.string()
      .valid('conference', 'workshop', 'concert', 'sport', 'networking', 'other')
      .required()
      .messages({
        'any.only': 'Catégorie invalide',
        'any.required': 'La catégorie est requise'
      }),
    status: Joi.string()
      .valid('draft', 'published', 'cancelled', 'completed')
      .default('draft'),
    startDate: Joi.date()
      .iso()
      .min('now')
      .required()
      .messages({
        'date.min': 'La date de début doit être dans le futur',
        'any.required': 'La date de début est requise'
      }),
    endDate: Joi.date()
      .iso()
      .greater(Joi.ref('startDate'))
      .required()
      .messages({
        'date.greater': 'La date de fin doit être après la date de début',
        'any.required': 'La date de fin est requise'
      }),
    location: Joi.object({
      address: Joi.string().trim().max(300).required().messages({
        'any.required': 'L\'adresse est requise'
      }),
      city: Joi.string().trim().max(100).required().messages({
        'any.required': 'La ville est requise'
      }),
      postalCode: Joi.string().trim().max(20).allow(''),
      country: Joi.string().trim().max(100).default('France')
    }).required(),
    capacity: Joi.number()
      .integer()
      .min(1)
      .max(100000)
      .required()
      .messages({
        'number.min': 'La capacité doit être d\'au moins 1',
        'number.max': 'La capacité ne peut pas dépasser 100 000',
        'any.required': 'La capacité est requise'
      }),
    price: Joi.number()
      .min(0)
      .default(0)
      .messages({
        'number.min': 'Le prix ne peut pas être négatif'
      }),
    tags: Joi.array()
      .items(Joi.string().trim().max(50))
      .max(10)
      .default([])
  }),

  update: Joi.object({
    title: Joi.string().trim().min(5).max(200),
    description: Joi.string().trim().min(20).max(5000),
    category: Joi.string().valid('conference', 'workshop', 'concert', 'sport', 'networking', 'other'),
    status: Joi.string().valid('draft', 'published', 'cancelled', 'completed'),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
    location: Joi.object({
      address: Joi.string().trim().max(300),
      city: Joi.string().trim().max(100),
      postalCode: Joi.string().trim().max(20).allow(''),
      country: Joi.string().trim().max(100)
    }),
    capacity: Joi.number().integer().min(1).max(100000),
    price: Joi.number().min(0),
    tags: Joi.array().items(Joi.string().trim().max(50)).max(10)
  }).min(1)
};

export const querySchemas = {
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().default('-createdAt'),
    search: Joi.string().trim().max(200).allow(''),
    category: Joi.string().valid('conference', 'workshop', 'concert', 'sport', 'networking', 'other').allow(''),
    status: Joi.string().valid('draft', 'published', 'cancelled', 'completed').allow(''),
    city: Joi.string().trim().max(100).allow(''),
    startDateFrom: Joi.date().iso().allow(''),
    startDateTo: Joi.date().iso().allow(''),
    priceMin: Joi.number().min(0).allow(''),
    priceMax: Joi.number().min(0).allow(''),
    organizer: Joi.string().allow('')
  })
};

export const mongoIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'ID invalide',
      'any.required': 'L\'ID est requis'
    })
});
