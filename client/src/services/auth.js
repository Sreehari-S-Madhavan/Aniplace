/**
 * Authentication Helper Functions
 * 
 * Functions to manage user authentication state.
 * 
 * Why separate from api.js:
 * - Keeps auth logic organized
 * - Easy to check if user is logged in
 * - Centralized token management
 */

/**
 * Save authentication token to localStorage
 * 
 * @param {string} token - JWT token
 */
export function saveToken(token) {
  localStorage.setItem('token', token)
}

/**
 * Get authentication token from localStorage
 * 
 * @returns {string|null} - JWT token or null
 */
export function getToken() {
  return localStorage.getItem('token')
}

/**
 * Remove authentication token (logout)
 */
export function removeToken() {
  localStorage.removeItem('token')
}

/**
 * Check if user is logged in
 * 
 * @returns {boolean} - True if token exists
 */
export function isAuthenticated() {
  return !!getToken()
}

/**
 * Save user data to localStorage
 * 
 * @param {object} user - User object
 */
export function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user))
}

/**
 * Get user data from localStorage
 * 
 * @returns {object|null} - User object or null
 */
export function getUser() {
  try {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    console.error('Error parsing user from localStorage:', error)
    return null
  }
}

/**
 * Remove user data (logout)
 */
export function removeUser() {
  localStorage.removeItem('user')
}

/**
 * Complete logout - removes both token and user data
 */
export function logout() {
  removeToken()
  removeUser()
}
