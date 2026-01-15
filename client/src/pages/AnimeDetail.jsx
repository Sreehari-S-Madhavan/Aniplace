import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getAnimeDetails, addToTracker } from '../services/api'
import { isAuthenticated } from '../services/auth'
import './AnimeDetail.css'

/**
 * Anime Detail Page Component
 *
 * Shows detailed information about a specific anime.
 *
 * Features:
 * - Full anime details from Jikan API
 * - Add to tracker button
 * - Genres, synopsis, ratings
 * - Streaming platforms
 */
function AnimeDetail() {
  const { id } = useParams()
  const [anime, setAnime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [trackerStatus, setTrackerStatus] = useState('')
  const [trackerLoading, setTrackerLoading] = useState(false)
  const [trackerError, setTrackerError] = useState('')

  useEffect(() => {
    loadAnimeDetails()
  }, [id])

  /**
   * Load anime details from Jikan API
   */
  const loadAnimeDetails = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getAnimeDetails(id)
      setAnime(data)
    } catch (err) {
      setError('Failed to load anime details. Please try again.')
      console.error('Error loading anime details:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle adding anime to tracker
   */
  const handleAddToTracker = async (status) => {
    if (!isAuthenticated()) {
      setTrackerError('Please login to add anime to your tracker')
      return
    }

    try {
      setTrackerLoading(true)
      setTrackerError('')

      await addToTracker({
        animeId: parseInt(id),
        status: status,
        progress: 0
      })

      setTrackerStatus(status)
      setTrackerError('')
    } catch (err) {
      setTrackerError(err.message || 'Failed to add to tracker')
      console.error('Error adding to tracker:', err)
    } finally {
      setTrackerLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="anime-detail-page">
        <div className="loading">Loading anime details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="anime-detail-page">
        <div className="error-message">{error}</div>
        <Link to="/browse" className="back-link">← Back to Browse</Link>
      </div>
    )
  }

  if (!anime) {
    return (
      <div className="anime-detail-page">
        <div className="error-message">Anime not found.</div>
        <Link to="/browse" className="back-link">← Back to Browse</Link>
      </div>
    )
  }

  return (
    <div className="anime-detail-page">
      {/* Cinematic Banner Background */}
      <div className="anime-banner" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '60vh', zIndex: 0, overflow: 'hidden' }}>
        <img
          src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(60px) brightness(0.3)', opacity: 0.6 }}
        />
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, var(--background) 0%, transparent 100%)' }}></div>
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '10rem', paddingBottom: '8rem' }}>
        <Link to="/browse" className="back-link" style={{ color: 'var(--grey-text)', marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Browse
        </Link>

        <div className="anime-detail-content" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '4rem', alignItems: 'start' }}>
          {/* Main info */}
          <div className="anime-sidebar">
            <div className="ani-card" style={{ cursor: 'default', transform: 'none' }}>
              <img
                src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                alt={anime.title}
                className="ani-card-img"
              />
            </div>

            <div className="tracker-box" style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--surface)', border: '1px solid var(--grey-border)', borderRadius: '4px' }}>
              <h4 style={{ marginBottom: '1rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Set Progress</h4>
              {trackerStatus ? (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{trackerStatus.toUpperCase()}</span>
                  </div>
                  <Link to="/tracker" className="btn btn-secondary" style={{ width: '100%', fontSize: '0.9rem' }}>View Tracker</Link>
                </div>
              ) : (
                <div className="status-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button onClick={() => handleAddToTracker('watching')} disabled={trackerLoading} className="btn btn-primary" style={{ fontSize: '0.9rem' }}>Watching</button>
                  <button onClick={() => handleAddToTracker('plan-to-watch')} disabled={trackerLoading} className="btn btn-secondary" style={{ fontSize: '0.9rem' }}>Plan to Watch</button>
                  <button onClick={() => handleAddToTracker('completed')} disabled={trackerLoading} className="btn btn-secondary" style={{ fontSize: '0.9rem' }}>Completed</button>
                </div>
              )}
              {trackerError && <p style={{ color: 'var(--primary)', fontSize: '0.8rem', marginTop: '1rem' }}>{trackerError}</p>}
            </div>
          </div>

          <div className="anime-main-info">
            <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>{anime.title}</h1>
            {anime.title_japanese && (
              <h2 style={{ fontSize: '1.5rem', color: 'var(--grey-text)', marginBottom: '2rem', fontWeight: 400 }}>{anime.title_japanese}</h2>
            )}

            <div className="anime-meta" style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', fontSize: '1.1rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 700 }}>SCORE {anime.score || 'N/A'}</span>
              <span>{anime.year || 'TBA'}</span>
              <span>{anime.type}</span>
              <span>{anime.episodes ? `${anime.episodes} eps` : 'Ongoing'}</span>
            </div>

            <div className="anime-genres" style={{ display: 'flex', gap: '0.5rem', marginBottom: '3rem' }}>
              {anime.genres?.map(genre => (
                <span key={genre.mal_id} style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--grey-border)', borderRadius: '2px', fontSize: '0.8rem' }}>
                  {genre.name}
                </span>
              ))}
            </div>

            <div className="anime-synopsis" style={{ marginBottom: '4rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--grey-border)', paddingBottom: '0.5rem' }}>Synopsis</h3>
              <p style={{ color: '#e5e5e5', lineHeight: '1.6', fontSize: '1.1rem' }}>{anime.synopsis || 'No synopsis available.'}</p>
            </div>

            <div className="anime-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
              <div style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '1rem' }}>
                <p style={{ color: 'var(--grey-text)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Rank</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>#{anime.rank || 'N/A'}</p>
              </div>
              <div style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '1rem' }}>
                <p style={{ color: 'var(--grey-text)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Popularity</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>#{anime.popularity || 'N/A'}</p>
              </div>
              <div style={{ borderLeft: '2px solid var(--primary)', paddingLeft: '1rem' }}>
                <p style={{ color: 'var(--grey-text)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Rating</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{anime.rating || 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default AnimeDetail