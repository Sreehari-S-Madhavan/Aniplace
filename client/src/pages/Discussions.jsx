import { useState, useEffect } from 'react'
import { getDiscussions, createDiscussion, voteDiscussion, getDiscussionComments, createDiscussionComment, deleteDiscussionComment } from '../services/api'
import './Discussions.css'

/**
 * Discussions Page Component
 *
 * Community discussions page.
 * Users can create posts and vote agree/disagree.
 */
function Discussions() {
  const [discussions, setDiscussions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    animeId: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [comments, setComments] = useState({}) // discussionId -> comments array
  const [commentForms, setCommentForms] = useState({}) // discussionId -> comment text
  const [showComments, setShowComments] = useState({}) // discussionId -> boolean

  // Load discussions on component mount
  useEffect(() => {
    loadDiscussions()
  }, [])

  const loadDiscussions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getDiscussions()
      setDiscussions(response.discussions || [])
    } catch (err) {
      setError('Failed to load discussions. Please try again.')
      console.error('Error loading discussions:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in both title and content')
      return
    }

    try {
      setSubmitting(true)
      const discussionData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        animeId: formData.animeId ? parseInt(formData.animeId) : null
      }

      await createDiscussion(discussionData)

      // Reset form and reload discussions
      setFormData({ title: '', content: '', animeId: '' })
      setShowCreateForm(false)
      loadDiscussions()
    } catch (err) {
      alert('Failed to create discussion. Please try again.')
      console.error('Error creating discussion:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleVote = async (discussionId, voteType) => {
    try {
      const response = await voteDiscussion(discussionId, voteType)

      // Update the discussion in the local state
      setDiscussions(prev => prev.map(disc =>
        disc.id === discussionId
          ? { ...response.discussion, userVote: response.discussion.userVote }
          : disc
      ))
    } catch (err) {
      alert('Failed to vote. Please try again.')
      console.error('Error voting:', err)
    }
  }

  const loadComments = async (discussionId) => {
    try {
      const response = await getDiscussionComments(discussionId)
      setComments(prev => ({
        ...prev,
        [discussionId]: response.comments || []
      }))
    } catch (err) {
      console.error('Error loading comments:', err)
    }
  }

  const toggleComments = async (discussionId) => {
    const currentlyShown = showComments[discussionId]
    setShowComments(prev => ({
      ...prev,
      [discussionId]: !currentlyShown
    }))

    // Load comments if showing for the first time
    if (!currentlyShown && !comments[discussionId]) {
      await loadComments(discussionId)
    }
  }

  const handleCommentChange = (discussionId, value) => {
    setCommentForms(prev => ({
      ...prev,
      [discussionId]: value
    }))
  }

  const handleCommentSubmit = async (discussionId, e) => {
    e.preventDefault()
    const content = commentForms[discussionId]?.trim()

    if (!content) {
      alert('Please enter a comment')
      return
    }

    try {
      await createDiscussionComment(discussionId, content)

      // Clear form and reload comments
      setCommentForms(prev => ({
        ...prev,
        [discussionId]: ''
      }))
      await loadComments(discussionId)
    } catch (err) {
      alert('Failed to add comment. Please try again.')
      console.error('Error creating comment:', err)
    }
  }

  const handleDeleteComment = async (discussionId, commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return
    }

    try {
      await deleteDiscussionComment(discussionId, commentId)
      await loadComments(discussionId)
    } catch (err) {
      alert('Failed to delete comment. Please try again.')
      console.error('Error deleting comment:', err)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="discussions-page">
        <div className="discussions-container">
          <h1>Community Discussions</h1>
          <div className="loading">Loading discussions...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="discussions-page">
        <div className="discussions-container">
          <h1>Community Discussions</h1>
          <div className="error">{error}</div>
          <button onClick={loadDiscussions} className="btn-submit">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="discussions-page">
      <div className="discussions-container">
        <h1>Community Discussions</h1>

        {/* Create Discussion Button */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn-submit"
          >
            {showCreateForm ? 'Cancel' : 'Create New Discussion'}
          </button>
        </div>

        {/* Create Discussion Form */}
        {showCreateForm && (
          <div className="create-discussion">
            <h2>Start a New Discussion</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="What's your discussion about?"
                  maxLength="255"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Content *</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Share your thoughts, opinions, or questions..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="animeId">Related Anime ID (optional)</label>
                <input
                  type="number"
                  id="animeId"
                  name="animeId"
                  value={formData.animeId}
                  onChange={handleInputChange}
                  placeholder="Enter anime ID if this discussion is about a specific anime"
                />
              </div>

              <button
                type="submit"
                className="btn-submit"
                disabled={submitting}
              >
                {submitting ? 'Creating...' : 'Create Discussion'}
              </button>
            </form>
          </div>
        )}

        {/* Discussions List */}
        {discussions.length === 0 ? (
          <div className="empty-state">
            <h3>No discussions yet</h3>
            <p>Be the first to start a conversation!</p>
          </div>
        ) : (
          <div className="discussions-list">
            {discussions.map(discussion => (
              <div key={discussion.id} className="discussion-card">
                <div className="discussion-header">
                  <h3 className="discussion-title">
                    {discussion.title}
                  </h3>
                  <div className="discussion-meta">
                    <span className="discussion-author">
                      by {discussion.username}
                    </span>
                    <span className="discussion-date">
                      {formatDate(discussion.created_at)}
                    </span>
                  </div>
                </div>

                <div className="discussion-content">
                  {discussion.content}
                </div>

                <div className="discussion-footer">
                  <div className="vote-buttons">
                    <button
                      className={`vote-btn agree ${discussion.userVote === 'agree' ? 'voted' : ''}`}
                      onClick={() => handleVote(discussion.id, 'agree')}
                    >
                      👍 Agree ({discussion.agree_count})
                    </button>
                    <button
                      className={`vote-btn disagree ${discussion.userVote === 'disagree' ? 'voted' : ''}`}
                      onClick={() => handleVote(discussion.id, 'disagree')}
                    >
                      👎 Disagree ({discussion.disagree_count})
                    </button>
                  </div>

                  <button
                    onClick={() => toggleComments(discussion.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#3498db',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      textDecoration: 'underline'
                    }}
                  >
                    💬 {showComments[discussion.id] ? 'Hide' : 'Show'} Comments ({comments[discussion.id]?.length || 0})
                  </button>
                </div>

                {/* Comments Section */}
                {showComments[discussion.id] && (
                  <div className="comments-section" style={{
                    borderTop: '1px solid #e1e8ed',
                    paddingTop: '1.5rem',
                    marginTop: '1rem'
                  }}>
                    {/* Add Comment Form */}
                    <form onSubmit={(e) => handleCommentSubmit(discussion.id, e)} style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          value={commentForms[discussion.id] || ''}
                          onChange={(e) => handleCommentChange(discussion.id, e.target.value)}
                          placeholder="Add a comment..."
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            border: '1px solid #e1e8ed',
                            borderRadius: '4px',
                            fontSize: '0.9rem'
                          }}
                          required
                        />
                        <button
                          type="submit"
                          style={{
                            background: '#3498db',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                        >
                          Comment
                        </button>
                      </div>
                    </form>

                    {/* Comments List */}
                    <div className="comments-list">
                      {comments[discussion.id]?.length > 0 ? (
                        comments[discussion.id].map(comment => (
                          <div key={comment.id} style={{
                            padding: '1rem',
                            background: '#f8f9fa',
                            borderRadius: '8px',
                            marginBottom: '0.5rem',
                            border: '1px solid #e1e8ed'
                          }}>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: '0.5rem'
                            }}>
                              <span style={{
                                fontWeight: 'bold',
                                color: '#2c3e50',
                                fontSize: '0.9rem'
                              }}>
                                {comment.username}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{
                                  fontSize: '0.8rem',
                                  color: '#7f8c8d'
                                }}>
                                  {formatDate(comment.created_at)}
                                </span>
                                {/* Delete button - only show for comment author */}
                                <button
                                  onClick={() => handleDeleteComment(discussion.id, comment.id)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#e74c3c',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    padding: '0.2rem'
                                  }}
                                  title="Delete comment"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                            <p style={{
                              margin: 0,
                              color: '#34495e',
                              lineHeight: '1.4'
                            }}>
                              {comment.content}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p style={{
                          textAlign: 'center',
                          color: '#7f8c8d',
                          fontStyle: 'italic',
                          margin: '1rem 0'
                        }}>
                          No comments yet. Be the first to comment!
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Discussions
