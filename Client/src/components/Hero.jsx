import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full px-4 py-8 md:py-12">
      <div className="rainbow relative z-0 bg-white/15 overflow-hidden p-px flex items-center justify-center rounded-full transition duration-300 active:scale-100 mt-4 md:mt-4 animate-fade-in-down">
        <button className="flex items-center justify-center gap-3 pl-4 pr-6 py-3 text-white rounded-full font-medium bg-gray-900/80 backdrop-blur">
          <div className="relative flex size-3.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#A6FF5D] opacity-75 animate-ping duration-300"></span>
            <span className="relative inline-flex size-2 rounded-full bg-[#A6FF5D]"></span>
          </div>
          <span className="text-xs">LaTeX-Powered • ATS-Optimized</span>
        </button>
      </div>

      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[64px]/[82px] text-center max-w-4xl mt-6 md:mt-4 bg-clip-text leading-tight px-2 sm:px-4 gradient-text animate-fade-in-up animate-delay-100">
        LaTeX-powered resumes that pass ATS & impress recruiters
      </h1>

      <p className="text-xs sm:text-sm md:text-base text-gray-300 text-center max-w-lg mt-4 px-4 animate-fade-in-up animate-delay-200">
        Professional LaTeX resume builder using Jake's Resume template.
        ATS-optimized, recruiter-approved, and trusted by top tech professionals.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center w-full sm:w-auto gap-3 mt-8 md:mt-5 animate-fade-in-up animate-delay-300">
        <Link to="/builder" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto bg-[#A6FF5D] hover:bg-[#b8ff7a] text-gray-950 px-6 py-3 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[#A6FF5D]/30 cursor-pointer group whitespace-nowrap border border-[#A6FF5D]">
            <div className="relative overflow-hidden">
              <span className="block transition-transform duration-200 group-hover:-translate-y-full">
                Build Resume Now
              </span>
              <span className="absolute top-0 left-0 block transition-transform duration-200 group-hover:translate-y-0 translate-y-full">
                Build Resume Now
              </span>
            </div>
          </button>
        </Link>

        <Link to="/templates" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto px-6 text-sm py-3 text-white hover:text-[#A6FF5D] rounded-full border border-zinc-700 hover:border-[#A6FF5D]/60 bg-zinc-900/80 cursor-pointer hover:scale-105 transition-all duration-200 whitespace-nowrap font-semibold flex items-center justify-center gap-2">
            <span>Browse Templates</span>
          </button>
        </Link>

        <Link to="/ats-optimizer" className="w-full sm:w-auto">
          <button className="w-full sm:w-auto px-6 text-sm py-3 text-white hover:text-[#A6FF5D] rounded-full border border-zinc-700 hover:border-[#A6FF5D]/60 bg-zinc-900/80 cursor-pointer hover:scale-105 transition-all duration-200 whitespace-nowrap font-semibold flex items-center justify-center gap-2">
            <span>ATS Matcher</span>
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Hero
