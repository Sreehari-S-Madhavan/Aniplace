/**
 * Anime Routes
 * 
 * Handles anime-related requests.
 * 
 * Routes:
 * - GET /api/anime/search?q=query - Search anime
 * - GET /api/anime/:id - Get anime details
 */

const express = require('express')
const router = express.Router()

// Import controllers (will be created next)
const animeController = require('../controllers/animeController')

// Search anime
router.get('/search', animeController.search)

// Get anime details
router.get('/:id', animeController.getDetails)

module.exports = router
