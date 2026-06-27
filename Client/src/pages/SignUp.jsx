import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

const EyeIcon = ({ open }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )

export default function SignUp() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const avatarRef = useRef(null)

  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '', confirmPassword: '' })
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatar(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const validate = () => {
    if (!form.fullName.trim()) return 'Full name is required'
    if (!form.username.trim()) return 'Username is required'
    if (!/^[a-z0-9_]{3,20}$/.test(form.username.toLowerCase()))
      return 'Username must be 3–20 characters (letters, numbers, underscores)'
    if (!form.email.trim()) return 'Email is required'
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email'
    if (!form.password) return 'Password is required'
    if (form.password.length < 6) return 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) return 'Passwords do not match'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) return setError(validationError)

    setLoading(true)
    setError('')
    try {
      await register({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
        avatar,
      })
      setSuccess('Account created! Redirecting to sign in…')
      setTimeout(() => navigate('/signin'), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#A6FF5D]/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#A6FF5D]/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#A6FF5D]/3 blur-[180px]" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          {/* Logo + heading */}
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="mb-6 transition-transform duration-300 hover:scale-105">
              <Logo />
            </Link>
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-white/50 text-sm mt-1">Start building ATS-optimised resumes</p>
          </div>

          {/* Avatar picker */}
          <div className="flex flex-col items-center mb-6">
            <button
              type="button"
              id="avatar-picker-btn"
              onClick={() => avatarRef.current?.click()}
              className="group relative w-20 h-20 rounded-full border-2 border-dashed border-white/20 hover:border-[#A6FF5D]/60 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-[#A6FF5D]/20"
              aria-label="Upload avatar"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} className="text-white/40 group-hover:text-[#A6FF5D]/60 transition-colors">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span className="text-[10px] text-white/40 group-hover:text-[#A6FF5D]/60 transition-colors">Photo</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
            </button>
            <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" id="avatar-input" />
            <span className="text-white/40 text-xs mt-2">Optional profile photo</span>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-white/70 text-sm font-medium mb-1.5">Full Name</label>
              <input
                id="fullName" name="fullName" type="text"
                placeholder="Jane Doe"
                value={form.fullName} onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#A6FF5D]/60 focus:outline-none text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:bg-white/[0.07]"
              />
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-white/70 text-sm font-medium mb-1.5">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">@</span>
                <input
                  id="username" name="username" type="text"
                  placeholder="janedoe"
                  value={form.username} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#A6FF5D]/60 focus:outline-none text-white placeholder-white/30 rounded-xl pl-8 pr-4 py-3 text-sm transition-all duration-200 focus:bg-white/[0.07]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-white/70 text-sm font-medium mb-1.5">Email</label>
              <input
                id="reg-email" name="email" type="email"
                placeholder="jane@example.com"
                value={form.email} onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#A6FF5D]/60 focus:outline-none text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:bg-white/[0.07]"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="reg-password" className="block text-white/70 text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="reg-password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#A6FF5D]/60 focus:outline-none text-white placeholder-white/30 rounded-xl px-4 py-3 pr-12 text-sm transition-all duration-200 focus:bg-white/[0.07]"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#A6FF5D] transition-colors p-1">
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-white/70 text-sm font-medium mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword" name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat password"
                  value={form.confirmPassword} onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#A6FF5D]/60 focus:outline-none text-white placeholder-white/30 rounded-xl px-4 py-3 pr-12 text-sm transition-all duration-200 focus:bg-white/[0.07]"
                />
                <button type="button" onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#A6FF5D] transition-colors p-1">
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
            </div>

            {/* Error / Success */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 bg-[#A6FF5D]/10 border border-[#A6FF5D]/30 text-[#A6FF5D] rounded-xl px-4 py-3 text-sm animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              id="signup-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 font-semibold rounded-xl py-3.5 text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#A6FF5D]/30 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-white/40 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/signin" className="text-[#A6FF5D] hover:text-[#A6FF5D]/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
