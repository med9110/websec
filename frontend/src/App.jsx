import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import ProtectedRoute from './components/Auth/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import EventCreate from './pages/EventCreate'
import EventEdit from './pages/EventEdit'
import Dashboard from './pages/Dashboard'
import MyEvents from './pages/MyEvents'
import MyRegistrations from './pages/MyRegistrations'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Routes publiques */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetail />} />

        {/* Routes protégées (authentifiées) */}
        <Route element={<ProtectedRoute />}>
          <Route path="events/create" element={<EventCreate />} />
          <Route path="events/:id/edit" element={<EventEdit />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="my-events" element={<MyEvents />} />
          <Route path="my-registrations" element={<MyRegistrations />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
