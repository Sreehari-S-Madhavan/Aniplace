import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/api'
import { saveToken, saveUser } from '../services/auth'
import './Auth.css'

/**
 * Register Page Component
 * 
 * Allows new users to create an account.
 * 
 * How it works:
 * 1. User enters email, password, and username
 * 2. Validates input (client-side)
 * 3. On submit, calls API to register
 * 4. If successful, saves token and user data
 * 5. Redirects to home page
 */
function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
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

    // Client-side validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (formData.username.length < 3 || formData.username.length > 20) {
      setError('Username must be between 3 and 20 characters')
      setLoading(false)
      return
    }

    try {
      // Call register API
      const response = await register(formData)

      // Save token and user data
      saveToken(response.token)
      saveUser(response.user)

      // Redirect to home page
      navigate('/')
    } catch (err) {
      // Show error message
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join AniHub and start tracking your anime!</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Choose a username"
              minLength={3}
              maxLength={20}
            />
            <small>3-20 characters</small>
          </div>

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
              placeholder="At least 6 characters"
              minLength={6}
            />
            <small>Minimum 6 characters</small>
          </div>

          <button 
            type="submit" 
            className="btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
