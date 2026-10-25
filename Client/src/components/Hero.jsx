import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const HERO_TEMPLATES = {
  jake: {
    id: 'jake',
    name: "Jake's Clean",
    fileName: 'jake_resume.tex',
    score: '99%',
    accentColor: '#A6FF5D',
    borderActive: 'border-[#A6FF5D] text-[#A6FF5D]',
    badgeBg: 'bg-[#A6FF5D] text-black',
    glowColor: 'bg-[#A6FF5D]/15',
    topBarColor: 'bg-[#A6FF5D]',
    badgeText: '⚡ Live Render',
    tags: ['Monochrome ATS', 'Single-Column', 'SWE & DevOps'],
    description: 'Clean single-column monochrome trusted by top software engineers.',
  },
  blueAccent: {
    id: 'blueAccent',
    name: 'Blue Accent',
    fileName: 'blue_accent.tex',
    score: '98%',
    accentColor: '#60a5fa',
    borderActive: 'border-blue-400 text-blue-400',
    badgeBg: 'bg-blue-400 text-black',
    glowColor: 'bg-blue-500/15',
    topBarColor: 'bg-blue-500',
    badgeText: '🔷 Royal Blue',
    tags: ['Royal Blue Headers', 'Modern Hierarchy', 'Fullstack & Cloud'],
    description: 'Vibrant blue headers for clean visual hierarchy and 100% ATS parse.',
  },
  classic: {
    id: 'classic',
    name: 'Executive Serif',
    fileName: 'classic_serif.tex',
    score: '97%',
    accentColor: '#fbbf24',
    borderActive: 'border-amber-400 text-amber-400',
    badgeBg: 'bg-amber-400 text-black',
    glowColor: 'bg-amber-500/15',
    topBarColor: 'bg-amber-500',
    badgeText: '📜 Charter Serif',
    tags: ['Charter Serif', 'Executive Spacing', 'Senior Leads'],
    description: 'Traditional serif typography designed for senior engineering leads and managers.',
  },
}

const Hero = () => {
  const [activeTemplateId, setActiveTemplateId] = useState('jake')
  const current = HERO_TEMPLATES[activeTemplateId] || HERO_TEMPLATES.jake

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-10 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* LEFT COLUMN: Left-Aligned Headline & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-7 sm:space-y-8 animate-fade-in-up">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-zinc-900/90 border border-zinc-800 backdrop-blur-md shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A6FF5D] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A6FF5D]"></span>
            </span>
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
              100% ATS-Optimized • Jake's LaTeX Template
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px]/[58px] font-extrabold text-white tracking-tight leading-[1.18] sm:leading-[1.14] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            LaTeX-powered resumes that pass ATS &amp; get you hired.
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-zinc-200 max-w-xl font-medium leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            Build recruiter-approved software engineering resumes using Jake's Resume LaTeX template. 
            Instant online compilation, real-time ATS match scoring, and zero LaTeX knowledge required.
          </p>

          {/* Action Group: Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-4.5 pt-4 sm:pt-5 w-full sm:w-auto">
            <Link to="/builder" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-[#A6FF5D] hover:bg-[#b8ff7a] text-black px-7 py-3.5 rounded-full text-sm sm:text-base font-extrabold transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-[#A6FF5D]/25 cursor-pointer border border-[#A6FF5D] flex items-center justify-center gap-2">
                <span>Build Resume Now</span>
                <span className="text-base">→</span>
              </button>
            </Link>

            <Link to="/templates" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-base text-zinc-200 hover:text-white rounded-full border border-zinc-800 hover:border-zinc-700 bg-zinc-950/80 cursor-pointer hover:scale-105 transition-all duration-200 whitespace-nowrap font-semibold flex items-center justify-center gap-2">
                <span>Browse Templates</span>
              </button>
            </Link>

            <Link to="/ats-optimizer" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-3.5 text-sm sm:text-base text-zinc-200 hover:text-white rounded-full border border-zinc-800 hover:border-zinc-700 bg-zinc-950/80 cursor-pointer hover:scale-105 transition-all duration-200 whitespace-nowrap font-semibold flex items-center justify-center gap-2">
                <span>ATS Matcher</span>
              </button>
            </Link>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-7 sm:pt-8 mt-6 sm:mt-8 border-t border-zinc-800/80 w-full max-w-lg text-left">
            <div>
              <span className="block text-xl sm:text-2xl md:text-3xl font-extrabold text-white drop-shadow">99/100</span>
              <span className="block text-xs sm:text-sm text-zinc-300 font-medium mt-0.5 drop-shadow">ATS Match Rate</span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl md:text-3xl font-extrabold text-[#A6FF5D] drop-shadow">0.4s</span>
              <span className="block text-xs sm:text-sm text-zinc-300 font-medium mt-0.5 drop-shadow">PDF Compilation</span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl md:text-3xl font-extrabold text-white drop-shadow">100%</span>
              <span className="block text-xs sm:text-sm text-zinc-300 font-medium mt-0.5 drop-shadow">Free &amp; Open Source</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Visual Mockup Card */}
        <div className="lg:col-span-5 relative w-full flex flex-col items-center justify-center animate-fade-in mt-16 sm:mt-20 lg:mt-0">
          
          {/* Subtle Glow background (dynamic hue) */}
          <div className={`absolute -inset-4 ${current.glowColor} rounded-3xl blur-3xl pointer-events-none transition-all duration-500`} />

          {/* Interactive Template Selector Pills directly above mockup */}
          <div className="relative z-10 flex items-center gap-1.5 p-1 bg-zinc-950/90 border border-zinc-800/90 rounded-2xl backdrop-blur-xl mb-3 shadow-xl w-full max-w-sm sm:max-w-[400px]">
            {Object.values(HERO_TEMPLATES).map((t) => {
              const isSelected = activeTemplateId === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTemplateId(t.id)}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer text-center ${
                    isSelected
                      ? 'bg-zinc-800 text-white shadow-md border border-zinc-700'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <span className="truncate block">{t.name}</span>
                </button>
              )
            })}
          </div>

          {/* Dark Glass Feature Mockup Card */}
          <div className="relative w-full max-w-sm sm:max-w-[400px] bg-zinc-950/90 border border-zinc-800/90 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-xl transition-all duration-300">
            {/* Header bar of mockup */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="text-[11px] text-zinc-400 font-mono ml-2 transition-all">
                  {current.fileName}
                </span>
              </div>
              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow transition-all duration-300 ${current.badgeBg}`}>
                {current.badgeText}
              </span>
            </div>

            {/* Document Screenshot Mockup with dynamic accent header bar */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl border border-zinc-300 relative group">
              <div className={`h-1.5 w-full ${current.topBarColor} transition-colors duration-300`} />
              <img 
                src="/myresume.png" 
                alt={`${current.name} LaTeX Resume Preview`}
                className="w-full h-auto object-cover block rounded-b-2xl transition-all duration-300"
              />
            </div>

            {/* Template Feature Pills */}
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {current.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Live Indicator & Quick Action Footer */}
            <div className="mt-3.5 pt-3 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#A6FF5D] animate-pulse" />
                <span>ATS: <strong className="text-white">{current.score} Match</strong></span>
              </div>
              <Link
                to={`/builder?template=${current.id}`}
                className="text-[11px] font-extrabold text-[#A6FF5D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Use Style →</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Hero
