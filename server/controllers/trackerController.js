/**
 * Tracker Controller
 *
 * Handles user's anime/manga tracking operations.
 */

const trackerQueries = require('../database/queries/trackerQueries')

/**
 * Get user's tracker list
 */
exports.getList = async (req, res, next) => {
  try {
    const userId = req.user.userId

    const trackerItems = await trackerQueries.getUserTracker(userId)

    res.json({
      success: true,
      data: trackerItems
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Add anime to tracker
 */
exports.add = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const { animeId, status, progress } = req.body

    // Validate required fields
    if (!animeId || !status) {
      return res.status(400).json({
        success: false,
        message: 'animeId and status are required'
      })
    }

    // Validate status
    const validStatuses = ['watching', 'completed', 'on-hold', 'dropped', 'plan-to-watch']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      })
    }

    // Check if already in tracker
    const existing = await trackerQueries.findTrackerItem(userId, animeId)
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Anime is already in your tracker'
      })
    }

    const trackerItem = await trackerQueries.addToTracker(userId, animeId, status, progress || 0)

    res.status(201).json({
      success: true,
      message: 'Anime added to tracker',
      data: trackerItem
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update tracker item
 */
exports.update = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const { id } = req.params
    const { status, progress, rating, notes } = req.body

    // Validate status if provided
    if (status) {
      const validStatuses = ['watching', 'completed', 'on-hold', 'dropped', 'plan-to-watch']
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
        })
      }
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 10)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 10'
      })
    }

    const updates = { status, progress, rating, notes }
    const updatedItem = await trackerQueries.updateTracker(id, userId, updates)

    res.json({
      success: true,
      message: 'Tracker item updated',
      data: updatedItem
    })
  } catch (error) {
    if (error.message === 'Tracker item not found or access denied') {
      return res.status(404).json({
        success: false,
        message: error.message
      })
    }
    next(error)
  }
}

/**
 * Remove anime from tracker
 */
exports.remove = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const { id } = req.params

    const deleted = await trackerQueries.removeFromTracker(id, userId)

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Tracker item not found'
      })
    }

    res.json({
      success: true,
      message: 'Anime removed from tracker'
    })
  } catch (error) {
    next(error)
  }
}
