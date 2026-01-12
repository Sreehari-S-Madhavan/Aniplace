/**
 * API Service
 * 
 * Centralized functions for making HTTP requests to the backend.
 * 
 * Why this file exists:
 * - Keeps all API calls in one place
 * - Easy to update API base URL
 * - Consistent error handling
 * - Can add authentication headers automatically
 * 
 * Usage:
 * import { searchAnime } from './services/api'
 * const results = await searchAnime('naruto')
 */

// Base URL for API (will be different in production)
// Base URL for API
const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
// Ensure we don't end up with double /api if env var has it
const API_BASE_URL = envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`

/**
 * Helper function to make API requests
 * 
 * @param {string} endpoint - API endpoint (e.g., '/anime/search')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise} - Response data
 */
async function apiRequest(endpoint, options = {}) {
  // Get token from localStorage if user is logged in
  const token = localStorage.getItem('token')

  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Add authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    // Parse JSON response
    const data = await response.json()

    // If response is not ok, throw error
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// ============================================
// AUTH API FUNCTIONS
// ============================================

/**
 * Register a new user
 * 
 * @param {object} userData - { email, password, username }
 * @returns {Promise} - User data and token
 */
export async function register(userData) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

/**
 * Login user
 * 
 * @param {object} credentials - { email, password }
 * @returns {Promise} - User data and token
 */
export async function login(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

/**
 * Get user profile and stats
 * 
 * @returns {Promise} - User profile data
 */
export async function getUserProfile() {
  return apiRequest('/auth/me')
}

// ============================================
// ANIME API FUNCTIONS
// ============================================

/**
 * Search anime using Jikan API
 * 
 * @param {string} query - Search query
 * @returns {Promise} - Array of anime results
 */
export async function searchAnime(query, limit = 20) {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=${limit}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Jikan API Error:', error)
    throw error
  }
}

/**
 * Get popular anime (no search query)
 * 
 * @returns {Promise} - Array of popular anime
 */
export async function getPopularAnime() {
  try {
    const response = await fetch('https://api.jikan.moe/v4/anime?order_by=popularity&sort=asc&limit=20')
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error('Jikan API Error:', error)
    throw error
  }
}

/**
 * Get anime details from Jikan API
 * 
 * @param {number} animeId - Anime ID
 * @returns {Promise} - Anime details
 */
export async function getAnimeDetails(animeId) {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`)
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Jikan API Error:', error)
    throw error
  }
}

// ============================================
// TRACKER API FUNCTIONS
// ============================================

/**
 * Get user's tracker list
 * 
 * @returns {Promise} - Array of tracked items
 */
export async function getTrackerList() {
  return apiRequest('/tracker')
}

/**
 * Add item to tracker
 * 
 * @param {object} item - { animeId, status, progress }
 * @returns {Promise} - Created tracker item
 */
export async function addToTracker(item) {
  return apiRequest('/tracker', {
    method: 'POST',
    body: JSON.stringify(item),
  })
}

/**
 * Update tracker item
 * 
 * @param {number} trackerId - Tracker item ID
 * @param {object} updates - Fields to update
 * @returns {Promise} - Updated tracker item
 */
export async function updateTrackerItem(trackerId, updates) {
  return apiRequest(`/tracker/${trackerId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  })
}

/**
 * Remove item from tracker
 * 
 * @param {number} trackerId - Tracker item ID
 * @returns {Promise} - Success message
 */
export async function removeFromTracker(trackerId) {
  return apiRequest(`/tracker/${trackerId}`, {
    method: 'DELETE',
  })
}

// ============================================
// DISCUSSIONS API FUNCTIONS
// ============================================

/**
 * Get all discussions
 * 
 * @returns {Promise} - Array of discussions
 */
export async function getDiscussions() {
  return apiRequest('/discussions')
}

/**
 * Create a new discussion
 * 
 * @param {object} discussion - { title, content, animeId }
 * @returns {Promise} - Created discussion
 */
export async function createDiscussion(discussion) {
  return apiRequest('/discussions', {
    method: 'POST',
    body: JSON.stringify(discussion),
  })
}

/**
 * Vote on a discussion
 * 
 * @param {number} discussionId - Discussion ID
 * @param {string} voteType - 'agree' or 'disagree'
 * @returns {Promise} - Updated discussion
 */
export async function voteDiscussion(discussionId, voteType) {
  return apiRequest(`/discussions/${discussionId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ voteType }),
  })
}

/**
 * Get comments for a discussion
 * 
 * @param {number} discussionId - Discussion ID
 * @returns {Promise} - Array of comments
 */
export async function getDiscussionComments(discussionId) {
  return apiRequest(`/discussions/${discussionId}/comments`)
}

/**
 * Create a comment on a discussion
 * 
 * @param {number} discussionId - Discussion ID
 * @param {string} content - Comment content
 * @returns {Promise} - Created comment
 */
export async function createDiscussionComment(discussionId, content) {
  return apiRequest(`/discussions/${discussionId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  })
}

/**
 * Delete a comment
 * 
 * @param {number} discussionId - Discussion ID
 * @param {number} commentId - Comment ID
 * @returns {Promise} - Success message
 */
export async function deleteDiscussionComment(discussionId, commentId) {
  return apiRequest(`/discussions/${discussionId}/comments/${commentId}`, {
    method: 'DELETE',
  })
}

// ============================================
// PLATFORMS API FUNCTIONS
// ============================================

/**
 * Get all available platforms
 *
 * @param {string} region - Region code (default: 'US')
 * @returns {Promise} - Array of platforms
 */
export async function getAllPlatforms(region = 'US') {
  return apiRequest(`/platforms?region=${region}`)
}

/**
 * Get platforms for an anime
 *
 * @param {number} animeId - Anime ID
 * @param {string} region - Region code (default: 'US')
 * @returns {Promise} - Array of platforms
 */
export async function getPlatforms(animeId, region = 'US') {
  return apiRequest(`/platforms/${animeId}?region=${region}`)
}
