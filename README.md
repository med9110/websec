# EventHub - Plateforme de Gestion d'Événements

**EventHub** est une application Full Stack moderne permettant de créer, gérer et participer à des événements. Développée avec les technologies les plus récentes, elle offre une expérience utilisateur fluide et sécurisée.

## Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#-technologies-utilisées)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement](#-lancement)
- [Comptes de test](#-comptes-de-test)
- [API Endpoints](#-api-endpoints)
- [Structure du projet](#-structure-du-projet)

## Fonctionnalités

### Authentification & Sécurité
- Inscription et connexion sécurisées
- JWT avec Access Token (15min) et Refresh Token (7 jours)
- Gestion des rôles (Admin / User)
- Protection des routes sensibles
- Hachage des mots de passe avec bcrypt (12 rounds)

### Gestion des événements
- Création, modification et suppression d'événements
- Catégories : Conférence, Atelier, Concert, Sport, Networking, Autre
- Statuts : Brouillon, Publié, Annulé
- Gestion de la capacité et des places disponibles
- Upload d'images de couverture

### Recherche & Filtres
- Recherche textuelle (titre, description)
- Filtres par catégorie, statut, ville, prix
- Tri par date, titre, prix
- Pagination côté serveur

### Dashboard & Statistiques
- Vue d'ensemble des événements créés
- Graphiques de tendances (Recharts)
- Statistiques par catégorie
- Taux de remplissage
- Revenus totaux

### Inscriptions
- Inscription/désinscription aux événements
- Gestion des participants
- Historique des inscriptions

## Technologies utilisées

### Backend
| Technologie | Version | Description |
|-------------|---------|-------------|
| Node.js | 18+ | Runtime JavaScript |
| Express | 4.18.2 | Framework web |
| MongoDB | 7.0+ | Base de données NoSQL |
| Mongoose | 8.0.3 | ODM pour MongoDB |
| JWT | 9.0.2 | Authentification |
| bcryptjs | 2.4.3 | Hachage des mots de passe |
| Multer | 1.4.5 | Upload de fichiers |
| Joi | 17.11.0 | Validation des données |

### Frontend
| Technologie | Version | Description |
|-------------|---------|-------------|
| React | 18.2.0 | Bibliothèque UI |
| Vite | 5.0.10 | Build tool |
| TailwindCSS | 3.4.0 | Framework CSS |
| React Router | 6.21.1 | Routing |
| React Hook Form | 7.49.2 | Gestion des formulaires |
| Zod | 3.22.4 | Validation TypeSafe |
| Recharts | 2.10.3 | Graphiques |
| Axios | 1.6.2 | Client HTTP |

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React)                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │    Pages    │ │  Components │ │   Context   │ │  Services │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST (Axios)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER (Express)                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │   Routes    │ │ Controllers │ │   Services  │ │   Models  │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
│                      │                                          │
│  ┌─────────────────────────────────────────────────────────────┤
│  │                    Middlewares                               │
│  │  (Auth, Validation, Error Handler, Upload)                   │
│  └─────────────────────────────────────────────────────────────┤
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Mongoose
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         MongoDB                                  │
│  ┌───────┐ ┌────────┐ ┌──────────────┐ ┌───────┐              │
│  │ Users │ │ Events │ │ Registrations │ │ Files │              │
│  └───────┘ └────────┘ └──────────────┘ └───────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## Installation

### Prérequis
- Node.js 18+
- MongoDB 7.0+ (local ou Atlas)
- npm ou yarn

### 1. Cloner le projet
```bash
git clone <repository-url>
cd eventhub
```

### 2. Installer les dépendances Backend
```bash
cd backend
npm install
```

### 3. Installer les dépendances Frontend
```bash
cd ../frontend
npm install
```

## Configuration

### Backend (.env)
Créer un fichier `.env` dans le dossier `backend` :

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/eventhub

# JWT
JWT_SECRET=votre_secret_jwt_super_securise_123456
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=votre_refresh_secret_super_securise_789
JWT_REFRESH_EXPIRES_IN=7d

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads
```

### Frontend (.env)
Créer un fichier `.env` dans le dossier `frontend` :

```env
VITE_API_URL=http://localhost:5000/api
```

## Lancement

### Démarrer MongoDB
```bash
# Si MongoDB est installé localement
mongod
```

### Démarrer le Backend
```bash
cd backend

# Mode développement (avec hot-reload)
npm run dev

# Mode production
npm start
```

### Initialiser la base de données (optionnel)
```bash
cd backend
npm run seed
```

### Démarrer le Frontend
```bash
cd frontend
npm run dev
```

L'application sera accessible sur :
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:5000/api

## Comptes de test

Après avoir exécuté `npm run seed` :

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@eventhub.ma | Admin123! |
| User | user@eventhub.ma | User123! |
| User | marie@eventhub.ma | Marie123! |
| User | pierre@eventhub.ma | Pierre123! |

## API Endpoints

### Authentification
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/auth/register` | Inscription | Non |
| POST | `/api/auth/login` | Connexion | Non |
| POST | `/api/auth/refresh` | Rafraîchir le token | Non |
| POST | `/api/auth/logout` | Déconnexion | Oui |
| GET | `/api/auth/me` | Profil utilisateur | Oui |

### Événements
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/events` | Liste des événements | Non |
| GET | `/api/events/:id` | Détail d'un événement | Non |
| POST | `/api/events` | Créer un événement | Oui |
| PUT | `/api/events/:id` | Modifier un événement | Oui (owner/admin) |
| DELETE | `/api/events/:id` | Supprimer un événement | Oui (owner/admin) |
| POST | `/api/events/:id/register` | S'inscrire | Oui |
| DELETE | `/api/events/:id/register` | Se désinscrire | Oui |
| POST | `/api/events/:id/cover` | Upload image couverture | Oui (owner) |

### Utilisateurs
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/users/my-events` | Mes événements | Oui |
| GET | `/api/users/my-registrations` | Mes inscriptions | Oui |
| POST | `/api/users/avatar` | Upload avatar | Oui |

### Fichiers
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/files` | Liste des fichiers | Oui |
| GET | `/api/files/:id` | Détail d'un fichier | Oui |
| GET | `/api/files/:id/preview` | Prévisualiser | Non |
| GET | `/api/files/:id/download` | Télécharger | Oui |
| DELETE | `/api/files/:id` | Supprimer | Oui (owner/admin) |

### Statistiques
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/stats/dashboard` | Dashboard | Oui |
| GET | `/api/stats/trends` | Tendances | Oui |
| GET | `/api/stats/categories` | Par catégorie | Oui |

## Structure du projet

```
eventhub/
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration (DB, erreurs)
│   │   ├── controllers/      # Contrôleurs
│   │   ├── middlewares/      # Middlewares (auth, validation)
│   │   ├── models/           # Modèles Mongoose
│   │   ├── routes/           # Routes Express
│   │   ├── services/         # Logique métier
│   │   ├── seeds/            # Scripts de seed
│   │   └── server.js         # Point d'entrée
│   ├── uploads/              # Fichiers uploadés
│   ├── .env                  # Variables d'environnement
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/       # Composants React
    │   │   ├── Auth/        # Authentification
    │   │   ├── Events/      # Événements
    │   │   ├── Layout/      # Layout (Navbar, Footer)
    │   │   └── UI/          # Composants UI réutilisables
    │   ├── contexts/        # Contextes React
    │   ├── pages/           # Pages/Routes
    │   ├── services/        # Services API
    │   ├── utils/           # Utilitaires
    │   ├── App.jsx          # Composant racine
    │   └── main.jsx         # Point d'entrée
    ├── .env                 # Variables d'environnement
    └── package.json
```

## Fonctionnalités testées

- Inscription avec validation
- Connexion et déconnexion
- Refresh token automatique
- CRUD complet des événements
- Recherche et filtres avancés
- Pagination serveur
- Upload d'images
- Dashboard avec graphiques
- Gestion des inscriptions
- Protection des routes
- Gestion des erreurs

## Licence

Ce projet est développé dans un cadre éducatif (INE 3 - WebSec).
