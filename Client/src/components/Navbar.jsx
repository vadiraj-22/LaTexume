import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import GlassSurface from './ui/GlassSurface'

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
    className={`relative text-sm font-medium transition-colors duration-200 px-1 py-0.5 group ${
      active ? 'text-white font-semibold' : 'text-white/70 hover:text-white'
    }`}
  >
    {children}
    <span
      className={`absolute -bottom-0.5 left-0 h-[2px] bg-[#A6FF5D] rounded-full transition-all duration-200 ${
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
    const onScroll = () => setScrolled(window.scrollY > 50)
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

  /* ── Scroll lock body when mobile menu is expanded ── */
  useEffect(() => {
    if (expanded && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [expanded])

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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-200"
          onClick={() => setExpanded(false)}
        />
      )}
      
      {/* Top navbar container */}
      <div className={`fixed z-50 left-0 right-0 pointer-events-none transition-all duration-300 ease-in-out ${
        scrolled ? 'top-3 px-4' : 'top-0 px-0'
      }`}>
        <div
          ref={islandRef}
          className={`pointer-events-auto mx-auto transition-all duration-300 ease-in-out ${
            scrolled && !expanded 
              ? 'max-w-6xl w-full' 
              : 'w-full'
          }`}
        >
        <GlassSurface
          width="100%"
          height="auto"
          borderRadius={expanded ? 16 : scrolled ? 9999 : 0}
          brightness={scrolled ? 0 : 45}
          opacity={1.0}
          blur={20}
          displace={scrolled ? 0 : 12}
          backgroundOpacity={scrolled ? 1.0 : 0.2}
          saturation={1.0}
          distortionScale={scrolled ? 0 : -120}
          redOffset={0}
          greenOffset={0}
          blueOffset={0}
          className={`transition-all duration-300 ease-in-out ${scrolled ? 'bg-black shadow-2xl border border-zinc-800' : ''}`}
        >
          {/* ── Navbar content ── */}
          <div
            className={`relative flex items-center transition-all duration-300 ease-in-out ${
              expanded 
                ? 'justify-between px-5 py-3' 
                : scrolled
                ? 'justify-between px-8 py-3'
                : 'justify-between px-8 md:px-12 lg:px-16 py-4'
            }`}
          >
            {/* LEFT — Logo */}
            <Link to="/" className="shrink-0 transition-opacity duration-200 hover:opacity-80 z-10">
              <Logo />
            </Link>

            {/* CENTER — Nav links */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8 transition-all duration-300 ease-in-out">
              <NavLink to="/builder" active={isActive('/builder')}>Builder</NavLink>
              <NavLink to="/templates" active={isActive('/templates')}>Templates</NavLink>
              <NavLink to="/ats-optimizer" active={isActive('/ats-optimizer')}>ATS Matcher</NavLink>
              <NavLink to="/about" active={isActive('/about')}>About</NavLink>
            </div>

            {/* RIGHT — Auth section */}
            {isAuthenticated ? (
              <div className={`relative z-10 ${expanded ? 'hidden' : 'hidden md:block'}`} ref={userMenuRef}>
                <button
                  id="user-avatar-btn"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2.5 px-2.5 py-1 rounded-full group hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-200 hover:scale-[1.03] active:scale-95"
                  aria-label="User menu"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full object-cover border border-white/20 group-hover:border-[#A6FF5D] group-hover:shadow-[0_0_12px_rgba(166,255,93,0.35)] transition-all duration-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#A6FF5D]/20 border border-[#A6FF5D]/40 group-hover:border-[#A6FF5D] group-hover:shadow-[0_0_12px_rgba(166,255,93,0.35)] flex items-center justify-center text-[#A6FF5D] font-semibold text-sm transition-all duration-200">
                      {userInitial}
                    </div>
                  )}
                  <span className="text-white/80 group-hover:text-[#A6FF5D] text-sm font-medium transition-colors duration-200 max-w-[140px] truncate">
                    {user?.fullName || 'User'}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    className={`text-white/40 group-hover:text-[#A6FF5D] transition-all duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3 z-10">
                <Link to="/signin">
                  <button
                    id="navbar-signin-btn"
                    className="text-white/70 hover:text-white text-sm font-medium px-3.5 py-1.5 rounded-full transition-colors duration-200 hover:bg-white/10"
                  >
                    Sign In
                  </button>
                </Link>
                <Link to="/signup">
                  <button
                    id="navbar-signup-btn"
                    className="flex items-center gap-1.5 bg-[#A6FF5D] hover:bg-[#b8ff7a] text-gray-950 font-semibold text-sm px-4 py-1.5 rounded-full transition-colors duration-200"
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
                className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}
              >
                {expanded ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* ── Mobile expanded panel ── */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-200 ${
              expanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="px-4 pb-4 pt-1 border-t border-white/10 max-h-[calc(100vh-120px)] overflow-y-auto">
              {/* Mobile links */}
              <div className="flex flex-col gap-1 mt-2">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/builder', label: 'Resume Builder' },
                  { to: '/templates', label: 'Templates' },
                  { to: '/ats-optimizer', label: 'ATS Matcher' },
                  { to: '/about', label: 'About' },
                ].map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 ${
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
                      <p className="text-white/40 text-xs truncate">{user?.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setExpanded(false)}
                    className="w-full flex items-center justify-center gap-2 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium py-2 rounded-xl transition-colors duration-200 mb-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  <button
                    id="mobile-logout-btn"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 text-sm font-medium py-2 rounded-xl transition-colors duration-200"
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
                      className="w-full text-white/70 hover:text-white border border-white/20 hover:border-white/40 text-sm font-medium py-2 rounded-xl transition-colors duration-200"
                    >
                      Sign In
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button
                      id="mobile-signup-btn"
                      className="w-full flex items-center justify-center gap-2 bg-[#A6FF5D] hover:bg-[#b8ff7a] text-gray-950 font-semibold text-sm py-2 rounded-xl transition-colors duration-200"
                    >
                      <SparkleIcon />
                      Get Started
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </GlassSurface>

        {/* User Profile Dropdown Floating Outside GlassSurface */}
        {userMenuOpen && isAuthenticated && (
          <div className="absolute right-4 md:right-16 lg:right-24 top-full mt-2 w-56 overflow-hidden z-50 transition-all duration-150 animate-fade-in-down">
            <div className="bg-black/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-1">
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-white font-bold text-sm truncate">{user?.fullName}</p>
                <p className="text-white/50 text-xs truncate">{user?.email}</p>
              </div>
              <div className="py-1 space-y-0.5">
                <Link
                  to="/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium rounded-xl transition-colors duration-150"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
                <Link
                  to="/builder"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium rounded-xl transition-colors duration-150"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Resume Builder
                </Link>
                <button
                  id="logout-btn"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm font-medium rounded-xl transition-colors duration-150 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  )
}

export default Navbar
