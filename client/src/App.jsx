import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Browse from './pages/Browse'
import AnimeDetail from './pages/AnimeDetail'
import Tracker from './pages/Tracker'
import Discussions from './pages/Discussions'
import WhereToWatch from './pages/WhereToWatch'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

/**
 * Main App Component
 * 
 * This is the root component that sets up routing for the entire application.
 * 
 * How it works:
 * - BrowserRouter wraps everything to enable routing
 * - Routes defines all possible URL paths
 * - Route maps each path to a component (page)
 * - Navbar shows on every page
 * 
 * Routes:
 * - / → Home page (landing page)
 * - /browse → Browse anime/manga
 * - /tracker → User's personal tracker (requires login)
 * - /discussions → Community discussions
 * - /where-to-watch → Legal platforms
 * - /profile → User profile (requires login)
 */
function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/anime/:id" element={<AnimeDetail />} />
            <Route path="/discussions" element={<Discussions />} />
            <Route path="/where-to-watch" element={<WhereToWatch />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/tracker" 
              element={
                <ProtectedRoute>
                  <Tracker />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
