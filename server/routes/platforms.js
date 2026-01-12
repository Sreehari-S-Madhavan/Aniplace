/**
 * Platforms Routes
 * 
 * Handles legal streaming platform information.
 * 
 * Routes:
 * - GET /api/platforms/:animeId - Get platforms for an anime
 */

const express = require('express')
const router = express.Router()

// Import controllers (will be created next)
const platformController = require('../controllers/platformController')

// Get all platforms
router.get('/', platformController.getAllPlatforms)

// Get platforms for anime
router.get('/:animeId', platformController.getPlatforms)

module.exports = router
