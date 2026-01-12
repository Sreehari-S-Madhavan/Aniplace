import { useState } from 'react'
import { searchAnime, getPlatforms } from '../services/api'
import './WhereToWatch.css'

/**
 * Where to Watch Page Component
 *
 * Shows legal streaming platforms for anime.
 * Users can search for anime and see available platforms.
 */
function WhereToWatch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedAnime, setSelectedAnime] = useState(null)
  const [platforms, setPlatforms] = useState([])
  const [loading, setLoading] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!searchQuery.trim()) {
      alert('Please enter an anime name to search')
      return
    }

    try {
      setSearching(true)
      setError(null)
      setSelectedAnime(null)
      setPlatforms([])

      const response = await searchAnime(searchQuery.trim(), 10)
      setSearchResults(response.data || [])
    } catch (err) {
      setError('Failed to search anime. Please try again.')
      console.error('Error searching anime:', err)
    } finally {
      setSearching(false)
    }
  }

  const handleAnimeSelect = async (anime) => {
    try {
      setLoading(true)
      setError(null)
      setSelectedAnime(anime)

      // Get platforms for this anime
      const platformResponse = await getPlatforms(anime.mal_id)
      setPlatforms(platformResponse.platforms || [])

      // Clear search results
      setSearchResults([])
      setSearchQuery('')
    } catch (err) {
      setError('Failed to load platform information. Please try again.')
      console.error('Error loading platforms:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'available'
      case 'upcoming':
        return 'upcoming'
      case 'expired':
        return 'expired'
      default:
        return 'available'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'available':
        return 'Avg. Availability'
      case 'upcoming':
        return 'Coming Soon'
      case 'expired':
        return 'No Longer Available'
      default:
        return 'Available'
    }
  }

  return (
    <div className="where-to-watch-page">
      <div className="where-to-watch-container">
        <h1>Where to Watch</h1>
        <p className="subtitle">Find legal streaming platforms for your favorite anime</p>

        {/* Search Section */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for anime (e.g., Naruto, One Piece, Attack on Titan)..."
              className="search-input"
              disabled={searching}
            />
            <button
              type="submit"
              className="search-button"
              disabled={searching || !searchQuery.trim()}
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="search-results-container">
              <h3>Select an anime:</h3>
              <div className="search-results-list">
                {searchResults.map(anime => (
                  <button
                    key={anime.mal_id}
                    onClick={() => handleAnimeSelect(anime)}
                    className="search-result-item"
                  >
                    <div className="search-result-content">
                      <img
                        src={anime.images?.jpg?.small_image_url}
                        alt=""
                        className="search-result-thumb"
                      />
                      <div className="search-result-info">
                        <strong>{anime.title}</strong>
                        {anime.title !== anime.title_english && anime.title_english && (
                          <span className="search-result-sub">{anime.title_english}</span>
                        )}
                        <span className="search-result-meta">
                          {anime.type} • {anime.episodes ? `${anime.episodes} eps` : 'Ongoing'} • Score: {anime.score || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && <div className="error">{error}</div>}

        {/* Loading State */}
        {loading && <div className="loading">Checking streaming availability...</div>}

        {/* Results Section */}
        {selectedAnime && !loading && (
          <div className="results-section">
            <div className="anime-header-card">
              <img
                src={selectedAnime.images?.jpg?.image_url || '/placeholder-anime.jpg'}
                alt={selectedAnime.title}
                className="anime-poster-large"
              />
              <div className="anime-details-large">
                <h2>{selectedAnime.title}</h2>
                <div className="anime-meta-tags">
                  <span className="tag">{selectedAnime.type}</span>
                  <span className="tag">{selectedAnime.status}</span>
                  <span className="tag star">★ {selectedAnime.score || 'N/A'}</span>
                </div>
                {selectedAnime.synopsis && (
                  <p className="anime-synopsis">
                    {selectedAnime.synopsis.length > 300
                      ? `${selectedAnime.synopsis.substring(0, 300)}...`
                      : selectedAnime.synopsis}
                  </p>
                )}
              </div>
            </div>

            <div className="platforms-section">
              <h3>Available Platforms</h3>

              {platforms.length > 0 ? (
                <div className="platforms-grid">
                  {platforms.map(platform => (
                    <a
                      key={platform.id}
                      href={platform.direct_url || platform.website_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="platform-card"
                    >
                      <div className="platform-icon">
                        {/* Placeholder for platform icon/logo */}
                        {platform.display_name.charAt(0)}
                      </div>
                      <div className="platform-info">
                        <div className="platform-name">{platform.display_name}</div>
                        <div className={`platform-status ${getStatusColor(platform.availability_status)}`}>
                          {getStatusText(platform.availability_status)}
                        </div>
                        {platform.region && <div className="platform-region">{platform.region} Region</div>}
                      </div>
                      <div className="platform-arrow">→</div>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="no-platforms">
                  <p>We couldn't find specific streaming links in our database for this anime.</p>
                </div>
              )}

              {/* Fallback Search Options */}
              <div className="fallback-search">
                <h4>Search elsewhere:</h4>
                <div className="fallback-buttons">
                  <a
                    href={`https://www.google.com/search?q=watch+${encodeURIComponent(selectedAnime.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fallback-btn google"
                  >
                    Google Search
                  </a>
                  <a
                    href={`https://www.justwatch.com/us/search?q=${encodeURIComponent(selectedAnime.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fallback-btn justwatch"
                  >
                    Check JustWatch
                  </a>
                  <a
                    href={`https://www.crunchyroll.com/search?q=${encodeURIComponent(selectedAnime.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fallback-btn crunchyroll"
                  >
                    Search Crunchyroll
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WhereToWatch
