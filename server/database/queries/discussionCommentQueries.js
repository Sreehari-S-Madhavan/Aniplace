/**
 * Discussion Comment Queries
 *
 * Database queries for discussion comments.
 */

const pool = require('../db')

/**
 * Get all comments for a discussion
 */
async function getCommentsByDiscussionId(discussionId) {
  const query = `
    SELECT
      dc.id,
      dc.content,
      dc.created_at,
      dc.updated_at,
      u.username,
      u.id as user_id
    FROM discussion_comments dc
    JOIN users u ON dc.user_id = u.id
    WHERE dc.discussion_id = $1
    ORDER BY dc.created_at ASC
  `

  const result = await pool.query(query, [discussionId])
  return result.rows
}

/**
 * Create a new comment
 */
async function createComment(discussionId, userId, content) {
  const query = `
    INSERT INTO discussion_comments (discussion_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING id, content, created_at, updated_at
  `

  const result = await pool.query(query, [discussionId, userId, content])
  return result.rows[0]
}

/**
 * Delete a comment (only by the comment author)
 */
async function deleteComment(commentId, userId) {
  const query = `
    DELETE FROM discussion_comments
    WHERE id = $1 AND user_id = $2
    RETURNING id
  `

  const result = await pool.query(query, [commentId, userId])
  return result.rows[0]
}

/**
 * Get comment by ID (for validation)
 */
async function getCommentById(commentId) {
  const query = `
    SELECT id, discussion_id, user_id, content, created_at
    FROM discussion_comments
    WHERE id = $1
  `

  const result = await pool.query(query, [commentId])
  return result.rows[0]
}

module.exports = {
  getCommentsByDiscussionId,
  createComment,
  deleteComment,
  getCommentById
}