import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Plus, ArrowBigUp, ArrowBigDown, Info } from 'lucide-react'
import { getDiscussions, createDiscussion, voteDiscussion, getDiscussionComments, createDiscussionComment, deleteDiscussionComment } from '../services/api'
import './Discussions.css'

function Discussions() {
  const [discussions, setDiscussions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '', content: '', animeId: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [comments, setComments] = useState({})
  const [commentForms, setCommentForms] = useState({})
  const [showComments, setShowComments] = useState({})

  useEffect(() => {
    loadDiscussions()
  }, [])

  const loadDiscussions = async () => {
    try {
      setLoading(true)
      const response = await getDiscussions()
      setDiscussions(response.discussions || [])
    } catch (err) {
      setError('Neural transmission failed. Link unstable.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.content.trim()) return
    try {
      setSubmitting(true)
      await createDiscussion({
        title: formData.title.trim(),
        content: formData.content.trim(),
        animeId: formData.animeId ? parseInt(formData.animeId) : null
      })
      setFormData({ title: '', content: '', animeId: '' })
      setShowCreateForm(false)
      loadDiscussions()
    } catch (err) {
      alert('Upload failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleVote = async (discussionId, voteType) => {
    try {
      const response = await voteDiscussion(discussionId, voteType)
      setDiscussions(prev => prev.map(disc =>
        disc.id === discussionId ? { ...disc, ...response.discussion } : disc
      ))
    } catch (err) {
      console.error('Vote failed')
    }
  }

  const toggleComments = async (discussionId) => {
    const currentlyShown = showComments[discussionId]
    setShowComments(prev => ({ ...prev, [discussionId]: !currentlyShown }))
    if (!currentlyShown && !comments[discussionId]) {
      const resp = await getDiscussionComments(discussionId)
      setComments(prev => ({ ...prev, [discussionId]: resp.comments || [] }))
    }
  }

  if (loading) return (
    <div className="discussions-page">
      <div className="discovery-loader">GATHERING_NEURAL_SAMPLES...</div>
    </div>
  )

  return (
    <div className="discussions-page">
      <div className="page-header holographic">
        <div className="container">
          <div className="header-flex">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="brand-tag">NEURAL_NETWORK</div>
              <h1>Community Gathering</h1>
              <p className="status-readout">ACTIVE_PILOTS: {discussions.length} // HUB_STABLE</p>
            </motion.div>
            <button className="btn btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? 'EXIT_PROTO-FORM' : <><Plus size={18} /> NEW_THREAD</>}
            </button>
          </div>
        </div>
      </div>

      <div className="container main-layout">
        <div className="discussions-feed">
          <AnimatePresence mode="wait">
            {showCreateForm ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="create-form-glass"
              >
                <form onSubmit={handleSubmit}>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="TOPIC_ID"
                    required
                  />
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="TRANSMISSION_DETAILS"
                    required
                  />
                  <button type="submit" className="btn btn-primary" disabled={submitting}>INITIATE_BROADCAST</button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="list" className="thread-list">
                {discussions.map((disc, i) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={disc.id}
                    className="thread-card holo-panel"
                  >
                    <div className="thread-header">
                      <div className="avatar">{(disc.username || 'A')[0].toUpperCase()}</div>
                      <div className="thread-meta">
                        <h3>{disc.title}</h3>
                        <span className="user-id">ID_{disc.username?.toUpperCase()}</span>
                      </div>
                    </div>
                    <p className="thread-content">{disc.content}</p>
                    <div className="thread-footer">
                      <div className="vote-group">
                        <button onClick={() => handleVote(disc.id, 'agree')} className="vote-btn agree">
                          <ArrowBigUp size={20} /> {disc.agree_count}
                        </button>
                        <button onClick={() => handleVote(disc.id, 'disagree')} className="vote-btn disagree">
                          <ArrowBigDown size={20} /> {disc.disagree_count}
                        </button>
                      </div>
                      <button onClick={() => toggleComments(disc.id)} className="comment-toggle">
                        <MessageSquare size={16} />
                        {showComments[disc.id] ? 'COLLAPSE' : `COMMENTS (${comments[disc.id]?.length || 0})`}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="sidebar">
          <div className="sidebar-card glass">
            <div className="card-header">
              <Info size={16} />
              <span>PROTOCOL</span>
            </div>
            <p>Respect the neural network. Use spoilers for late-series theories. Maintain sanctuary serenity.</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default Discussions
