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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setExpanded(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Top navbar container */}
      <div className={`fixed z-50 left-0 right-0 pointer-events-none transition-all duration-300 ease-in-out ${
        scrolled || expanded ? 'top-2 sm:top-3 px-3 sm:px-4' : 'top-0 px-0'
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
          borderRadius={expanded ? 20 : scrolled ? 9999 : 0}
          brightness={0}
          opacity={1.0}
          blur={30}
          displace={0}
          backgroundOpacity={scrolled ? 0.9 : 0.75}
          saturation={1.2}
          distortionScale={0}
          redOffset={0}
          greenOffset={0}
          blueOffset={0}
          className={`transition-all duration-300 ease-in-out backdrop-blur-xl ${
            scrolled
              ? 'bg-black/90 shadow-2xl border border-zinc-800'
              : 'bg-zinc-900/80 border-b border-zinc-800/80'
          }`}
        >
          <div className="w-full flex flex-col">
            {/* ── Navbar content ── */}
            <div
              className={`relative flex items-center justify-between w-full h-full min-h-[56px] sm:min-h-[64px] transition-all duration-300 ease-in-out ${
                expanded 
                  ? 'px-4 sm:px-6 py-2.5 sm:py-3' 
                  : scrolled
                  ? 'px-4 sm:px-6 md:px-8 py-2.5 sm:py-3'
                  : 'px-4 sm:px-6 md:px-12 lg:px-16 py-3 sm:py-3.5'
              }`}
            >
              {/* LEFT — Logo */}
              <Link to="/" className="shrink-0 flex items-center transition-opacity duration-200 hover:opacity-80 z-10">
                <Logo />
              </Link>

              {/* CENTER — Nav links */}
              <div className="hidden md:flex items-center justify-center gap-6 lg:gap-8 transition-all duration-300 ease-in-out">
                <NavLink to="/builder" active={isActive('/builder')}>Builder</NavLink>
                <NavLink to="/templates" active={isActive('/templates')}>Templates</NavLink>
                <NavLink to="/ats-optimizer" active={isActive('/ats-optimizer')}>ATS Matcher</NavLink>
                <NavLink to="/about" active={isActive('/about')}>About</NavLink>
              </div>

              {/* RIGHT — Auth section & Controls */}
              <div className="flex items-center gap-2 z-10">
                {isAuthenticated ? (
                  <>
                    {/* Desktop User Menu Button */}
                    <div className="relative hidden md:flex items-center" ref={userMenuRef}>
                      <button
                        id="user-avatar-btn"
                        onClick={() => setUserMenuOpen((v) => !v)}
                        className="flex items-center justify-center gap-2.5 px-2.5 py-1 rounded-full group hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-200 hover:scale-[1.03] active:scale-95"
                        aria-label="User menu"
                      >
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.fullName}
                            className="w-8 h-8 rounded-full object-cover border border-white/20 group-hover:border-[#A6FF5D] group-hover:shadow-[0_0_12px_rgba(166,255,93,0.35)] transition-all duration-200 shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#A6FF5D]/20 border border-[#A6FF5D]/40 group-hover:border-[#A6FF5D] group-hover:shadow-[0_0_12px_rgba(166,255,93,0.35)] flex items-center justify-center text-[#A6FF5D] font-semibold text-sm transition-all duration-200 shrink-0">
                            {userInitial}
                          </div>
                        )}
                        <span className="text-white/80 group-hover:text-[#A6FF5D] text-sm font-medium leading-none flex items-center transition-colors duration-200 max-w-[140px] truncate">
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
                          className={`shrink-0 text-white/40 group-hover:text-[#A6FF5D] transition-all duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {/* Mobile Quick Profile Access Avatar */}
                    <Link
                      to="/profile"
                      className="md:hidden flex items-center justify-center p-0.5 rounded-full border border-[#A6FF5D]/40 active:scale-95 transition-transform"
                      aria-label="Profile"
                    >
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.fullName} className="w-7 h-7 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#A6FF5D]/20 flex items-center justify-center text-[#A6FF5D] font-bold text-xs shrink-0">
                          {userInitial}
                        </div>
                      )}
                    </Link>
                  </>
                ) : (
                  <div className="hidden md:flex items-center gap-3">
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

                {/* Mobile Hamburger Button */}
                <button
                  id="mobile-menu-toggle"
                  className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 text-white/80 hover:text-white transition-all border border-white/10 ml-0.5"
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
                    className={`transition-transform duration-300 ${expanded ? 'rotate-90 text-[#A6FF5D]' : ''}`}
                  >
                    {expanded ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* ── Mobile expanded panel ── */}
            <div
              className={`md:hidden w-full overflow-hidden transition-all duration-300 ease-in-out ${
                expanded ? 'max-h-[85vh] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-4 pb-5 pt-2 border-t border-white/10 max-h-[75vh] overflow-y-auto space-y-4 w-full">
                {/* Navigation Links */}
                <div className="flex flex-col gap-1.5 pt-1 w-full">
                  {[
                    { to: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                    { to: '/builder', label: 'Resume Builder', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
                    { to: '/templates', label: 'Templates', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
                    { to: '/ats-optimizer', label: 'ATS Matcher', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { to: '/about', label: 'About', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                  ].map(({ to, label, icon }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setExpanded(false)}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] w-full ${
                        isActive(to)
                          ? 'bg-[#A6FF5D]/15 text-[#A6FF5D] border border-[#A6FF5D]/30 font-semibold'
                          : 'text-white/80 hover:text-white hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                      </svg>
                      <span className="flex-1">{label}</span>
                      {isActive(to) && (
                        <span className="w-2 h-2 rounded-full bg-[#A6FF5D] shadow-[0_0_8px_#A6FF5D]" />
                      )}
                    </Link>
                  ))}
                </div>

                {/* Mobile auth section */}
                {isAuthenticated ? (
                  <div className="pt-3 border-t border-white/10 space-y-3 w-full">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 w-full">
                      {user?.avatar ? (
                        <img src={user.avatar} alt={user.fullName} className="w-10 h-10 rounded-full border border-[#A6FF5D]/50 object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#A6FF5D]/20 border border-[#A6FF5D]/40 flex items-center justify-center text-[#A6FF5D] font-bold text-sm shrink-0">
                          {userInitial}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-white text-sm font-semibold truncate">{user?.fullName || 'User'}</p>
                        <p className="text-white/50 text-xs truncate">{user?.email || ''}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Link
                        to="/profile"
                        onClick={() => setExpanded(false)}
                        className="flex items-center justify-center gap-2 text-white/90 bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-medium py-2.5 px-3 rounded-xl transition-all active:scale-[0.98]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      <button
                        id="mobile-logout-btn"
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 text-red-400 bg-red-500/15 hover:bg-red-500/20 border border-red-500/30 text-sm font-medium py-2.5 px-3 rounded-xl transition-all active:scale-[0.98]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5 w-full">
                    <Link to="/signin" onClick={() => setExpanded(false)}>
                      <button
                        id="mobile-signin-btn"
                        className="w-full text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 text-sm font-medium py-2.5 rounded-xl transition-all active:scale-[0.98]"
                      >
                        Sign In
                      </button>
                    </Link>
                    <Link to="/signup" onClick={() => setExpanded(false)}>
                      <button
                        id="mobile-signup-btn"
                        className="w-full flex items-center justify-center gap-2 bg-[#A6FF5D] hover:bg-[#b8ff7a] text-gray-950 font-bold text-sm py-2.5 rounded-xl shadow-[0_0_15px_rgba(166,255,93,0.3)] transition-all active:scale-[0.98]"
                      >
                        <SparkleIcon />
                        Get Started
                      </button>
                    </Link>
                  </div>
                )}
              </div>
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
