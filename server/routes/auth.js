/**
 * Authentication Routes
 * 
 * Handles user registration and login.
 * 
 * Routes:
 * - POST /api/auth/register - Create new user account
 * - POST /api/auth/login - Login user and get token
 */

const express = require('express')
const router = express.Router()

// Import controllers (will be created next)
const authController = require('../controllers/authController')

const authMiddleware = require('../middleware/auth')

// Register new user
router.post('/register', authController.register)

// Login user
router.post('/login', authController.login)

// Get user profile
router.get('/me', authMiddleware, authController.getProfile)

module.exports = router
