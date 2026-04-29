import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Builder from './pages/Builder'
import About from './pages/About'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App
