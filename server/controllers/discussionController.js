/**
 * Discussion Controller
 *
 * Handles community discussion operations.
 */

const discussionQueries = require('../database/queries/discussionQueries')
const commentQueries = require('../database/queries/discussionCommentQueries')

/**
 * Get all discussions
 */
exports.getAll = async (req, res, next) => {
  try {
    const discussions = await discussionQueries.getAllDiscussions()

    res.json({
      success: true,
      discussions
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get discussion by ID
 */
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user?.userId // Optional for authenticated users

    const discussion = await discussionQueries.getDiscussionById(id)

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      })
    }

    // Get user's vote if authenticated
    let userVote = null
    if (userId) {
      userVote = await discussionQueries.getUserVote(id, userId)
    }

    res.json({
      success: true,
      discussion: {
        ...discussion,
        userVote: userVote?.vote_type || null
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Create new discussion
 */
exports.create = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const { title, content, animeId } = req.body

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      })
    }

    if (title.length > 255) {
      return res.status(400).json({
        success: false,
        message: 'Title must be 255 characters or less'
      })
    }

    const discussion = await discussionQueries.createDiscussion(userId, title, content, animeId)

    res.status(201).json({
      success: true,
      message: 'Discussion created successfully',
      discussion
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Vote on discussion
 */
exports.vote = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const { id } = req.params
    const { voteType } = req.body

    // Validation
    if (!['agree', 'disagree'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: 'Vote type must be "agree" or "disagree"'
      })
    }

    // Check if discussion exists
    const discussion = await discussionQueries.getDiscussionById(id)
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      })
    }

    const result = await discussionQueries.voteOnDiscussion(id, userId, voteType)

    // Get updated discussion
    const updatedDiscussion = await discussionQueries.getDiscussionById(id)

    res.json({
      success: true,
      message: `Vote ${result.action} successfully`,
      discussion: {
        ...updatedDiscussion,
        userVote: voteType
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get comments for a discussion
 */
exports.getComments = async (req, res, next) => {
  try {
    const { id } = req.params

    // Check if discussion exists
    const discussion = await discussionQueries.getDiscussionById(id)
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      })
    }

    const comments = await commentQueries.getCommentsByDiscussionId(id)

    res.json({
      success: true,
      comments
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Create a comment on a discussion
 */
exports.createComment = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const { id } = req.params
    const { content } = req.body

    // Validation
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      })
    }

    // Check if discussion exists
    const discussion = await discussionQueries.getDiscussionById(id)
    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: 'Discussion not found'
      })
    }

    const comment = await commentQueries.createComment(id, userId, content.trim())

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: {
        ...comment,
        username: req.user.username, // Add username from token
        user_id: userId
      }
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Delete a comment (only by the comment author)
 */
exports.deleteComment = async (req, res, next) => {
  try {
    const userId = req.user.userId
    const { id, commentId } = req.params

    // Check if comment exists and belongs to user
    const comment = await commentQueries.getCommentById(commentId)
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      })
    }

    if (comment.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments'
      })
    }

    await commentQueries.deleteComment(commentId, userId)

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    })
  } catch (error) {
    next(error)
  }
}
