import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Home from './pages/Home'
import Builder from './pages/Builder'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Templates from './pages/Templates'
import AtsOptimizer from './pages/AtsOptimizer'
import PublicResume from './pages/PublicResume'

import LineWaves from './components/LineWaves'

/** Redirects unauthenticated users to /signin, preserving the intended destination */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin w-10 h-10 text-[#A6FF5D]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-white/50 text-sm">Loading…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="relative min-h-screen bg-black text-white selection:bg-[#A6FF5D] selection:text-black">
          {/* Global LineWaves Background */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <LineWaves
              speed={0.4}
              innerLineCount={32}
              outerLineCount={36}
              warpIntensity={1.0}
              rotation={16}
              edgeFadeWidth={0.0}
              colorCycleSpeed={0.8}
              brightness={0.15}
              color1="#A6FF5D"
              color2="#064e3b"
              color3="#0f172a"
              enableMouseInteraction={true}
              mouseInfluence={1.2}
            />
            {/* Subtle dark backdrop overlay to ensure crisp text contrast */}
            <div className="absolute inset-0 bg-black/35 pointer-events-none" />
          </div>

          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/r/:id" element={<PublicResume />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Protected: requires authentication */}
              <Route
                path="/templates"
                element={
                  <ProtectedRoute>
                    <Templates />
                  </ProtectedRoute>
                }
              />

              {/* Protected: requires authentication */}
              <Route
                path="/builder"
                element={
                  <ProtectedRoute>
                    <Builder />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ats-optimizer"
                element={
                  <ProtectedRoute>
                    <AtsOptimizer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
