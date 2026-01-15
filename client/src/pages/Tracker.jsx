import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, TrendingUp, Play, CheckCircle } from 'lucide-react'
import { getTrackerList, updateTrackerItem, removeFromTracker } from '../services/api'
import { getUser } from '../services/auth'
import './Tracker.css'

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

  const loadTracker = async () => {
    try {
      setLoading(true)
      const response = await getTrackerList()
      setTrackerItems(response.data || [])
      await loadAnimeDetails(response.data || [])
    } catch (err) {
      setError('Neural link unstable. Calibration failed.')
    } finally {
      setLoading(false)
    }
  }

  const loadAnimeDetails = async (items) => {
    const details = {}
    const { getAnimeDetails } = await import('../services/api')

    // Process in batches for better performance
    const promises = items.map(async (item) => {
      try {
        const anime = await getAnimeDetails(item.anime_id)
        details[item.anime_id] = anime
      } catch (err) {
        details[item.anime_id] = {
          title: `SYNC_ERR_${item.anime_id}`,
          images: { jpg: { image_url: '/placeholder.jpg' } }
        }
      }
    })
    await Promise.all(promises)
    setAnimeDetails(details)
  }

  const filterItems = () => {
    if (filter === 'all') {
      setFilteredItems(trackerItems)
    } else {
      setFilteredItems(trackerItems.filter(item => item.status === filter))
    }
  }

  const updateStatus = async (trackerId, newStatus) => {
    try {
      setUpdating(trackerId)
      await updateTrackerItem(trackerId, { status: newStatus })
      await loadTracker()
    } catch (err) {
      setError('Status rewrite failed.')
    } finally {
      setUpdating(null)
    }
  }

  const updateProgress = async (trackerId, newProgress) => {
    try {
      setUpdating(trackerId)
      await updateTrackerItem(trackerId, { progress: parseInt(newProgress) || 0 })
      await loadTracker()
    } catch (err) {
      setError('Progress sync failed.')
    } finally {
      setUpdating(null)
    }
  }

  const handleRemove = async (trackerId) => {
    if (!window.confirm('Terminate this neural link?')) return
    try {
      setUpdating(trackerId)
      await removeFromTracker(trackerId)
      await loadTracker()
    } catch (err) {
      setError('Link termination failed.')
    } finally {
      setUpdating(null)
    }
  }

  const formatStatus = (status) => {
    return status.split('-').map(word => word.toUpperCase()).join('_')
  }

  if (loading) {
    return (
      <div className="tracker-page">
        <div className="discovery-loader">CALIBRATING_SANCTUARY...</div>
      </div>
    )
  }

  return (
    <div className="tracker-page">
      <div className="page-header holographic">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="brand-tag">PERSONAL_SANCTUARY</div>
            <h1>Neural Repository</h1>
            <p className="status-readout">DATA_SYNCED: {trackerItems.length} ENTRIES // SYSTEM_STABLE</p>
          </motion.div>

          <div className="tabs-nav cyber-tabs">
            {['all', 'watching', 'completed', 'plan-to-watch'].map((f) => (
              <button
                key={f}
                className={`tab-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {formatStatus(f)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '8rem', position: 'relative', zIndex: 1 }}>
        {error && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-message cyber-alert">{error}</motion.div>}

        <motion.div
          layout
          className="tracker-grid"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="empty-state glass hologram"
              >
                <div className="empty-icon"><ShieldCheck size={48} /></div>
                <p>REPOSITORY EMPTY. INITIATE DISCOVERY PROTOCOL?</p>
                <Link to="/browse" className="btn btn-primary">START_DISCOVERY</Link>
              </motion.div>
            ) : (
              filteredItems.map((item, index) => {
                const anime = animeDetails[item.anime_id]
                return (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    className="tracker-card holo-panel"
                  >
                    <div className="holo-card-img">
                      <img src={anime?.images?.jpg?.image_url || '/placeholder.jpg'} alt="" />
                      <div className="holo-scan"></div>
                      <div className={`status-tag ${item.status}`}>
                        {formatStatus(item.status)}
                      </div>
                    </div>

                    <div className="holo-card-content">
                      <Link to={`/anime/${item.anime_id}`} className="anime-title-holo">
                        {anime?.title || 'SYNCING...'}
                      </Link>

                      <div className="holo-progress">
                        <div className="progress-label">
                          <TrendingUp size={14} />
                          <span>SYNC_PROGRESS</span>
                        </div>
                        <div className="progress-input-group">
                          <input
                            type="number"
                            value={item.progress || 0}
                            onChange={(e) => updateProgress(item.id, e.target.value)}
                            disabled={updating === item.id}
                          />
                          <span className="unit">EP</span>
                        </div>
                      </div>

                      <div className="holo-actions">
                        <select
                          value={item.status}
                          onChange={(e) => updateStatus(item.id, e.target.value)}
                          disabled={updating === item.id}
                        >
                          <option value="watching">WATCHING</option>
                          <option value="completed">COMPLETED</option>
                          <option value="on-hold">ON_HOLD</option>
                          <option value="dropped">DROPPED</option>
                          <option value="plan-to-watch">PLAN_TO_WATCH</option>
                        </select>
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="btn-link-remove"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default Tracker
