import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, Home as HomeIcon, Layout, MessageSquare, Tv, User, LogOut, Shield } from 'lucide-react'
import { isAuthenticated, getUser, logout } from '../services/auth'
import './Navbar.css'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(isAuthenticated())
      setUser(getUser())
    }
    checkAuth()
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [location])

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
    setUser(null)
    navigate('/')
  }

  const navLinks = [
    { path: '/', label: 'HOME', icon: <HomeIcon size={18} /> },
    { path: '/browse', label: 'EXPLORE', icon: <Compass size={18} /> },
    { path: '/tracker', label: 'SANCTUARY', icon: <Layout size={18} /> },
    { path: '/discussions', label: 'NEURAL_LINK', icon: <MessageSquare size={18} /> },
    { path: '/where-to-watch', label: 'NODE_MAP', icon: <Tv size={18} /> },
  ]

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container container">
        <Link to="/" className="navbar-brand">
          <Shield className="brand-icon" />
          <span className="brand-text">ANIPLACE</span>
        </Link>

        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`nav-item ${isActive(link.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{link.icon}</span>
                <span className="nav-label">{link.label}</span>
                {isActive(link.path) && (
                  <motion.div
                    layoutId="nav-glow"
                    className="nav-item-glow"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-auth">
          <AnimatePresence mode="wait">
            {isLoggedIn && user ? (
              <motion.div
                key="user"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="user-menu-premium"
              >
                <div className="user-info">
                  <div className="avatar">
                    {user.username?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <span className="username">ID_{user.username?.toUpperCase() || 'ANON'}</span>
                </div>
                <button onClick={handleLogout} className="btn-icon">
                  <LogOut size={20} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="auth"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="auth-actions"
              >
                <Link to="/login" className="btn-login-premium">LOGIN</Link>
                <Link to="/register" className="btn btn-primary btn-sm">JOIN</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
