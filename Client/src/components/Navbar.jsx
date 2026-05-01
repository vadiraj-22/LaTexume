import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => setMenuOpen(!menuOpen)
  const closeMenu = () => setMenuOpen(false)

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [menuOpen])

  // Close menu on route change
  useEffect(() => {
    closeMenu()
  }, [location])

  return (
    <>
      <nav className="flex flex-col items-center w-full animate-fade-in-down relative z-50">
        <div className="flex items-center justify-between p-4 md:px-16 lg:px-24 xl:px-32 md:py-4 w-full">
          <Link to="/" className="transition-transform duration-300 hover:scale-105">
            <Logo />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link
              to="/"
              className="menu-item text-white/70 hover:text-white transition-smooth hover:scale-105"
            >
              Home
            </Link>
            <Link
              to="/builder"
              className="menu-item text-white/70 hover:text-white transition-smooth hover:scale-105"
            >
              Resume Builder
            </Link>
            <Link
              to="/about"
              className="menu-item text-white/70 hover:text-white transition-smooth hover:scale-105 mr-6"
            >
              About
            </Link>

            <div className="p-[0.5px] rounded-full bg-gradient-to-r from-white to-[#999999]/0">
              <Link to="/builder">
                <button className="flex items-center gap-2 bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-gray-800 font-medium px-4 py-2.5 rounded-full text-sm transition-smooth cursor-pointer group hover:scale-105 hover:shadow-lg hover:shadow-[#A6FF5D]/30">
                  <svg
                    width="14"
                    height="15"
                    viewBox="0 0 14 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.795.605v2.593m1.245-1.296h-2.488M1.845 13.565c.687 0 1.244-.58 1.244-1.296s-.557-1.296-1.244-1.296-1.244.58-1.244 1.296.557 1.296 1.244 1.296M6.209 1.13a.65.65 0 0 1 .214-.379.61.61 0 0 1 .795 0 .66.66 0 0 1 .214.38l.653 3.601c.047.256.166.492.343.676s.403.309.649.357l3.456.681a.62.62 0 0 1 .364.223.665.665 0 0 1 0 .828.62.62 0 0 1-.364.223l-3.456.681a1.23 1.23 0 0 0-.65.358c-.176.184-.295.42-.342.675l-.653 3.602a.65.65 0 0 1-.214.38.61.61 0 0 1-.795 0 .65.65 0 0 1-.214-.38l-.654-3.602a1.3 1.3 0 0 0-.342-.675 1.23 1.23 0 0 0-.649-.358l-3.456-.68a.62.62 0 0 1-.365-.224.665.665 0 0 1 0-.828.62.62 0 0 1 .365-.223l3.456-.68c.246-.05.472-.174.649-.358s.296-.42.342-.676z"
                      stroke="#1e2939"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="relative overflow-hidden">
                    <span className="block transition-transform duration-200 group-hover:-translate-y-full">
                      Get Started
                    </span>
                    <span className="absolute top-0 left-0 block transition-transform duration-200 group-hover:translate-y-0 translate-y-full">
                      Get Started
                    </span>
                  </div>
                </button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden bg-gray-900 hover:bg-gray-800 text-gray-50 p-2.5 rounded-lg font-medium transition-smooth hover:scale-105 z-50"
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-300 ${menuOpen ? 'rotate-90' : ''}`}
            >
              <path d="M4 12h16" />
              <path d="M4 18h16" />
              <path d="M4 6h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ${
          menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={closeMenu}
      />

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full bg-gray-950 z-40 md:hidden transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <Link to="/" onClick={closeMenu}>
              <Logo />
            </Link>
            <button
              onClick={closeMenu}
              className="bg-gray-900 hover:bg-gray-800 text-white p-2.5 rounded-lg transition-smooth"
              aria-label="Close menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Sidebar Menu Items */}
          <div className="flex-1 overflow-y-auto py-6">
            <div className="flex flex-col space-y-2 px-4">
              <Link
                to="/"
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                  location.pathname === '/'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-white/80 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>

              <Link
                to="/builder"
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                  location.pathname === '/builder'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-white/80 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Resume Builder
              </Link>

              <Link
                to="/about"
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                  location.pathname === '/about'
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-white/80 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About
              </Link>
            </div>
          </div>

          {/* Sidebar Footer with CTA */}
          <div className="p-4 border-t border-white/10">
            <Link to="/builder" onClick={closeMenu}>
              <button className="w-full flex items-center justify-center gap-2 bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-gray-800 font-semibold px-6 py-4 rounded-xl text-lg transition-smooth hover:scale-[1.02] hover:shadow-lg hover:shadow-[#A6FF5D]/30">
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 14 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.795.605v2.593m1.245-1.296h-2.488M1.845 13.565c.687 0 1.244-.58 1.244-1.296s-.557-1.296-1.244-1.296-1.244.58-1.244 1.296.557 1.296 1.244 1.296M6.209 1.13a.65.65 0 0 1 .214-.379.61.61 0 0 1 .795 0 .66.66 0 0 1 .214.38l.653 3.601c.047.256.166.492.343.676s.403.309.649.357l3.456.681a.62.62 0 0 1 .364.223.665.665 0 0 1 0 .828.62.62 0 0 1-.364.223l-3.456.681a1.23 1.23 0 0 0-.65.358c-.176.184-.295.42-.342.675l-.653 3.602a.65.65 0 0 1-.214.38.61.61 0 0 1-.795 0 .65.65 0 0 1-.214-.38l-.654-3.602a1.3 1.3 0 0 0-.342-.675 1.23 1.23 0 0 0-.649-.358l-3.456-.68a.62.62 0 0 1-.365-.224.665.665 0 0 1 0-.828.62.62 0 0 1 .365-.223l3.456-.68c.246-.05.472-.174.649-.358s.296-.42.342-.676z"
                    stroke="#1e2939"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Get Started
              </button>
            </Link>
            <p className="text-center text-white/50 text-xs mt-3">
              LaTeX-Powered • ATS-Optimized
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
