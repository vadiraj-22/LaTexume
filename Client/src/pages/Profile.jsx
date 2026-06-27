import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

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

  // Redirect if no user (should be handled by ProtectedRoute, but just in case)
  if (!authLoading && !user) {
    navigate('/signin')
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
    setIsSubmitting(true)
    setMessage('')
    setError('')

    try {
      await updateProfile({ fullName, avatar })
      setMessage('Profile updated successfully!')
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 pt-36">
        <div className="w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden animate-fade-in-up mt-16">
          {/* Glassmorphic decorative elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-40 h-40 bg-[#A6FF5D] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-40 h-40 bg-blue-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>

          <h1 className="text-3xl font-bold text-white mb-8 text-center relative z-10">Your Profile</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
            {/* Avatar upload */}
            <div className="flex flex-col items-center gap-4">
              <div 
                className="w-24 h-24 rounded-full border-2 border-white/20 overflow-hidden cursor-pointer relative group bg-white/5"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/50 text-3xl font-bold">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-semibold">Change</span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#A6FF5D]/50 transition-all"
                placeholder="John Doe"
              />
            </div>

            {/* Feedback messages */}
            {message && <p className="text-[#A6FF5D] text-sm text-center">{message}</p>}
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-gray-900 font-semibold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-2 mt-4"
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
