import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { isAuthenticated, getUser, logout } from '../services/auth'
import './Navbar.css'

/**
 * Navbar Component
 * 
 * Navigation bar that appears on every page.
 * Shows links to all main sections of the app.
 * 
 * Features:
 * - Highlights current page
 * - Responsive design (mobile + desktop)
 * - Shows login/register buttons when not logged in
 * - Shows user menu when logged in
 */
function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check authentication status on mount and when location changes
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(isAuthenticated())
      setUser(getUser())
    }
    checkAuth()
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [location])

  // Check if a link is active (current page)
  const isActive = (path) => location.pathname === path

  // Handle logout
  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
    setUser(null)
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <Link to="/" className="navbar-brand">
          <h1>AniHub</h1>
        </Link>

        {/* Navigation Links */}
        <ul className="navbar-links">
          <li>
            <Link 
              to="/" 
              className={isActive('/') ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/browse" 
              className={isActive('/browse') ? 'active' : ''}
            >
              Browse
            </Link>
          </li>
          <li>
            <Link 
              to="/tracker" 
              className={isActive('/tracker') ? 'active' : ''}
            >
              Tracker
            </Link>
          </li>
          <li>
            <Link 
              to="/discussions" 
              className={isActive('/discussions') ? 'active' : ''}
            >
              Discussions
            </Link>
          </li>
          <li>
            <Link 
              to="/where-to-watch" 
              className={isActive('/where-to-watch') ? 'active' : ''}
            >
              Where to Watch
            </Link>
          </li>
          <li>
            <Link 
              to="/profile" 
              className={isActive('/profile') ? 'active' : ''}
            >
              Profile
            </Link>
          </li>
        </ul>

        {/* Auth Buttons or User Menu */}
        <div className="navbar-auth">
          {isLoggedIn && user ? (
            <div className="user-menu">
              <span className="username">Hello, {user.username}</span>
              <Link to="/profile" className="btn-profile">Profile</Link>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <Link to="/register" className="btn-register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
