import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getUserProfile } from '../services/api'
import './Profile.css'

/**
 * Profile Page Component
 * Professional user dashboard architecture.
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
      setError('Identity verification failed. Please login.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="page-header"><div className="container"><h1>Authorized Access Required...</h1></div></div>

  if (error) {
    return (
      <div className="profile-page">
        <div className="page-header">
          <div className="container">
            <h1>Access Denied</h1>
            <p style={{ color: 'var(--primary)', marginBottom: '2rem' }}>{error}</p>
            <Link to="/login" className="btn btn-primary">Sign In</Link>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return null
  const { user, stats } = profile

  return (
    <div className="profile-page">
      <div className="page-header">
        <div className="container">
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <div style={{ width: '100px', height: '100px', background: 'var(--primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 800, color: 'white' }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{user.username}</h1>
              <p style={{ color: 'var(--grey-text)', fontSize: '1.1rem' }}>Joined the hub on {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '8rem' }}>
        <div className="profile-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1px', background: 'var(--grey-border)', borderRadius: '4px', overflow: 'hidden' }}>
          {[
            { label: 'Total Library', value: stats.total_anime },
            { label: 'Completed', value: stats.completed },
            { label: 'Currently Watching', value: stats.watching },
            { label: 'Plan to Watch', value: stats.plan_to_watch },
            { label: 'Mean Score', value: stats.mean_score || '0.0' }
          ].map((stat, idx) => (
            <div key={idx} style={{ background: 'var(--surface)', padding: '2.5rem 2rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--grey-text)', marginBottom: '1rem' }}>{stat.label}</p>
              <p style={{ fontSize: '2.5rem', fontWeight: 800, color: idx === 4 ? 'var(--primary)' : 'white' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '4rem', display: 'flex', gap: '1.5rem' }}>
          <Link to="/tracker" className="btn btn-primary" style={{ padding: '1rem 3rem' }}>MANAGE LIBRARY</Link>
          <Link to="/discussions" className="btn btn-secondary" style={{ padding: '1rem 3rem' }}>COMMUNITY ENGAGEMENT</Link>
        </div>
      </div>
    </div>
  )
}

export default Profile
