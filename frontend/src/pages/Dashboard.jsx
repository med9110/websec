import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import statsService from '../services/statsService'
import eventService from '../services/eventService'
import { formatPrice, categoryLabels } from '../utils/helpers'
import { 
  Calendar, 
  Users, 
  Euro, 
  TrendingUp,
  ArrowRight,
  Plus
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import ErrorMessage from '../components/UI/ErrorMessage'
import StatCard from '../components/UI/StatCard'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [trends, setTrends] = useState(null)
  const [recentEvents, setRecentEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444']

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [statsRes, trendsRes, eventsRes] = await Promise.all([
        statsService.getDashboard(),
        statsService.getTrends(),
        eventService.getMyEvents({ limit: 5, sort: '-createdAt' })
      ])

      setStats(statsRes.data)
      setTrends(trendsRes.data)
      setRecentEvents(eventsRes.data)
    } catch (err) {
      console.error('Erreur chargement dashboard:', err)
      setError('Impossible de charger les données du tableau de bord')
    } finally {
      setLoading(false)
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
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ErrorMessage 
          title="Erreur de chargement"
          message={error}
          onRetry={fetchDashboardData}
        />
      </div>
    )
  }

  const categoryData = stats?.eventsByCategory?.map((item, index) => ({
    name: categoryLabels[item._id] || item._id,
    value: item.count,
    color: COLORS[index % COLORS.length]
  })) || []

  const trendData = trends?.registrations?.map(item => ({
    date: item.label || item._id,
    inscriptions: item.count
  })) || []

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {user?.firstName} !
          </h1>
          <p className="mt-2 text-gray-600">
            Voici un aperçu de votre activité sur EventHub
          </p>
        </div>

        {/* Actions rapides */}
        <div className="mb-8">
          <Link
            to="/events/create"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Créer un événement</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Mes événements"
            value={stats?.myEvents || 0}
            icon={Calendar}
            trend={stats?.eventsGrowth || 0}
            variant="primary"
          />
          <StatCard
            title="Inscriptions reçues"
            value={stats?.totalRegistrations || 0}
            icon={Users}
            trend={8}
            variant="success"
          />
          <StatCard
            title="Revenus totaux"
            value={formatPrice(stats?.totalRevenue || 0)}
            icon={Calendar}
            trend={15}
            variant="warning"
          />
          <StatCard
            title="Taux de remplissage"
            value={`${stats?.fillRate || 0}%`}
            icon={TrendingUp}
            trend={5}
            variant="default"
          />
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Tendances des inscriptions */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tendances des inscriptions
            </h2>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="inscriptions" 
                    stroke="#6366f1" 
                    strokeWidth={2}
                    dot={{ fill: '#6366f1' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Pas de données disponibles
              </div>
            )}
          </div>

          {/* Répartition par catégorie */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Événements par catégorie
            </h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Pas de données disponibles
              </div>
            )}
          </div>
        </div>

        {/* Événements par statut */}
        <div className="card p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Événements par statut
          </h2>
          {stats?.eventsByStatus?.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.eventsByStatus.map(s => ({
                status: s._id === 'published' ? 'Publié' : s._id === 'draft' ? 'Brouillon' : 'Annulé',
                count: s.count
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="status" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-500">
              Pas de données disponibles
            </div>
          )}
        </div>

        {/* Derniers événements */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Mes derniers événements
            </h2>
            <Link
              to="/my-events"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
            >
              <span>Voir tout</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recentEvents.length > 0 ? (
            <div className="space-y-4">
              {recentEvents.map((event) => (
                <Link
                  key={event._id}
                  to={`/events/${event._id}`}
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {event.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {categoryLabels[event.category]} • {event.registeredCount || 0} inscrit(s)
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.status === 'published' 
                      ? 'bg-green-100 text-green-700'
                      : event.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {event.status === 'published' ? 'Publié' : event.status === 'draft' ? 'Brouillon' : 'Annulé'}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Vous n'avez pas encore créé d'événements</p>
              <Link
                to="/events/create"
                className="btn-primary mt-4 inline-flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Créer mon premier événement</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
