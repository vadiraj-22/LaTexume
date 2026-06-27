import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  const userMenuRef = useRef(null)

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const closeMenu = () => setMenuOpen(false)

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [menuOpen])

  // Close menu on route change
  useEffect(() => { closeMenu() }, [location])

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setUserMenuOpen(false)
    closeMenu()
    await logout()
    navigate('/')
  }

  const userInitial = user?.fullName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || '?'

  return (
    <>
      <nav className="flex flex-col items-center w-full animate-fade-in-down relative z-50">
        <div className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-4 w-full">
          <Link to="/" className="transition-transform duration-300 hover:scale-105">
            <Logo />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link to="/" className="menu-item text-white/70 hover:text-white transition-smooth hover:scale-105">
              Home
            </Link>
            <Link to="/builder" className="menu-item text-white/70 hover:text-white transition-smooth hover:scale-105">
              Resume Builder
            </Link>
            <Link to="/about" className="menu-item text-white/70 hover:text-white transition-smooth hover:scale-105 mr-6">
              About
            </Link>

            {isAuthenticated ? (
              /* User avatar + dropdown */
              <div className="relative" ref={userMenuRef}>
                <button
                  id="user-menu-btn"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 group"
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.fullName}
                      className="w-9 h-9 rounded-full object-cover border-2 border-white/20 group-hover:border-[#A6FF5D]/60 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#A6FF5D]/20 border-2 border-[#A6FF5D]/40 group-hover:border-[#A6FF5D] flex items-center justify-center text-[#A6FF5D] font-semibold text-sm transition-all duration-300">
                      {userInitial}
                    </div>
                  )}
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    className={`text-white/40 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-gray-950 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-scale-in z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-white font-medium text-sm truncate">{user?.fullName}</p>
                      <p className="text-white/40 text-xs truncate">@{user?.username}</p>
                    </div>
                    <div className="py-1">
                      <Link to="/builder" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 text-sm transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Resume Builder
                      </Link>
                      <button id="logout-btn" onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/5 text-sm transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Auth buttons */
              <div className="flex items-center gap-3">
                <Link to="/signin">
                  <button id="navbar-signin-btn" className="text-white/70 hover:text-white font-medium px-4 py-2 rounded-full text-sm transition-smooth hover:scale-105">
                    Sign In
                  </button>
                </Link>
                <div className="p-[0.5px] rounded-full bg-gradient-to-r from-white to-[#999999]/0">
                  <Link to="/signup">
                    <button id="navbar-signup-btn" className="flex items-center gap-2 bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-gray-800 font-medium px-4 py-2.5 rounded-full text-sm transition-smooth cursor-pointer group hover:scale-105 hover:shadow-lg hover:shadow-[#A6FF5D]/30">
                      <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.795.605v2.593m1.245-1.296h-2.488M1.845 13.565c.687 0 1.244-.58 1.244-1.296s-.557-1.296-1.244-1.296-1.244.58-1.244 1.296.557 1.296 1.244 1.296M6.209 1.13a.65.65 0 0 1 .214-.379.61.61 0 0 1 .795 0 .66.66 0 0 1 .214.38l.653 3.601c.047.256.166.492.343.676s.403.309.649.357l3.456.681a.62.62 0 0 1 .364.223.665.665 0 0 1 0 .828.62.62 0 0 1-.364.223l-3.456.681a1.23 1.23 0 0 0-.65.358c-.176.184-.295.42-.342.675l-.653 3.602a.65.65 0 0 1-.214.38.61.61 0 0 1-.795 0 .65.65 0 0 1-.214-.38l-.654-3.602a1.3 1.3 0 0 0-.342-.675 1.23 1.23 0 0 0-.649-.358l-3.456-.68a.62.62 0 0 1-.365-.224.665.665 0 0 1 0-.828.62.62 0 0 1 .365-.223l3.456-.68c.246-.05.472-.174.649-.358s.296-.42.342-.676z"
                          stroke="#1e2939" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="relative overflow-hidden">
                        <span className="block transition-transform duration-200 group-hover:-translate-y-full">Get Started</span>
                        <span className="absolute top-0 left-0 block transition-transform duration-200 group-hover:translate-y-0 translate-y-full">Get Started</span>
                      </div>
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu}
            className="md:hidden bg-gray-900 hover:bg-gray-800 text-gray-50 p-2.5 rounded-lg font-medium transition-smooth hover:scale-105 z-50"
            aria-label="Toggle menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className={`transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`}>
              <path d="M4 12h16" />
              <path d="M4 18h16" />
              <path d="M4 6h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={closeMenu}
      />

      {/* Mobile Sidebar Menu */}
      <div className={`fixed top-0 right-0 h-full w-full bg-gray-950 z-40 md:hidden transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <Link to="/" onClick={closeMenu}><Logo /></Link>
            <button onClick={closeMenu}
              className="bg-gray-900 hover:bg-gray-800 text-white p-2.5 rounded-lg transition-smooth"
              aria-label="Close menu">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* User info strip (if logged in) */}
          {isAuthenticated && (
            <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10 bg-white/[0.02]">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="w-10 h-10 rounded-full object-cover border-2 border-[#A6FF5D]/40" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#A6FF5D]/20 border-2 border-[#A6FF5D]/40 flex items-center justify-center text-[#A6FF5D] font-semibold">
                  {userInitial}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-white font-medium text-sm truncate">{user?.fullName}</p>
                <p className="text-white/40 text-xs truncate">@{user?.username}</p>
              </div>
            </div>
          )}

          {/* Sidebar Menu Items */}
          <div className="flex-1 overflow-y-auto py-6">
            <div className="flex flex-col space-y-2 px-4">
              {[
                { to: '/', label: 'Home', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
                { to: '/builder', label: 'Resume Builder', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /> },
                { to: '/about', label: 'About', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
              ].map(({ to, label, icon }) => (
                <Link key={to} to={to} onClick={closeMenu}
                  className={`flex items-center gap-3 px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${location.pathname === to ? 'bg-primary/20 text-primary border border-primary/30' : 'text-white/80 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-white/10 space-y-3">
            {isAuthenticated ? (
              <button id="mobile-logout-btn" onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold px-6 py-4 rounded-xl text-lg transition-smooth">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            ) : (
              <>
                <Link to="/signin" onClick={closeMenu}>
                  <button id="mobile-signin-btn" className="w-full flex items-center justify-center border border-white/10 hover:border-white/20 text-white/70 hover:text-white font-semibold px-6 py-4 rounded-xl text-lg transition-smooth">
                    Sign In
                  </button>
                </Link>
                <Link to="/signup" onClick={closeMenu}>
                  <button id="mobile-signup-btn" className="w-full flex items-center justify-center gap-2 bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-gray-800 font-semibold px-6 py-4 rounded-xl text-lg transition-smooth hover:scale-[1.02] hover:shadow-lg hover:shadow-[#A6FF5D]/30">
                    <svg width="16" height="17" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.795.605v2.593m1.245-1.296h-2.488M1.845 13.565c.687 0 1.244-.58 1.244-1.296s-.557-1.296-1.244-1.296-1.244.58-1.244 1.296.557 1.296 1.244 1.296M6.209 1.13a.65.65 0 0 1 .214-.379.61.61 0 0 1 .795 0 .66.66 0 0 1 .214.38l.653 3.601c.047.256.166.492.343.676s.403.309.649.357l3.456.681a.62.62 0 0 1 .364.223.665.665 0 0 1 0 .828.62.62 0 0 1-.364.223l-3.456.681a1.23 1.23 0 0 0-.65.358c-.176.184-.295.42-.342.675l-.653 3.602a.65.65 0 0 1-.214.38.61.61 0 0 1-.795 0 .65.65 0 0 1-.214-.38l-.654-3.602a1.3 1.3 0 0 0-.342-.675 1.23 1.23 0 0 0-.649-.358l-3.456-.68a.62.62 0 0 1-.365-.224.665.665 0 0 1 0-.828.62.62 0 0 1 .365-.223l3.456-.68c.246-.05.472-.174.649-.358s.296-.42.342-.676z"
                        stroke="#1e2939" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Get Started
                  </button>
                </Link>
              </>
            )}
            <p className="text-center text-white/50 text-xs mt-1">LaTeX-Powered • ATS-Optimized</p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
