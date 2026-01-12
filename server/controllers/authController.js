/**
 * Authentication Controller
 * 
 * Handles user registration and login logic.
 * 
 * How it works:
 * - register: Validates input, checks if email/username exists, hashes password, creates user
 * - login: Validates credentials, verifies password, creates JWT token
 */

const bcrypt = require('bcryptjs')
const userQueries = require('../database/queries/userQueries')
const { createToken } = require('../utils/jwt')

/**
 * Register a new user
 * 
 * Steps:
 * 1. Validate input (email, password, username)
 * 2. Check if email already exists
 * 3. Check if username already exists
 * 4. Hash password (never store plain passwords!)
 * 5. Create user in database
 * 6. Create JWT token
 * 7. Return user data and token
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body

    // Validate input
    if (!email || !password || !username) {
      return res.status(400).json({
        error: true,
        message: 'Email, password, and username are required'
      })
    }

    // Validate email format (basic check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid email format'
      })
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        error: true,
        message: 'Password must be at least 6 characters'
      })
    }

    // Validate username length
    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({
        error: true,
        message: 'Username must be between 3 and 20 characters'
      })
    }

    // Check if email already exists
    const emailExists = await userQueries.emailExists(email)
    if (emailExists) {
      return res.status(409).json({
        error: true,
        message: 'Email already registered'
      })
    }

    // Check if username already exists
    const usernameExists = await userQueries.usernameExists(username)
    if (usernameExists) {
      return res.status(409).json({
        error: true,
        message: 'Username already taken'
      })
    }

    // Hash password
    // bcrypt automatically generates a salt and hashes the password
    // 10 is the number of salt rounds (higher = more secure but slower)
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user in database
    const user = await userQueries.createUser(email, passwordHash, username)

    // Create JWT token
    // Token contains userId and email (don't put sensitive data!)
    const token = createToken({
      userId: user.id,
      email: user.email
    })

    // Return user data and token
    // Don't send password_hash!
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.created_at
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    next(error)
  }
}

/**
 * Login user
 * 
 * Steps:
 * 1. Validate input (email, password)
 * 2. Find user by email
 * 3. Check if user exists
 * 4. Verify password (compare with hash)
 * 5. Create JWT token
 * 6. Return user data and token
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: true,
        message: 'Email and password are required'
      })
    }

    // Find user by email (includes password_hash for verification)
    const user = await userQueries.findByEmail(email)

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        error: true,
        message: 'Invalid email or password'
      })
    }

    // Verify password
    // bcrypt.compare compares plain password with hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)

    if (!isPasswordValid) {
      return res.status(401).json({
        error: true,
        message: 'Invalid email or password'
      })
    }

    // Create JWT token
    const token = createToken({
      userId: user.id,
      email: user.email
    })

    // Return user data and token
    res.json({
      success: true,
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.created_at
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    next(error)
  }
}

/**
 * Get user profile
 */
exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId
    console.log('Fetching profile for user:', userId)

    // Get user details
    const user = await userQueries.findById(userId)
    if (!user) {
      console.log('User not found in DB')
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
    console.log('User found:', user.username)

    // Get tracker stats
    console.log('Fetching tracker items...')
    const trackerItems = await require('../database/queries/trackerQueries').getUserTracker(userId)
    console.log('Tracker items count:', trackerItems.length)

    // Calculate stats
    const stats = {
      total_anime: trackerItems.length,
      completed: trackerItems.filter(i => i.status === 'completed').length,
      watching: trackerItems.filter(i => i.status === 'watching').length,
      plan_to_watch: trackerItems.filter(i => i.status === 'plan-to-watch').length,
      mean_score: 0
    }

    // Calculate mean score
    const ratedItems = trackerItems.filter(i => i.rating > 0)
    if (ratedItems.length > 0) {
      const totalScore = ratedItems.reduce((sum, item) => sum + item.rating, 0)
      stats.mean_score = (totalScore / ratedItems.length).toFixed(1)
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        created_at: user.created_at
      },
      stats
    })
  } catch (error) {
    console.error('Error in getProfile:', error)
    next(error)
  }
}
