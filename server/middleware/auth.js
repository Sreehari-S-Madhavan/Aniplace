/**
 * Authentication Middleware
 * 
 * Checks if user is logged in by verifying JWT token.
 * 
 * How it works:
 * 1. Gets token from Authorization header
 * 2. Verifies token using JWT secret
 * 3. Extracts user info from token
 * 4. Adds user info to request object
 * 5. Calls next() to continue to route handler
 * 
 * If token is invalid or missing:
 * - Returns 401 Unauthorized
 * - Stops request from reaching route handler
 */

const jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
  // Get token from Authorization header
  // Format: "Bearer abc123xyz..."
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Get part after "Bearer "

  // If no token, return 401
  if (!token) {
    return res.status(401).json({ 
      error: true,
      message: 'Access denied. No token provided.' 
    })
  }

  try {
    // Verify token
    // JWT_SECRET is stored in .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Add user info to request object
    // Now route handlers can access req.user
    req.user = decoded
    
    // Continue to next middleware/route handler
    next()
  } catch (error) {
    // Token is invalid or expired
    return res.status(403).json({ 
      error: true,
      message: 'Invalid or expired token.' 
    })
  }
}

module.exports = authenticateToken
