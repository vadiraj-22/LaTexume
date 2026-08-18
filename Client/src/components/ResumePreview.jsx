import React from 'react'

const ResumePreview = () => {
  const sections = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: 'Personal Information',
      description: 'Your name, contact details, and professional links (LinkedIn, GitHub, Portfolio, LeetCode)'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Objective',
      description: 'A brief professional summary highlighting your career goals and key strengths'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: 'Technical Skills',
      description: 'Organized by categories (Languages, Frameworks, Tools, etc.) for easy scanning'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Experience',
      description: 'Work history with company, role, dates, and detailed bullet points of achievements'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: 'Projects',
      description: 'Personal or academic projects with technologies used, descriptions, and clickable links to live sites and GitHub'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Education',
      description: 'Academic qualifications with institution, degree, field of study, location, and dates'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: 'Certifications & Achievements',
      description: 'Professional certifications, awards, and notable achievements as bullet points'
    }
  ]

  return (
    <section className="py-12 sm:py-20 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 bg-gray-900/30">
      <div className="max-w-[1400px] mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#A6FF5D]/10 border border-[#A6FF5D]/30 text-[#A6FF5D] text-xs font-semibold uppercase tracking-wider mb-4">
            Structured Layout
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
            Your Resume Structure
          </h2>
          <p className="text-gray-400 text-sm sm:text-lg max-w-2xl mx-auto">
            See how your information is seamlessly organized in the industry-standard LaTeX format
          </p>
        </div>

        {/* Symmetrical Centered 50/50 Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-14 lg:gap-12 items-start w-full max-w-6xl mx-auto">
          
          {/* LEFT SIDE: Resume Preview (Centered in Left 50% Column on desktop, Order 2 on mobile) */}
          <div className="w-full lg:sticky lg:top-24 animate-fade-in-left flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-[520px] bg-zinc-950/90 border border-zinc-800/90 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl hover:border-[#A6FF5D]/30 transition-all duration-500 hover-glow">
              {/* Subtle Glow background */}
              <div className="absolute -inset-4 bg-[#A6FF5D]/10 rounded-3xl blur-3xl pointer-events-none" />

              {/* Mockup Window Controls Header */}
              <div className="relative flex items-center justify-between border-b border-zinc-800/80 pb-3.5 mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="text-[11px] text-zinc-400 font-mono ml-2 hidden sm:inline">jake_resume.tex</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] text-zinc-400 font-mono hidden md:inline">pdflatex • 0.4s</span>
                  <span className="text-[10px] font-extrabold text-black bg-[#A6FF5D] px-2.5 py-0.5 rounded-full shadow-md">
                    ⚡ Live Render
                  </span>
                </div>
              </div>

              {/* Resume Preview Image */}
              <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 w-full">
                <img 
                  src="/myresume.png" 
                  alt="Resume Preview - LaTeX ATS Format" 
                  loading="lazy"
                  className="w-full h-auto object-cover object-top block rounded-2xl"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextElementSibling) {
                      e.target.nextElementSibling.style.display = 'block';
                    }
                  }}
                />
                {/* Fallback skeleton if image doesn't load */}
                <div style={{ display: 'none' }} className="p-6 bg-white">
                  <div className="text-center py-4 border-b border-gray-300">
                    <div className="h-6 bg-gray-800 w-48 mx-auto mb-2 rounded"></div>
                    <div className="h-2 bg-gray-400 w-64 mx-auto rounded"></div>
                  </div>
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="h-3 bg-gray-700 w-24 mb-2 rounded"></div>
                    <div className="h-2 bg-gray-300 w-full mb-1 rounded"></div>
                    <div className="h-2 bg-gray-300 w-5/6 rounded"></div>
                  </div>
                </div>
              </div>

              {/* Live Indicator Footer */}
              <div className="relative mt-4.5 pt-3.5 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#A6FF5D] animate-pulse" />
                  <span>ATS Match Score: <strong className="text-white font-semibold">99/100 (Optimal)</strong></span>
                </div>
                <span className="text-zinc-500 font-mono text-[11px]">Jake's LaTeX Template</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Resume Structure Cards (Centered in Right 50% Column on desktop, Order 1 on mobile) */}
          <div className="w-full max-w-[520px] mx-auto space-y-3.5 sm:space-y-4 order-1 lg:order-2">
            {sections.map((section, index) => {
              const delays = ['animate-delay-100', 'animate-delay-200', 'animate-delay-300', 'animate-delay-400', 'animate-delay-500', 'animate-delay-600', 'animate-delay-700']
              return (
                <div
                  key={index}
                  className={`flex gap-4 bg-white/5 backdrop-blur p-4 sm:p-4.5 rounded-xl border border-white/10 hover:border-[#A6FF5D]/40 transition-all duration-300 hover-lift animate-fade-in-right ${delays[index] || ''}`}
                >
                  <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-[#A6FF5D]/10 rounded-lg flex items-center justify-center text-[#A6FF5D] transition-transform duration-300 hover:scale-110 hover:rotate-6 border border-[#A6FF5D]/20">
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-0.5">
                      {section.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </section>
  )
}

export default ResumePreview
