import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUserProfile } from '../services/api'
import './Profile.css'

/**
 * Profile Page Component
 * 
 * Displays user information and watching statistics.
 */
function Profile() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const data = await getUserProfile()
      setProfile(data)
    } catch (err) {
      console.error('Failed to load profile:', err)
      setError('Failed to load profile. Please make sure you are logged in.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="profile-loading">Loading profile...</div>

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-container error-container">
          <h1>Profile Error</h1>
          <p>{error}</p>
          <Link to="/login" className="login-link">Go to Login</Link>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const { user, stats } = profile

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* User Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{user.username}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-joined">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="profile-stats-section">
          <h2>Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{stats.total_anime}</span>
              <span className="stat-label">Total Anime</span>
            </div>
            <div className="stat-card completed">
              <span className="stat-value">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-card watching">
              <span className="stat-value">{stats.watching}</span>
              <span className="stat-label">Watching</span>
            </div>
            <div className="stat-card plan">
              <span className="stat-value">{stats.plan_to_watch}</span>
              <span className="stat-label">Plan to Watch</span>
            </div>
            <div className="stat-card score">
              <span className="stat-value">{stats.mean_score}</span>
              <span className="stat-label">Mean Score</span>
            </div>
          </div>
        </div>

        {/* Activity/Links Section */}
        <div className="profile-links">
          <Link to="/tracker" className="profile-link-btn primary">
            View My List
          </Link>
          <Link to="/discussions" className="profile-link-btn secondary">
            Join Discussions
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Profile
