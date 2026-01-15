/**
 * Main Server Entry Point
 * 
 * This is where the Express server starts.
 * 
 * What happens when server starts:
 * 1. Load environment variables (.env file)
 * 2. Connect to database
 * 3. Set up Express app
 * 4. Configure middleware (CORS, JSON parsing, etc.)
 * 5. Set up routes
 * 6. Start listening on a port
 */

require('dotenv').config()
const express = require('express')
const cors = require('cors')

// Import routes
const authRoutes = require('./routes/auth')
const animeRoutes = require('./routes/anime')
const trackerRoutes = require('./routes/tracker')
const discussionRoutes = require('./routes/discussions')
const platformRoutes = require('./routes/platforms')

// Import middleware
const errorHandler = require('./middleware/errorHandler')

// Create Express app
const app = express()

// ============================================
// MIDDLEWARE
// ============================================

// CORS - Allow frontend to make requests
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list or is a Vercel preview URL
    const isAllowed = allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app');

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}))

// Logging middleware to debug requests in Vercel logs
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
})

// Parse JSON request bodies
app.use(express.json())

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }))

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AniHub API is running',
    timestamp: new Date().toISOString()
  })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/anime', animeRoutes)
app.use('/api/tracker', trackerRoutes)
app.use('/api/discussions', discussionRoutes)
app.use('/api/platforms', platformRoutes)

// 404 handler - if route doesn't exist
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  })
})

// Error handler - catches all errors
app.use(errorHandler)

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
  })
}

module.exports = app
