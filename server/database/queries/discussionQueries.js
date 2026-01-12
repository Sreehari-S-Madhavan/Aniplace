/**
 * Discussion Queries
 *
 * Database queries for community discussions.
 */

const pool = require('../db')

/**
 * Get all discussions with user info and vote counts
 */
async function getAllDiscussions() {
  const query = `
    SELECT
      d.id,
      d.title,
      d.content,
      d.anime_id,
      d.agree_count,
      d.disagree_count,
      d.created_at,
      u.username,
      u.id as user_id
    FROM discussions d
    JOIN users u ON d.user_id = u.id
    ORDER BY d.created_at DESC
  `

  const result = await pool.query(query)
  return result.rows
}

/**
 * Get discussion by ID with user info and vote counts
 */
async function getDiscussionById(id) {
  const query = `
    SELECT
      d.id,
      d.title,
      d.content,
      d.anime_id,
      d.agree_count,
      d.disagree_count,
      d.created_at,
      u.username,
      u.id as user_id
    FROM discussions d
    JOIN users u ON d.user_id = u.id
    WHERE d.id = $1
  `

  const result = await pool.query(query, [id])
  return result.rows[0]
}

/**
 * Create a new discussion
 */
async function createDiscussion(userId, title, content, animeId = null) {
  const query = `
    INSERT INTO discussions (user_id, title, content, anime_id)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, content, anime_id, agree_count, disagree_count, created_at
  `

  const result = await pool.query(query, [userId, title, content, animeId])
  return result.rows[0]
}

/**
 * Get user's vote on a discussion
 */
async function getUserVote(discussionId, userId) {
  const query = `
    SELECT vote_type FROM discussion_votes
    WHERE discussion_id = $1 AND user_id = $2
  `

  const result = await pool.query(query, [discussionId, userId])
  return result.rows[0]
}

/**
 * Add or update a vote on a discussion
 */
async function voteOnDiscussion(discussionId, userId, voteType) {
  // First, check if user already voted
  const existingVote = await getUserVote(discussionId, userId)

  if (existingVote) {
    // If same vote type, remove the vote
    if (existingVote.vote_type === voteType) {
      await pool.query(
        'DELETE FROM discussion_votes WHERE discussion_id = $1 AND user_id = $2',
        [discussionId, userId]
      )
      // Update counts
      await updateVoteCounts(discussionId)
      return { action: 'removed', voteType }
    } else {
      // Change vote type
      await pool.query(
        'UPDATE discussion_votes SET vote_type = $1 WHERE discussion_id = $2 AND user_id = $3',
        [voteType, discussionId, userId]
      )
      // Update counts
      await updateVoteCounts(discussionId)
      return { action: 'changed', voteType }
    }
  } else {
    // Add new vote
    await pool.query(
      'INSERT INTO discussion_votes (discussion_id, user_id, vote_type) VALUES ($1, $2, $3)',
      [discussionId, userId, voteType]
    )
    // Update counts
    await updateVoteCounts(discussionId)
    return { action: 'added', voteType }
  }
}

/**
 * Update agree/disagree counts for a discussion
 */
async function updateVoteCounts(discussionId) {
  const query = `
    UPDATE discussions
    SET
      agree_count = (SELECT COUNT(*) FROM discussion_votes WHERE discussion_id = $1 AND vote_type = 'agree'),
      disagree_count = (SELECT COUNT(*) FROM discussion_votes WHERE discussion_id = $1 AND vote_type = 'disagree')
    WHERE id = $1
  `

  await pool.query(query, [discussionId])
}

module.exports = {
  getAllDiscussions,
  getDiscussionById,
  createDiscussion,
  getUserVote,
  voteOnDiscussion,
  updateVoteCounts
}