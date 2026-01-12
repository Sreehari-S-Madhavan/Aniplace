/**
 * Platform Controller
 *
 * Handles legal streaming platform information.
 */

const platformQueries = require('../database/queries/platformQueries')

/**
 * Get platforms for a specific anime
 */
exports.getPlatforms = async (req, res, next) => {
  try {
    const { animeId } = req.params
    const region = req.query.region || 'US'

    // Validate animeId
    const animeIdNum = parseInt(animeId)
    if (isNaN(animeIdNum)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid anime ID'
      })
    }

    const platforms = await platformQueries.getPlatformsForAnime(animeIdNum, region)

    res.json({
      success: true,
      animeId: animeIdNum,
      region,
      platforms
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get all available platforms (for admin/frontend reference)
 */
exports.getAllPlatforms = async (req, res, next) => {
  try {
    const region = req.query.region || 'US'

    const platforms = await platformQueries.getAllPlatforms(region)

    res.json({
      success: true,
      region,
      platforms
    })
  } catch (error) {
    next(error)
  }
}
