import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTrackerList, updateTrackerItem } from '../services/api'
import { getUser } from '../services/auth'
import './Tracker.css'

/**
 * Tracker Page Component
 *
 * Personal tracking page for logged-in users.
 * Shows what they're watching, completed, on-hold, etc.
 *
 * Features:
 * - List of tracked anime/manga with details from Jikan API
 * - Filter by status (watching, completed, on-hold, etc.)
 * - Update progress and status
 * - Remove items from tracker
 */
function Tracker() {
  const [trackerItems, setTrackerItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [animeDetails, setAnimeDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    loadTracker()
  }, [])

  useEffect(() => {
    filterItems()
  }, [trackerItems, filter])

  /**
   * Load user's tracker list
   */
  const loadTracker = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await getTrackerList()
      setTrackerItems(response.data || [])

      // Load anime details for each tracked item
      await loadAnimeDetails(response.data || [])
    } catch (err) {
      setError('Failed to load tracker. Please try again.')
      console.error('Error loading tracker:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Load anime details from Jikan API for tracker items
   */
  const loadAnimeDetails = async (items) => {
    const details = {}

    for (const item of items) {
      try {
        // Import getAnimeDetails dynamically to avoid circular imports
        const { getAnimeDetails } = await import('../services/api')
        const anime = await getAnimeDetails(item.anime_id)
        details[item.anime_id] = anime
      } catch (err) {
        console.error(`Failed to load details for anime ${item.anime_id}:`, err)
        // Set placeholder data
        details[item.anime_id] = {
          title: `Anime ${item.anime_id}`,
          images: { jpg: { image_url: '/placeholder.jpg' } },
          score: null,
          type: 'Unknown'
        }
      }
    }

    setAnimeDetails(details)
  }

  /**
   * Filter items based on selected status
   */
  const filterItems = () => {
    if (filter === 'all') {
      setFilteredItems(trackerItems)
    } else {
      setFilteredItems(trackerItems.filter(item => item.status === filter))
    }
  }

  /**
   * Update tracker item status
   */
  const updateStatus = async (trackerId, newStatus) => {
    try {
      setUpdating(trackerId)
      await updateTrackerItem(trackerId, { status: newStatus })
      await loadTracker() // Reload to get updated data
    } catch (err) {
      setError('Failed to update status. Please try again.')
      console.error('Error updating status:', err)
    } finally {
      setUpdating(null)
    }
  }

  /**
   * Update progress
   */
  const updateProgress = async (trackerId, newProgress) => {
    try {
      setUpdating(trackerId)
      await updateTrackerItem(trackerId, { progress: parseInt(newProgress) || 0 })
      await loadTracker()
    } catch (err) {
      setError('Failed to update progress. Please try again.')
      console.error('Error updating progress:', err)
    } finally {
      setUpdating(null)
    }
  }

  /**
   * Get status color class
   */
  const getStatusClass = (status) => {
    const classes = {
      'watching': 'status-watching',
      'completed': 'status-completed',
      'on-hold': 'status-on-hold',
      'dropped': 'status-dropped',
      'plan-to-watch': 'status-plan-to-watch'
    }
    return classes[status] || 'status-default'
  }

  /**
   * Format status for display
   */
  const formatStatus = (status) => {
    return status.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  if (loading) {
    return (
      <div className="tracker-page">
        <div className="tracker-container">
          <h1>My Tracker</h1>
          <div className="loading">Loading your tracker...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="tracker-page">
      <div className="tracker-container">
        <h1>My Tracker</h1>

        {error && (
          <div className="error-message">{error}</div>
        )}

        {/* Filter buttons */}
        <div className="tracker-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({trackerItems.length})
          </button>
          <button
            className={`filter-btn ${filter === 'watching' ? 'active' : ''}`}
            onClick={() => setFilter('watching')}
          >
            Watching ({trackerItems.filter(i => i.status === 'watching').length})
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({trackerItems.filter(i => i.status === 'completed').length})
          </button>
          <button
            className={`filter-btn ${filter === 'plan-to-watch' ? 'active' : ''}`}
            onClick={() => setFilter('plan-to-watch')}
          >
            Plan to Watch ({trackerItems.filter(i => i.status === 'plan-to-watch').length})
          </button>
        </div>

        {/* Tracker items */}
        <div className="tracker-items">
          {filteredItems.length === 0 ? (
            <div className="empty-tracker">
              <p>No anime in your tracker {filter !== 'all' ? `with status "${formatStatus(filter)}"` : ''}.</p>
              <Link to="/browse" className="browse-link">Browse Anime</Link>
            </div>
          ) : (
            filteredItems.map((item) => {
              const anime = animeDetails[item.anime_id]
              return (
                <div key={item.id} className="tracker-item">
                  <div className="tracker-item-content">
                    {/* Anime image and basic info */}
                    <div className="tracker-anime-info">
                      <Link to={`/anime/${item.anime_id}`} className="tracker-anime-link">
                        <img
                          src={anime?.images?.jpg?.image_url || '/placeholder.jpg'}
                          alt={anime?.title || 'Loading...'}
                          className="tracker-anime-image"
                        />
                      </Link>
                      <div className="tracker-anime-details">
                        <Link to={`/anime/${item.anime_id}`} className="tracker-anime-title">
                          {anime?.title || 'Loading...'}
                        </Link>
                        <p className="tracker-anime-meta">
                          ⭐ {anime?.score || 'N/A'} • {anime?.type || 'Unknown'}
                        </p>
                      </div>
                    </div>

                    {/* Status and progress */}
                    <div className="tracker-controls">
                      <div className="status-section">
                        <label>Status:</label>
                        <select
                          value={item.status}
                          onChange={(e) => updateStatus(item.id, e.target.value)}
                          disabled={updating === item.id}
                          className="status-select"
                        >
                          <option value="watching">Watching</option>
                          <option value="completed">Completed</option>
                          <option value="on-hold">On Hold</option>
                          <option value="dropped">Dropped</option>
                          <option value="plan-to-watch">Plan to Watch</option>
                        </select>
                      </div>

                      <div className="progress-section">
                        <label>Progress:</label>
                        <input
                          type="number"
                          min="0"
                          value={item.progress || 0}
                          onChange={(e) => updateProgress(item.id, e.target.value)}
                          disabled={updating === item.id}
                          className="progress-input"
                        />
                        <span>episodes</span>
                      </div>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className={`status-badge ${getStatusClass(item.status)}`}>
                    {formatStatus(item.status)}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

export default Tracker
