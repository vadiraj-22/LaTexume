import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full px-4 py-8 md:py-12">
      <div className="rainbow relative z-0 bg-white/15 overflow-hidden p-px flex items-center justify-center rounded-full transition duration-300 active:scale-100 mt-8 md:mt-8 animate-fade-in-down">
        <button className="flex items-center justify-center gap-3 pl-4 pr-6 py-3 text-white rounded-full font-medium bg-gray-900/80 backdrop-blur">
          <div className="relative flex size-3.5 items-center justify-center">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#A6FF5D] opacity-75 animate-ping duration-300"></span>
            <span className="relative inline-flex size-2 rounded-full bg-[#A6FF5D]"></span>
          </div>
          <span className="text-xs">LaTeX-Powered • ATS-Optimized</span>
        </button>
      </div>

      <h1 className="text-4xl md:text-[64px]/[82px] text-center max-w-4xl mt-6 md:mt-4 bg-clip-text leading-tight px-4 gradient-text animate-fade-in-up animate-delay-100">
        LaTeX-powered resumes that pass ATS & impress recruiters
      </h1>

      <p className="text-sm md:text-base text-gray-300 bg-clip-text text-center max-w-lg mt-6 md:mt-4 px-4 animate-fade-in-up animate-delay-200">
        Professional LaTeX resume builder using the industry-standard Jake's Resume template. ATS-optimized, recruiter-approved, and trusted by top tech professionals.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mt-8 md:mt-5 animate-fade-in-up animate-delay-300">
        <Link to="/builder">
          <button className="bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-gray-800 px-6 py-2.5 rounded-full text-sm transition-smooth hover:scale-105 hover:shadow-lg hover:shadow-[#A6FF5D]/30 cursor-pointer group whitespace-nowrap">
            <div className="relative overflow-hidden">
              <span className="block transition-transform duration-200 group-hover:-translate-y-full">
                Create Your Resume
              </span>
              <span className="absolute top-0 left-0 block transition-transform duration-200 group-hover:translate-y-0 translate-y-full">
                Create Your Resume
              </span>
            </div>
          </button>
        </Link>

        <div className="bg-white/15 hover:bg-white/10 p-px flex items-center justify-center rounded-full hover:scale-105 transition-smooth active:scale-100">
          <Link to="/about">
            <button className="px-6 text-sm py-3 text-white rounded-full bg-white/5 cursor-pointer hover:bg-white/10 transition-smooth whitespace-nowrap">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Hero
