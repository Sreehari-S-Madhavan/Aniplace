import { useState } from 'react'
import { searchAnime, getPlatforms } from '../services/api'
import './WhereToWatch.css'

/**
 * Where to Watch Page Component
 * Official, legal destinations for streaming.
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
    if (!searchQuery.trim()) return
    try {
      setSearching(true)
      setError(null)
      setSelectedAnime(null)
      setPlatforms([])
      const response = await searchAnime(searchQuery.trim(), 10)
      setSearchResults(response.data || [])
    } catch (err) {
      setError('Discovery failed. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  const handleAnimeSelect = async (anime) => {
    try {
      setLoading(true)
      setSelectedAnime(anime)
      const platformResponse = await getPlatforms(anime.mal_id)
      setPlatforms(platformResponse.platforms || [])
      setSearchResults([])
      setSearchQuery('')
    } catch (err) {
      setError('Failed to load streaming origins.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="where-to-watch-page">
      <div className="page-header">
        <div className="container">
          <h1>Verified Origins</h1>
          <p style={{ color: 'var(--grey-text)' }}>Find legal, high-fidelity destinations for your journey.</p>

          <form onSubmit={handleSearch} style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', maxWidth: '600px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter anime title..."
              style={{ flex: 1, padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid #333', borderRadius: '4px', color: 'white' }}
              disabled={searching}
            />
            <button type="submit" className="btn btn-primary" disabled={searching}>
              {searching ? 'SCANNING...' : 'SEARCH'}
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="glass" style={{ marginTop: '1rem', padding: '1rem', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {searchResults.map(anime => (
                <button key={anime.mal_id} onClick={() => handleAnimeSelect(anime)} style={{ background: 'transparent', border: 'none', color: 'white', textAlign: 'left', padding: '8px', cursor: 'pointer', borderBottom: '1px solid #222' }}>
                  {anime.title}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container" style={{ paddingBottom: '8rem' }}>
        {loading && <div className="loading" style={{ color: 'var(--grey-text)' }}>Identifying streaming origins...</div>}
        {error && <div className="error-message" style={{ color: 'var(--primary)' }}>{error}</div>}

        {selectedAnime && !loading && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            <div className="anime-header-card glass" style={{ padding: '2rem', borderRadius: '4px', display: 'flex', gap: '2rem' }}>
              <img src={selectedAnime.images?.jpg?.image_url} alt="" style={{ width: '150px', borderRadius: '2px' }} />
              <div>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{selectedAnime.title}</h2>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--grey-text)', marginBottom: '1rem' }}>
                  <span>{selectedAnime.type}</span>
                  <span>•</span>
                  <span>★ {selectedAnime.score || 'N/A'}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: '1.5' }}>{selectedAnime.synopsis?.substring(0, 200)}...</p>
              </div>
            </div>

            <div className="providers">
              <h3 style={{ marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '1.2rem' }}>Available Streaming Services</h3>
              {platforms.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {platforms.map(platform => (
                    <div key={platform.id} style={{ background: 'var(--surface)', padding: '1.5rem', border: '1px solid var(--grey-border)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{platform.display_name}</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>OFFICIAL PROVIDER</span>
                      </div>
                      <a href={platform.direct_url || platform.website_url} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>VISIT PLATFORM</a>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '3rem', border: '1px dashed var(--grey-border)', textAlign: 'center' }}>
                  <p style={{ color: 'var(--grey-text)' }}>No specific origins found for this title.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WhereToWatch
