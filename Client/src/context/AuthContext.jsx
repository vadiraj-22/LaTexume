import React, { createContext, useContext, useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // On mount – try to restore session from the server (via httpOnly cookie)
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/v1/users/me`, {
          credentials: 'include',
        })
        if (res.ok) {
          const data = await res.json()
          setUser(data.data)
          setIsAuthenticated(true)
        }
      } catch {
        // No active session — that's fine
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [])

  /**
   * Register a new user.
   * @param {{ fullName, username, email, password, avatar?: File }} payload
   */
  const register = async (payload) => {
    const formData = new FormData()
    formData.append('fullName', payload.fullName)
    formData.append('username', payload.username)
    formData.append('email', payload.email)
    formData.append('password', payload.password)
    if (payload.avatar) formData.append('avatar', payload.avatar)

    const res = await fetch(`${API_BASE}/api/v1/users/register`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Registration failed')

    return data
  }

  /**
   * Log in an existing user.
   * @param {{ usernameOrEmail, password }} payload
   */
  const login = async ({ usernameOrEmail, password }) => {
    const isEmail = usernameOrEmail.includes('@')
    const body = isEmail
      ? { email: usernameOrEmail, password }
      : { username: usernameOrEmail, password }

    const res = await fetch(`${API_BASE}/api/v1/users/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Login failed')

    setUser(data.data.user)
    setIsAuthenticated(true)
    return data
  }

  /**
   * Log out the current user.
   */
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/v1/users/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  /**
   * Update the user profile.
   * @param {{ fullName, avatar?: File }} payload
   */
  const updateProfile = async (payload) => {
    const formData = new FormData()
    formData.append('fullName', payload.fullName)
    if (payload.avatar) formData.append('avatar', payload.avatar)

    const res = await fetch(`${API_BASE}/api/v1/users/update-account`, {
      method: 'PATCH',
      credentials: 'include',
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Failed to update profile')

    setUser(data.data) // Assuming backend returns the updated user object
    return data
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider')
  return ctx
}
