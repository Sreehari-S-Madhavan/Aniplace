/**
 * Tracker Database Queries
 *
 * All SQL queries related to anime tracking.
 *
 * Why separate file:
 * - Keeps SQL organized
 * - Easy to find and update queries
 * - Can reuse queries across controllers
 */

const db = require('../db')

/**
 * Get all tracker items for a user
 *
 * @param {number} userId - User ID
 * @returns {Promise} - Array of tracker items
 */
async function getUserTracker(userId) {
  const query = `
    SELECT id, anime_id, status, progress, rating, notes, created_at, updated_at
    FROM tracker
    WHERE user_id = $1
    ORDER BY updated_at DESC
  `
  const result = await db.query(query, [userId])
  return result.rows
}

/**
 * Add anime to user's tracker
 *
 * @param {number} userId - User ID
 * @param {number} animeId - Anime ID from Jikan API
 * @param {string} status - Status (watching, completed, etc.)
 * @param {number} progress - Current progress (episodes watched)
 * @returns {Promise} - Created tracker item
 */
async function addToTracker(userId, animeId, status, progress = 0) {
  const query = `
    INSERT INTO tracker (user_id, anime_id, status, progress)
    VALUES ($1, $2, $3, $4)
    RETURNING id, anime_id, status, progress, rating, notes, created_at, updated_at
  `
  const result = await db.query(query, [userId, animeId, status, progress])
  return result.rows[0]
}

/**
 * Update tracker item
 *
 * @param {number} trackerId - Tracker item ID
 * @param {number} userId - User ID (for security)
 * @param {object} updates - Fields to update
 * @returns {Promise} - Updated tracker item
 */
async function updateTracker(trackerId, userId, updates) {
  const { status, progress, rating, notes } = updates

  const query = `
    UPDATE tracker
    SET status = COALESCE($1, status),
        progress = COALESCE($2, progress),
        rating = $3,
        notes = COALESCE($4, notes),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $5 AND user_id = $6
    RETURNING id, anime_id, status, progress, rating, notes, created_at, updated_at
  `

  const result = await db.query(query, [status, progress, rating, notes, trackerId, userId])

  if (result.rows.length === 0) {
    throw new Error('Tracker item not found or access denied')
  }

  return result.rows[0]
}

/**
 * Remove anime from tracker
 *
 * @param {number} trackerId - Tracker item ID
 * @param {number} userId - User ID (for security)
 * @returns {Promise} - True if deleted, false if not found
 */
async function removeFromTracker(trackerId, userId) {
  const query = `
    DELETE FROM tracker
    WHERE id = $1 AND user_id = $2
  `
  const result = await db.query(query, [trackerId, userId])
  return result.rowCount > 0
}

/**
 * Check if anime is already in user's tracker
 *
 * @param {number} userId - User ID
 * @param {number} animeId - Anime ID
 * @returns {Promise} - Tracker item if exists, null otherwise
 */
async function findTrackerItem(userId, animeId) {
  const query = `
    SELECT id, anime_id, status, progress, rating, notes, created_at, updated_at
    FROM tracker
    WHERE user_id = $1 AND anime_id = $2
  `
  const result = await db.query(query, [userId, animeId])
  return result.rows[0] || null
}

module.exports = {
  getUserTracker,
  addToTracker,
  updateTracker,
  removeFromTracker,
  findTrackerItem
}