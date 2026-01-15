import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, TrendingUp } from 'lucide-react'
import { searchAnime, getGenreList } from '../services/api'
import './Browse.css'

function Browse() {
  const [animeList, setAnimeList] = useState([])
  const [genres, setGenres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      const [animeRes, genreRes] = await Promise.all([
        searchAnime(''),
        getGenreList()
      ])
      setAnimeList(animeRes.data || [])
      setGenres(genreRes.data || [])
    } catch (err) {
      setError('Neural data link failed. Frequency lost.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await searchAnime(searchQuery)
      setAnimeList(response.data || [])
    } catch (err) {
      setError('Search protocol failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="browse-page">
      <div className="page-header holographic">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="brand-tag">GLOBAL_LIBRARY</div>
            <h1>Neural Repository</h1>
            <p className="status-readout">DATA_NODES: {animeList.length}+ // STATUS_CLEAR</p>
          </motion.div>

          <form onSubmit={handleSearch} className="search-box-premium">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="SCAN_FOR_LEGENDS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">SEARCH</button>
          </form>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '8rem' }}>
        {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-message cyber-alert">{error}</motion.div>}

        {loading ? (
          <div className="discovery-loader">SCANNING_THE_COSMOS...</div>
        ) : (
          <motion.div
            layout
            className="anime-grid"
          >
            <AnimatePresence mode="popLayout">
              {animeList.map((anime, i) => (
                <motion.div
                  layout
                  key={anime.mal_id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.02, type: 'spring', stiffness: 200, damping: 20 }}
                  className="anime-card holo-panel"
                >
                  <Link to={`/anime/${anime.mal_id}`} style={{ textDecoration: 'none' }}>
                    <div className="holo-card-img">
                      <img src={anime.images.jpg.image_url} alt={anime.title} />
                      <div className="holo-scan"></div>
                      <div className="score-tag">
                        <TrendingUp size={10} /> {anime.score || '??'}
                      </div>
                    </div>
                    <div className="holo-card-content">
                      <h3 className="anime-title-holo">{anime.title}</h3>
                      <div className="anime-meta">
                        <span>{anime.type}</span>
                        <span>{anime.episodes ? `${anime.episodes} EPS` : 'ONGOING'}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && animeList.length === 0 && (
          <div className="empty-state">
            <p className="status-readout">NO_NEURAL_MATCH_FOUND_FOR: {searchQuery.toUpperCase()}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Browse
