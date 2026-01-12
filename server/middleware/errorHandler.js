/**
 * Error Handler Middleware
 * 
 * This catches all errors and sends a nice error response.
 * 
 * Why this exists:
 * - Prevents server crashes
 * - Sends consistent error format
 * - Logs errors for debugging
 */

function errorHandler(err, req, res, next) {
  console.error('Error:', err)

  // Default error
  const status = err.status || err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  // Send error response
  res.status(status).json({
    error: true,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

module.exports = errorHandler
