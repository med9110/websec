# Guide de Déploiement EventHub

Ce guide explique comment déployer l'application EventHub avec le backend sur Render et le frontend sur Vercel ou Netlify.

## Prérequis

1. Compte MongoDB Atlas (base de données cloud gratuite)
2. Compte Render (backend hosting)
3. Compte Vercel ou Netlify (frontend hosting)
4. Repository Git (GitHub, GitLab, etc.)

---

## 1. Configuration de MongoDB Atlas

1. Créez un compte sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Créez un nouveau cluster (le tier gratuit M0 suffit)
3. Configurez un utilisateur de base de données avec un mot de passe
4. Dans "Network Access", ajoutez `0.0.0.0/0` pour autoriser toutes les IPs (nécessaire pour Render)
5. Récupérez l'URI de connexion: `mongodb+srv://username:password@cluster.mongodb.net/eventhub`

---

## 2. Déploiement du Backend sur Render

### Option A: Déploiement automatique avec Blueprint

1. Connectez votre repository Git à Render
2. Le fichier `render.yaml` configurera automatiquement le service

### Option B: Déploiement manuel

1. Allez sur [Render Dashboard](https://dashboard.render.com)
2. Cliquez sur "New" → "Web Service"
3. Connectez votre repository Git
4. Configurez le service:
   - **Name**: `eventhub-backend`
   - **Region**: Frankfurt (EU) ou autre proche de vos utilisateurs
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Ajoutez les variables d'environnement:

| Variable | Valeur |
|----------|--------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGODB_URI` | Votre URI MongoDB Atlas |
| `JWT_SECRET` | Générez avec `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | Générez avec `openssl rand -base64 32` |
| `JWT_EXPIRES_IN` | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | `7d` |
| `FRONTEND_URL` | `https://votre-app.vercel.app` (à mettre à jour après déploiement frontend) |
| `UPLOAD_PATH` | `uploads` |
| `MAX_FILE_SIZE` | `5242880` |

6. Cliquez sur "Create Web Service"
7. Notez l'URL du backend (ex: `https://eventhub-backend.onrender.com`)

---

## 3. Déploiement du Frontend

### Option A: Vercel

1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Cliquez sur "Add New" → "Project"
3. Importez votre repository Git
4. Configurez le projet:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Ajoutez les variables d'environnement:

| Variable | Valeur |
|----------|--------|
| `VITE_API_URL` | `https://votre-backend.onrender.com/api` |
| `VITE_APP_NAME` | `EventHub` |

6. Cliquez sur "Deploy"
7. Notez l'URL du frontend

### Option B: Netlify

1. Allez sur [Netlify Dashboard](https://app.netlify.com)
2. Cliquez sur "Add new site" → "Import an existing project"
3. Connectez votre repository Git
4. Configurez le build:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

5. Ajoutez les variables d'environnement dans Site Settings → Environment Variables:

| Variable | Valeur |
|----------|--------|
| `VITE_API_URL` | `https://votre-backend.onrender.com/api` |
| `VITE_APP_NAME` | `EventHub` |

6. Redéployez le site
7. Notez l'URL du frontend

---

## 4. Configuration Finale

### Mise à jour du CORS Backend

Après le déploiement du frontend, retournez sur Render et mettez à jour la variable `FRONTEND_URL` avec l'URL réelle de votre frontend (Vercel ou Netlify).

### Vérification

1. Vérifiez que le backend répond: `https://votre-backend.onrender.com/api/health`
2. Accédez au frontend et testez:
   - Inscription
   - Connexion
   - Création d'événement
   - Upload de fichiers

---

## 5. Domaine Personnalisé (Optionnel)

### Vercel
1. Settings → Domains → Add Domain
2. Configurez les DNS chez votre registrar

### Netlify
1. Domain Settings → Add custom domain
2. Configurez les DNS chez votre registrar

### Render
1. Settings → Custom Domains → Add Custom Domain
2. Configurez les DNS chez votre registrar

---

## Dépannage

### Le backend ne démarre pas
- Vérifiez les logs dans Render Dashboard
- Assurez-vous que `MONGODB_URI` est correct
- Vérifiez que l'IP de Render est autorisée dans MongoDB Atlas

### Erreurs CORS
- Vérifiez que `FRONTEND_URL` dans Render correspond exactement à l'URL du frontend
- Assurez-vous qu'il n'y a pas de `/` à la fin de l'URL

### Les uploads ne fonctionnent pas
- Note: Sur le plan gratuit de Render, le filesystem est éphémère
- Pour la production, envisagez d'utiliser un service de stockage externe (AWS S3, Cloudinary)

### Le backend se met en veille (plan gratuit Render)
- Les services gratuits Render se mettent en veille après 15 minutes d'inactivité
- La première requête après inactivité peut prendre ~30 secondes
- Pour éviter cela, utilisez un service de ping ou passez au plan payant

---

## Variables d'Environnement Récapitulatif

### Backend (Render)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=xxx
JWT_REFRESH_SECRET=xxx
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=https://votre-frontend.vercel.app
UPLOAD_PATH=uploads
MAX_FILE_SIZE=5242880
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/gif,image/webp,application/pdf
```

### Frontend (Vercel/Netlify)
```
VITE_API_URL=https://votre-backend.onrender.com/api
VITE_APP_NAME=EventHub
```
