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
        return 'Available Now'
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
            <div style={{ marginTop: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Select an anime:</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {searchResults.map(anime => (
                  <button
                    key={anime.mal_id}
                    onClick={() => handleAnimeSelect(anime)}
                    style={{
                      padding: '0.75rem',
                      background: '#f8f9fa',
                      border: '1px solid #e1e8ed',
                      borderRadius: '6px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#ecf0f1'}
                    onMouseOut={(e) => e.target.style.background = '#f8f9fa'}
                  >
                    <strong>{anime.title}</strong>
                    {anime.title !== anime.title_english && anime.title_english && (
                      <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                        ({anime.title_english})
                      </span>
                    )}
                    <br />
                    <span style={{ fontSize: '0.9rem', color: '#666' }}>
                      {anime.type} • {anime.episodes ? `${anime.episodes} episodes` : 'Ongoing'} • Score: {anime.score || 'N/A'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading">
            Loading platform information...
          </div>
        )}

        {/* Results Section */}
        {selectedAnime && !loading && (
          <div className="results-section">
            <div className="anime-result">
              <div className="anime-header">
                <img
                  src={selectedAnime.images?.jpg?.image_url || '/placeholder-anime.jpg'}
                  alt={selectedAnime.title}
                  className="anime-poster"
                  onError={(e) => {
                    e.target.src = '/placeholder-anime.jpg'
                  }}
                />
                <div className="anime-info">
                  <h3>{selectedAnime.title}</h3>
                  {selectedAnime.title !== selectedAnime.title_english && selectedAnime.title_english && (
                    <p><strong>English:</strong> {selectedAnime.title_english}</p>
                  )}
                  <p><strong>Type:</strong> {selectedAnime.type}</p>
                  <p><strong>Episodes:</strong> {selectedAnime.episodes || 'Ongoing'}</p>
                  <p><strong>Score:</strong> {selectedAnime.score || 'N/A'}</p>
                  <p><strong>Status:</strong> {selectedAnime.status}</p>
                  {selectedAnime.synopsis && (
                    <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>
                      <strong>Synopsis:</strong> {selectedAnime.synopsis.length > 300
                        ? `${selectedAnime.synopsis.substring(0, 300)}...`
                        : selectedAnime.synopsis}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
                  Available Streaming Platforms:
                </h4>

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
                        <div className="platform-name">
                          {platform.display_name}
                        </div>
                        <div className={`platform-status ${getStatusColor(platform.availability_status)}`}>
                          {getStatusText(platform.availability_status)}
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <h3>No streaming platforms found</h3>
                    <p>This anime may not be available on major streaming platforms in your region, or platform information hasn't been added yet.</p>
                    <p>You can try searching for it on individual platforms like Crunchyroll, Funimation, or HIDIVE.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Initial State */}
        {!selectedAnime && !loading && !error && searchResults.length === 0 && (
          <div className="results-section">
            <div className="no-results">
              <h3>Search for an anime to get started</h3>
              <p>Enter the name of any anime above to find out where you can legally stream it.</p>
              <p>Popular searches: Naruto, One Piece, Attack on Titan, My Hero Academia, Demon Slayer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WhereToWatch
