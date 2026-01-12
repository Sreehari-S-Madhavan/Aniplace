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
      <div className="anime-detail-container">
        {/* Back button */}
        <Link to="/browse" className="back-link">← Back to Browse</Link>

        <div className="anime-detail-content">
          {/* Main info */}
          <div className="anime-header">
            <div className="anime-image-container">
              <img
                src={anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}
                alt={anime.title}
                className="anime-detail-image"
              />
            </div>

            <div className="anime-info">
              <h1 className="anime-title">{anime.title}</h1>
              {anime.title_japanese && (
                <h2 className="anime-title-japanese">{anime.title_japanese}</h2>
              )}

              <div className="anime-meta">
                <span className="anime-score">⭐ {anime.score || 'N/A'}</span>
                <span className="anime-type">{anime.type}</span>
                <span className="anime-status">{anime.status}</span>
                <span className="anime-year">{anime.year || 'TBA'}</span>
              </div>

              <div className="anime-genres">
                {anime.genres?.map(genre => (
                  <span key={genre.mal_id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Add to Tracker section */}
              <div className="tracker-section">
                {trackerStatus ? (
                  <div className="tracker-success">
                    ✅ Added to tracker as "{trackerStatus}"
                    <Link to="/tracker" className="view-tracker-link">View in Tracker</Link>
                  </div>
                ) : (
                  <div className="tracker-buttons">
                    <p>Add to your tracker:</p>
                    <div className="status-buttons">
                      <button
                        onClick={() => handleAddToTracker('watching')}
                        disabled={trackerLoading}
                        className="status-btn watching"
                      >
                        Watching
                      </button>
                      <button
                        onClick={() => handleAddToTracker('plan-to-watch')}
                        disabled={trackerLoading}
                        className="status-btn plan-to-watch"
                      >
                        Plan to Watch
                      </button>
                      <button
                        onClick={() => handleAddToTracker('completed')}
                        disabled={trackerLoading}
                        className="status-btn completed"
                      >
                        Completed
                      </button>
                    </div>
                  </div>
                )}

                {trackerError && (
                  <div className="tracker-error">
                    {trackerError}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="anime-synopsis">
            <h3>Synopsis</h3>
            <p>{anime.synopsis || 'No synopsis available.'}</p>
          </div>

          {/* Additional details */}
          <div className="anime-details-grid">
            <div className="detail-item">
              <strong>Episodes:</strong> {anime.episodes || 'Unknown'}
            </div>
            <div className="detail-item">
              <strong>Duration:</strong> {anime.duration || 'Unknown'}
            </div>
            <div className="detail-item">
              <strong>Rating:</strong> {anime.rating || 'Unknown'}
            </div>
            <div className="detail-item">
              <strong>Rank:</strong> #{anime.rank || 'N/A'}
            </div>
            <div className="detail-item">
              <strong>Popularity:</strong> #{anime.popularity || 'N/A'}
            </div>
            <div className="detail-item">
              <strong>Members:</strong> {anime.members?.toLocaleString() || 'N/A'}
            </div>
          </div>

          {/* Studios */}
          {anime.studios?.length > 0 && (
            <div className="anime-studios">
              <h3>Studios</h3>
              <div className="studios-list">
                {anime.studios.map(studio => (
                  <span key={studio.mal_id} className="studio-tag">
                    {studio.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnimeDetail