import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import { GlassEffect } from './ui/liquid-glass'

/* ─── Star / sparkle icon that matches existing brand ─────────────────────── */
const SparkleIcon = () => (
  <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.795.605v2.593m1.245-1.296h-2.488M1.845 13.565c.687 0 1.244-.58 1.244-1.296s-.557-1.296-1.244-1.296-1.244.58-1.244 1.296.557 1.296 1.244 1.296M6.209 1.13a.65.65 0 0 1 .214-.379.61.61 0 0 1 .795 0 .66.66 0 0 1 .214.38l.653 3.601c.047.256.166.492.343.676s.403.309.649.357l3.456.681a.62.62 0 0 1 .364.223.665.665 0 0 1 0 .828.62.62 0 0 1-.364.223l-3.456.681a1.23 1.23 0 0 0-.65.358c-.176.184-.295.42-.342.675l-.653 3.602a.65.65 0 0 1-.214.38.61.61 0 0 1-.795 0 .65.65 0 0 1-.214-.38l-.654-3.602a1.3 1.3 0 0 0-.342-.675 1.23 1.23 0 0 0-.649-.358l-3.456-.68a.62.62 0 0 1-.365-.224.665.665 0 0 1 0-.828.62.62 0 0 1 .365-.223l3.456-.68c.246-.05.472-.174.649-.358s.296-.42.342-.676z"
      stroke="#1e2939"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/* ─── Nav link item ────────────────────────────────────────────────────────── */
const NavLink = ({ to, children, onClick, active }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`relative text-sm font-medium transition-all duration-300 px-1 py-0.5 group ${
      active ? 'text-white' : 'text-white/60 hover:text-white'
    }`}
  >
    {children}
    <span
      className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-[#A6FF5D] rounded-full transition-all duration-300 ${
        active ? 'w-full' : 'w-0 group-hover:w-full'
      }`}
    />
  </Link>
)

/* ─── Main Dynamic Island Navbar ───────────────────────────────────────────── */
const Navbar = () => {
  const [expanded, setExpanded] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const islandRef = useRef(null)
  const userMenuRef = useRef(null)

  const userInitial =
    user?.fullName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || '?'

  /* ── Scroll detection: tighten island when scrolled ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Close expanded menu / user dropdown on outside click ── */
  useEffect(() => {
    const handleClick = (e) => {
      if (islandRef.current && !islandRef.current.contains(e.target)) {
        setExpanded(false)
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  /* ── Close everything on route change ── */
  useEffect(() => {
    setExpanded(false)
    setUserMenuOpen(false)
  }, [location])

  const handleLogout = async () => {
    setUserMenuOpen(false)
    setExpanded(false)
    await logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Backdrop overlay for mobile menu */}
      {expanded && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setExpanded(false)}
          style={{ animation: 'fadeIn 0.3s ease-out forwards' }}
        />
      )}
      
      {/* Floating island fixed to top-center */}
      <div className="fixed top-3 left-0 right-0 z-50 flex  justify-center pointer-events-none transition-all duration-500" style={{ padding: expanded ? '0' : '0 1rem' }}>
        <div
          ref={islandRef}
          className={`pointer-events-auto transition-all duration-500 ${expanded ? 'w-full' : 'w-full max-w-3xl'}`}
          style={{
            animation: 'islandIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 2.2) forwards',
          }}
        >
        <GlassEffect
          scrolled={scrolled}
          className={`transition-all duration-500 ${
            expanded
              ? 'rounded-none backdrop-blur-3xl bg-black/80 md:rounded-2xl'
              : 'rounded-full md:rounded-full'
          }`}
          style={{
            transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 2.2)',
          }}
        >
          {/* ── Collapsed pill (always visible) ── */}
          <div
            className={`relative flex items-center justify-between transition-all duration-500 ${
              expanded ? 'px-4 pt-3 pb-2 md:px-5 md:pt-4' : 'px-4 py-2 md:px-5 md:py-2.5'
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 2.2)' }}
          >
            {/* LEFT — Logo */}
            <Link to="/" className="shrink-0 transition-transform duration-300 hover:scale-105 z-10">
              <Logo />
            </Link>

            {/* CENTER — Nav links, absolutely centered so they're always in the true middle */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6">
              {/* <NavLink to="/" active={isActive('/')}>Home</NavLink> */}
              <NavLink to="/builder" active={isActive('/builder')}>Builder</NavLink>
              <NavLink to="/about" active={isActive('/about')}>About</NavLink>
            </div>

            {/* RIGHT — Auth section */}
            {isAuthenticated ? (
              <div className={`relative z-10 ${expanded ? 'hidden' : 'hidden md:block'}`} ref={userMenuRef}>
                <button
                  id="user-avatar-btn"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 group"
                  aria-label="User menu"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/20 group-hover:border-[#A6FF5D]/70 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#A6FF5D]/20 border border-[#A6FF5D]/40 group-hover:border-[#A6FF5D] flex items-center justify-center text-[#A6FF5D] font-semibold text-sm transition-all duration-300">
                      {userInitial}
                    </div>
                  )}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    className={`text-white/40 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User dropdown */}
                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-3 w-52 overflow-hidden z-50"
                    style={{ animation: 'islandIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 2.2) forwards' }}
                  >
                    <div className="bg-black/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
                      <div className="px-4 py-3 border-b border-white/20">
                        <p className="text-white font-semibold text-sm truncate">{user?.fullName}</p>
                        <p className="text-white/50 text-xs truncate">@{user?.username}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 text-sm transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </Link>
                        <Link
                          to="/builder"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 text-sm transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Resume Builder
                        </Link>
                        <button
                          id="logout-btn"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 z-10">
                <Link to="/signin">
                  <button
                    id="navbar-signin-btn"
                    className="text-white/70 hover:text-white text-sm font-medium px-3 py-1 rounded-full transition-all duration-300 hover:bg-white/10"
                  >
                    Sign In
                  </button>
                </Link>
                <Link to="/signup">
                  <button
                    id="navbar-signup-btn"
                    className="flex items-center gap-1.5 bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-gray-900 font-semibold text-sm px-3.5 py-1.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#A6FF5D]/30"
                  >
                    <SparkleIcon />
                    Get Started
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-toggle"
              className="md:hidden text-white/70 hover:text-white transition-colors ml-1"
              onClick={() => setExpanded((v) => !v)}
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className={`transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`}
              >
                {expanded ? (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </>
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </>
                )}
              </svg>
            </button>
          </div>

          {/* ── Mobile expanded panel ── */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-500 ${
              expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.175, 0.885, 0.32, 2.2)' }}
          >
            <div className="px-4 pb-4 pt-1 border-t border-white/10 max-h-[calc(100vh-120px)] overflow-y-auto">
              {/* Mobile links */}
              <div className="flex flex-col gap-1 mt-2">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/builder', label: 'Resume Builder' },
                  { to: '/about', label: 'About' },
                ].map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive(to)
                        ? 'bg-[#A6FF5D]/15 text-[#A6FF5D]'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {label}
                    {isActive(to) && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#A6FF5D]" />
                    )}
                  </Link>
                ))}
              </div>

              {/* Mobile auth buttons */}
              {isAuthenticated ? (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2.5 mb-3 px-1">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.fullName} className="w-10 h-10 rounded-full border border-[#A6FF5D]/40" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#A6FF5D]/20 border border-[#A6FF5D]/40 flex items-center justify-center text-[#A6FF5D] font-semibold text-sm">
                        {userInitial}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{user?.fullName}</p>
                      <p className="text-white/40 text-xs truncate">@{user?.username}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setExpanded(false)}
                    className="w-full flex items-center justify-center gap-2 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium py-2 rounded-xl transition-all duration-300 mb-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  <button
                    id="mobile-logout-btn"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-sm font-medium py-2 rounded-xl transition-all duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
                  <Link to="/signin">
                    <button
                      id="mobile-signin-btn"
                      className="w-full text-white/70 hover:text-white border border-white/50 hover:border-white/25 text-sm font-medium py-2 rounded-xl transition-all duration-300"
                    >
                      Sign In
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button
                      id="mobile-signup-btn"
                      className="w-full flex items-center justify-center gap-2 bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-gray-900 font-semibold text-sm py-2 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#A6FF5D]/30"
                    >
                      <SparkleIcon />
                      Get Started
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </GlassEffect>
        </div>
      </div>
    </>
  )
}

export default Navbar
