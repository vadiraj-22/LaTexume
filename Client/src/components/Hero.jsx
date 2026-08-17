import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 py-10 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        
        {/* LEFT COLUMN: Left-Aligned Headline & Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6 animate-fade-in-up">
          
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
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[58px]/[68px] font-extrabold text-white tracking-tight leading-[1.1]">
            LaTeX-powered resumes that pass ATS &amp; get you hired.
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl font-normal leading-relaxed">
            Build recruiter-approved software engineering resumes using Jake's Resume LaTeX template. 
            Instant online compilation, real-time ATS match scoring, and zero LaTeX knowledge required.
          </p>

          {/* Action Group: Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2 w-full sm:w-auto">
            <Link to="/builder" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-[#A6FF5D] hover:bg-[#b8ff7a] text-black px-7 py-3.5 rounded-full text-sm font-extrabold transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-[#A6FF5D]/25 cursor-pointer border border-[#A6FF5D] flex items-center justify-center gap-2">
                <span>Build Resume Now</span>
                <span className="text-base">→</span>
              </button>
            </Link>

            <Link to="/templates" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-3.5 text-sm text-zinc-200 hover:text-white rounded-full border border-zinc-800 hover:border-zinc-700 bg-zinc-950/80 cursor-pointer hover:scale-105 transition-all duration-200 whitespace-nowrap font-semibold flex items-center justify-center gap-2">
                <span>Browse Templates</span>
              </button>
            </Link>

            <Link to="/ats-optimizer" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-3.5 text-sm text-zinc-200 hover:text-white rounded-full border border-zinc-800 hover:border-zinc-700 bg-zinc-950/80 cursor-pointer hover:scale-105 transition-all duration-200 whitespace-nowrap font-semibold flex items-center justify-center gap-2">
                <span>ATS Matcher</span>
              </button>
            </Link>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-zinc-900 w-full max-w-lg text-left">
            <div>
              <span className="block text-xl sm:text-2xl font-extrabold text-white">99/100</span>
              <span className="block text-xs text-zinc-500 font-medium mt-0.5">ATS Match Rate</span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-extrabold text-[#A6FF5D]">0.4s</span>
              <span className="block text-xs text-zinc-500 font-medium mt-0.5">PDF Compilation</span>
            </div>
            <div>
              <span className="block text-xl sm:text-2xl font-extrabold text-white">100%</span>
              <span className="block text-xs text-zinc-500 font-medium mt-0.5">Free &amp; Open Source</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Modern Visual Mockup Card */}
        <div className="lg:col-span-5 relative w-full flex items-center justify-center animate-fade-in mt-6 lg:mt-0">
          
          {/* Subtle Glow background */}
          <div className="absolute -inset-4 bg-[#A6FF5D]/10 rounded-3xl blur-3xl pointer-events-none" />

          {/* Dark Glass Feature Mockup Card */}
          <div className="relative w-full max-w-md bg-zinc-950/90 border border-zinc-800/90 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
            {/* Header bar of mockup */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="text-[11px] text-zinc-400 font-mono ml-2">jake_resume.tex</span>
              </div>
              <span className="text-[10px] font-extrabold text-black bg-[#A6FF5D] px-2.5 py-0.5 rounded-full">
                ⚡ Live Render
              </span>
            </div>

            {/* Document Screenshot Mockup */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 text-gray-900 shadow-2xl border border-zinc-300 text-left space-y-2.5 font-sans">
              <div className="text-center pb-2 border-b border-gray-300">
                <h3 className="font-extrabold text-sm text-gray-900 tracking-tight">JAKE R. ENGINEER</h3>
                <p className="text-[9px] text-gray-600">jake@example.com • +1 (555) 019-2834 • github.com/jake</p>
              </div>

              <div>
                <p className="font-extrabold text-[9px] uppercase tracking-wider text-gray-900 border-b border-gray-900 pb-0.5">EDUCATION</p>
                <div className="flex justify-between font-semibold text-[9px] mt-1">
                  <span>B.S. Computer Science — UC Berkeley</span>
                  <span className="text-gray-600">2018 – 2022</span>
                </div>
              </div>

              <div>
                <p className="font-extrabold text-[9px] uppercase tracking-wider text-gray-900 border-b border-gray-900 pb-0.5">EXPERIENCE</p>
                <div className="flex justify-between font-bold text-gray-900 text-[9px] mt-1">
                  <span>Software Engineer — Google</span>
                  <span className="text-gray-600">2022 – Present</span>
                </div>
                <ul className="list-disc pl-3 text-[8.5px] text-gray-700 space-y-1 mt-1">
                  <li>Architected cloud microservices handling 10M+ daily active API requests.</li>
                  <li>Optimized database queries, reducing P99 latency by 35%.</li>
                </ul>
              </div>
            </div>

            {/* Live Indicator Footer */}
            <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#A6FF5D] animate-pulse" />
                <span>ATS Compatibility: <strong className="text-white">99%</strong></span>
              </div>
              <span className="text-zinc-500 font-mono text-[11px]">pdflatex • 0.4s</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Hero
