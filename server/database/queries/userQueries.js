/**
 * User Database Queries
 * 
 * All SQL queries related to users.
 * 
 * Why separate file:
 * - Keeps SQL organized
 * - Easy to find and update queries
 * - Can reuse queries across controllers
 */

const db = require('../db')

/**
 * Create a new user
 * 
 * @param {string} email - User email
 * @param {string} passwordHash - Hashed password
 * @param {string} username - Username
 * @returns {Promise} - Created user (without password)
 */
async function createUser(email, passwordHash, username) {
  const query = `
    INSERT INTO users (email, password_hash, username)
    VALUES ($1, $2, $3)
    RETURNING id, email, username, created_at
  `
  const result = await db.query(query, [email, passwordHash, username])
  return result.rows[0]
}

/**
 * Find user by email
 * 
 * @param {string} email - User email
 * @returns {Promise} - User object (includes password_hash for verification)
 */
async function findByEmail(email) {
  const query = `
    SELECT id, email, password_hash, username, created_at
    FROM users
    WHERE email = $1
  `
  const result = await db.query(query, [email])
  return result.rows[0] || null
}

/**
 * Find user by username
 * 
 * @param {string} username - Username
 * @returns {Promise} - User object
 */
async function findByUsername(username) {
  const query = `
    SELECT id, email, username, created_at
    FROM users
    WHERE username = $1
  `
  const result = await db.query(query, [username])
  return result.rows[0] || null
}

/**
 * Find user by ID
 * 
 * @param {number} id - User ID
 * @returns {Promise} - User object (without password)
 */
async function findById(id) {
  const query = `
    SELECT id, email, username, created_at
    FROM users
    WHERE id = $1
  `
  const result = await db.query(query, [id])
  return result.rows[0] || null
}

/**
 * Check if email exists
 * 
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} - True if email exists
 */
async function emailExists(email) {
  const query = `
    SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)
  `
  const result = await db.query(query, [email])
  return result.rows[0].exists
}

/**
 * Check if username exists
 * 
 * @param {string} username - Username to check
 * @returns {Promise<boolean>} - True if username exists
 */
async function usernameExists(username) {
  const query = `
    SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)
  `
  const result = await db.query(query, [username])
  return result.rows[0].exists
}

module.exports = {
  createUser,
  findByEmail,
  findByUsername,
  findById,
  emailExists,
  usernameExists
}
