import { Navigate } from 'react-router-dom'
import { isAuthenticated } from '../services/auth'

/**
 * Protected Route Component
 * 
 * Wraps routes that require authentication.
 * 
 * How it works:
 * - Checks if user is logged in
 * - If logged in: shows the protected component
 * - If not logged in: redirects to login page
 * 
 * Usage:
 * <Route path="/tracker" element={
 *   <ProtectedRoute>
 *     <Tracker />
 *   </ProtectedRoute>
 * } />
 */
function ProtectedRoute({ children }) {
  const authenticated = isAuthenticated()

  if (!authenticated) {
    // Redirect to login, but save where they wanted to go
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
