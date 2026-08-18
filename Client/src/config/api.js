export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

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
