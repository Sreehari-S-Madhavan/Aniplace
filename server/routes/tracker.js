/**
 * Tracker Routes
 * 
 * Handles user's anime/manga tracking.
 * 
 * Routes (all require authentication):
 * - GET /api/tracker - Get user's tracker list
 * - POST /api/tracker - Add item to tracker
 * - PUT /api/tracker/:id - Update tracker item
 * - DELETE /api/tracker/:id - Remove tracker item
 */

const express = require('express')
const router = express.Router()

// Import middleware and controllers
const authenticateToken = require('../middleware/auth')
const trackerController = require('../controllers/trackerController')

// All tracker routes require authentication
router.use(authenticateToken)

// Get user's tracker list
router.get('/', trackerController.getList)

// Add item to tracker
router.post('/', trackerController.add)

// Update tracker item
router.put('/:id', trackerController.update)

// Delete tracker item
router.delete('/:id', trackerController.remove)

module.exports = router
