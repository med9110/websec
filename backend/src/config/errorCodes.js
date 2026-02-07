export const ErrorCodes = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',

  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  TOKEN_MISSING: 'TOKEN_MISSING',
  REFRESH_TOKEN_INVALID: 'REFRESH_TOKEN_INVALID',

  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',

  USER_EXISTS: 'USER_EXISTS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',

  EVENT_NOT_FOUND: 'EVENT_NOT_FOUND',
  EVENT_FULL: 'EVENT_FULL',
  ALREADY_REGISTERED: 'ALREADY_REGISTERED',
  NOT_REGISTERED: 'NOT_REGISTERED',

  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_TYPE_NOT_ALLOWED: 'FILE_TYPE_NOT_ALLOWED',
  FILE_UPLOAD_ERROR: 'FILE_UPLOAD_ERROR'
};

export const ErrorMessages = {
  [ErrorCodes.INTERNAL_ERROR]: 'Une erreur interne est survenue',
  [ErrorCodes.VALIDATION_ERROR]: 'Données de validation invalides',
  [ErrorCodes.NOT_FOUND]: 'Ressource non trouvée',
  [ErrorCodes.INVALID_CREDENTIALS]: 'Email ou mot de passe incorrect',
  [ErrorCodes.TOKEN_EXPIRED]: 'Le token a expiré',
  [ErrorCodes.TOKEN_INVALID]: 'Token invalide',
  [ErrorCodes.TOKEN_MISSING]: 'Token d\'authentification manquant',
  [ErrorCodes.REFRESH_TOKEN_INVALID]: 'Refresh token invalide ou expiré',
  [ErrorCodes.FORBIDDEN]: 'Accès refusé',
  [ErrorCodes.INSUFFICIENT_PERMISSIONS]: 'Permissions insuffisantes pour cette action',
  [ErrorCodes.USER_EXISTS]: 'Un utilisateur avec cet email existe déjà',
  [ErrorCodes.USER_NOT_FOUND]: 'Utilisateur non trouvé',
  [ErrorCodes.EVENT_NOT_FOUND]: 'Événement non trouvé',
  [ErrorCodes.EVENT_FULL]: 'L\'événement a atteint sa capacité maximale',
  [ErrorCodes.ALREADY_REGISTERED]: 'Vous êtes déjà inscrit à cet événement',
  [ErrorCodes.NOT_REGISTERED]: 'Vous n\'êtes pas inscrit à cet événement',
  [ErrorCodes.FILE_NOT_FOUND]: 'Fichier non trouvé',
  [ErrorCodes.FILE_TOO_LARGE]: 'Le fichier est trop volumineux',
  [ErrorCodes.FILE_TYPE_NOT_ALLOWED]: 'Type de fichier non autorisé',
  [ErrorCodes.FILE_UPLOAD_ERROR]: 'Erreur lors de l\'upload du fichier'
};
