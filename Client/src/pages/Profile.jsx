import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const Profile = () => {
  const { user, updateProfile, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState(user?.fullName || '')
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const fileInputRef = useRef(null)

  // Sync profile data when user loads or updates
  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName)
      if (user.avatar) setAvatarPreview(user.avatar)
    }
  }, [user])

  // Redirect if no user (should be handled by ProtectedRoute, but just in case)
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin')
    }
  }, [authLoading, user, navigate])

  if (authLoading || !user) {
    return null
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatar(file)
      // Preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fullName.trim()) {
      setError('Full name is required')
      return
    }

    setIsSubmitting(true)
    setMessage('')
    setError('')

    try {
      await updateProfile({ fullName: fullName.trim(), avatar })
      setMessage('Profile updated successfully!')
      setAvatar(null)
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <SEO 
        title="User Profile"
        description="Manage your account preferences and saved resume settings on LaTexume."
        canonicalPath="/profile"
      />
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 pt-24 sm:pt-28 md:pt-36">
        <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden animate-fade-in-up mt-4 sm:mt-8">
          {/* Glassmorphic decorative elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 bg-[#A6FF5D] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

          <h1 className="text-3xl font-bold text-white mb-2 text-center relative z-10">Your Profile</h1>
          <p className="text-white/50 text-xs text-center mb-6 relative z-10">Manage your account information and avatar</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 relative z-10">
            {/* Avatar upload */}
            <div className="flex flex-col items-center gap-3">
              <div 
                className="w-24 h-24 rounded-full border-2 border-white/20 hover:border-[#A6FF5D] overflow-hidden cursor-pointer relative group bg-white/5 transition-all duration-300 shadow-lg"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50 text-3xl font-bold bg-[#A6FF5D]/10 text-[#A6FF5D]">
                    {(fullName || user?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-white mb-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white text-[11px] font-medium">Change Photo</span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
              <span className="text-white/40 text-xs">Click photo to update avatar</span>
            </div>

            {/* Full Name & Email Readonly Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="block text-[11px] text-white/40 font-medium">Account Name</span>
                <span className="block text-sm font-semibold text-white/80 truncate">{user?.fullName || 'User'}</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <span className="block text-[11px] text-white/40 font-medium">Email</span>
                <span className="block text-sm font-semibold text-white/80 truncate">{user?.email}</span>
              </div>
            </div>

            {/* Full Name Input */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/15 focus:outline-none focus:ring-2 focus:ring-[#A6FF5D]/50 focus:border-[#A6FF5D] transition-all"
                placeholder="Aarav Sharma"
              />
            </div>

            {/* Feedback messages */}
            {message && (
              <div className="flex items-center gap-2 bg-[#A6FF5D]/10 border border-[#A6FF5D]/30 text-[#A6FF5D] rounded-xl px-4 py-2.5 text-sm animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {message}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-2.5 text-sm animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-gray-900 font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2 mt-2 shadow-lg hover:shadow-[#A6FF5D]/20"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Profile
