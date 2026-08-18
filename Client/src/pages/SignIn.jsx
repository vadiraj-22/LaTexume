import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import SEO from '../components/SEO'

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

export default function SignIn() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/builder'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email.trim()) return setError('Email is required')
    if (!form.password) return setError('Password is required')

    setLoading(true)
    setError('')
    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
      <SEO 
        title="Sign In"
        description="Sign in to your LaTexume account to save, edit, and export your LaTeX ATS resumes."
        canonicalPath="/signin"
      />
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#A6FF5D]/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#A6FF5D]/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#A6FF5D]/3 blur-[160px]" />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Card */}
        <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl hover:border-[#A6FF5D]/20 transition-all duration-300">
          {/* Logo + heading */}
          <div className="flex flex-col items-center mb-6 text-center">
            <Link to="/" className="mb-5 transition-transform duration-300 hover:scale-105">
              <Logo />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Welcome back</h1>
            <p className="text-zinc-400 text-sm mt-1.5">Sign in to your LaTexume account</p>
          </div>

          {/* Redirected notice - Distinct Alert Banner */}
          {location.state?.from && (
            <div className="flex items-center justify-center gap-2 bg-[#A6FF5D]/10 border border-[#A6FF5D]/30 text-[#A6FF5D] rounded-xl px-4 py-2.5 text-xs font-semibold mb-6 animate-fade-in text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Sign in required to access the Resume Builder</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4.5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-zinc-300 text-sm font-medium mb-1.5">
                Email Address
              </label>
              <input
                id="email" name="email"
                type="email"
                autoComplete="email"
                placeholder="aarav@example.com"
                value={form.email} onChange={handleChange}
                className="w-full bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 focus:border-[#A6FF5D] focus:ring-1 focus:ring-[#A6FF5D] focus:outline-none text-white placeholder-zinc-500 rounded-xl px-4 py-3 text-sm transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-zinc-300 text-sm font-medium">Password</label>
                <button
                  type="button"
                  onClick={() => setError('Password reset feature: Please check your registered email for instructions.')}
                  className="text-xs text-[#A6FF5D] hover:underline font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="login-password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password} onChange={handleChange}
                  className="w-full bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 focus:border-[#A6FF5D] focus:ring-1 focus:ring-[#A6FF5D] focus:outline-none text-white placeholder-zinc-500 rounded-xl px-4 py-3 pr-12 text-sm transition-all duration-200"
                />
                <button
                  type="button"
                  id="toggle-password-visibility"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#A6FF5D] transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-xs sm:text-sm animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              id="signin-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-[#A6FF5D] hover:bg-[#b8ff7a] disabled:opacity-60 disabled:cursor-not-allowed text-black font-extrabold rounded-xl py-3.5 text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#A6FF5D]/25 mt-2 flex items-center justify-center gap-2 cursor-pointer border border-[#A6FF5D]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Signing in…</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-zinc-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#A6FF5D] hover:underline font-semibold transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
