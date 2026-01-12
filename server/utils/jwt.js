/**
 * JWT Utility Functions
 * 
 * Functions to create and verify JWT tokens.
 * 
 * Why separate file:
 * - Reusable across controllers
 * - Easy to update token logic
 */

const jwt = require('jsonwebtoken')

/**
 * Create a JWT token
 * 
 * @param {object} payload - Data to encode in token (usually userId, email)
 * @returns {string} - JWT token
 */
function createToken(payload) {
  // JWT_SECRET should be a long random string (stored in .env)
  // expiresIn: token expires in 7 days
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '7d'
  })
}

/**
 * Verify a JWT token
 * 
 * @param {string} token - JWT token to verify
 * @returns {object} - Decoded token payload
 */
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = {
  createToken,
  verifyToken
}
