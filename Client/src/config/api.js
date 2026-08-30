let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Remove trailing slash if present
if (apiUrl.endsWith('/')) {
  apiUrl = apiUrl.slice(0, -1)
}

export const API_URL = apiUrl

/**
 * Helper to construct API endpoints
 */
export const apiEndpoint = (path) => {
  if (!path.startsWith('/')) {
    path = '/' + path
  }
  return `${API_URL}${path}`
}

/**
 * Returns common headers for API requests including Authorization token from localStorage.
 */
export const getAuthHeaders = (extraHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...extraHeaders,
  }
  const token = localStorage.getItem('accessToken')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}
