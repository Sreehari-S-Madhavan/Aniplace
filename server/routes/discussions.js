/**
 * Discussions Routes
 * 
 * Handles community discussions.
 * 
 * Routes:
 * - GET /api/discussions - Get all discussions
 * - POST /api/discussions - Create discussion (requires auth)
 * - GET /api/discussions/:id - Get discussion details
 * - POST /api/discussions/:id/vote - Vote on discussion (requires auth)
 */

const express = require('express')
const router = express.Router()

// Import middleware and controllers
const authenticateToken = require('../middleware/auth')
const discussionController = require('../controllers/discussionController')

// Get all discussions (public)
router.get('/', discussionController.getAll)

// Get discussion details (public)
router.get('/:id', discussionController.getById)

// Create discussion (requires auth)
router.post('/', authenticateToken, discussionController.create)

// Vote on discussion (requires auth)
router.post('/:id/vote', authenticateToken, discussionController.vote)

// Get comments for a discussion (public)
router.get('/:id/comments', discussionController.getComments)

// Create comment on discussion (requires auth)
router.post('/:id/comments', authenticateToken, discussionController.createComment)

// Delete comment (requires auth)
router.delete('/:id/comments/:commentId', authenticateToken, discussionController.deleteComment)

module.exports = router
