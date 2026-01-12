import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/api'
import { saveToken, saveUser } from '../services/auth'
import './Auth.css'

/**
 * Login Page Component
 * 
 * Allows users to log in to their account.
 * 
 * How it works:
 * 1. User enters email and password
 * 2. On submit, calls API to login
 * 3. If successful, saves token and user data
 * 4. Redirects to home page
 */
function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user types
    if (error) setError('')
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Call login API
      const response = await login(formData)

      // Save token and user data
      saveToken(response.token)
      saveUser(response.user)

      // Redirect to home page
      navigate('/')
    } catch (err) {
      // Show error message
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Login to AniHub</h1>
        <p className="auth-subtitle">Welcome back! Please login to your account.</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
