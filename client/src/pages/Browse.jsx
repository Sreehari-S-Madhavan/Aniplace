import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { searchAnime, getPopularAnime } from '../services/api'
import './Browse.css'

/**
 * Browse Page Component
 * 
 * Page for browsing and searching anime.
 * 
 * Features:
 * - Search bar for anime
 * - Grid of anime cards
 * - Click to view details
 * - Shows popular anime by default
 */
function Browse() {
  const [animeList, setAnimeList] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load popular anime on component mount
  useEffect(() => {
    loadPopularAnime()
  }, [])

  /**
   * Load popular anime from Jikan API
   */
  const loadPopularAnime = async () => {
    try {
      setLoading(true)
      setError('')
      const anime = await getPopularAnime()
      setAnimeList(anime)
    } catch (err) {
      setError('Failed to load anime. Please try again.')
      console.error('Error loading popular anime:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle search form submission
   */
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      loadPopularAnime() // If empty search, show popular
      return
    }

    try {
      setLoading(true)
      setError('')
      const results = await searchAnime(searchQuery)
      setAnimeList(results.data || [])
    } catch (err) {
      setError('Search failed. Please try again.')
      console.error('Error searching anime:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="browse-page">
      <div className="browse-container">
        <h1>Browse Anime</h1>
        
        {/* Search bar */}
        <form className="search-section" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search anime..." 
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>

        {/* Error message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="loading">
            Loading anime...
          </div>
        )}

        {/* Anime grid */}
        {!loading && !error && (
          <div className="anime-grid">
            {animeList.length === 0 ? (
              <p>No anime found.</p>
            ) : (
              animeList.map((anime) => (
                <Link 
                  key={anime.mal_id} 
                  to={`/anime/${anime.mal_id}`} 
                  className="anime-card"
                >
                  <div className="anime-image-container">
                    <img 
                      src={anime.images?.jpg?.image_url || '/placeholder.jpg'} 
                      alt={anime.title}
                      className="anime-image"
                    />
                  </div>
                  <div className="anime-info">
                    <h3 className="anime-title">{anime.title}</h3>
                    <p className="anime-score">
                      ⭐ {anime.score || 'N/A'}
                    </p>
                    <p className="anime-type">{anime.type}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Browse
