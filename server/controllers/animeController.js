/**
 * Anime Controller
 * 
 * Handles anime-related operations.
 * 
 * TODO: Implement these functions
 * - search: Call Jikan API to search anime
 * - getDetails: Get anime details from Jikan API
 */

// Placeholder - will be implemented when we build anime features
exports.search = async (req, res, next) => {
  try {
    const { q } = req.query
    
    // TODO: Call Jikan API
    res.status(501).json({ 
      message: 'Anime search not yet implemented',
      query: q 
    })
  } catch (error) {
    next(error)
  }
}

exports.getDetails = async (req, res, next) => {
  try {
    const { id } = req.params
    
    // TODO: Call Jikan API
    res.status(501).json({ 
      message: 'Anime details not yet implemented',
      animeId: id 
    })
  } catch (error) {
    next(error)
  }
}
