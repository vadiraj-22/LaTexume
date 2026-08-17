import React from 'react'

const Features = () => {
  const features = [
    {
      icon: (
        <svg className="w-7 h-7 text-[#A6FF5D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h3a1 1 0 011 1v6a1 1 0 01-1 1h-3a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      title: 'Multiple ATS LaTeX Templates',
      description: 'Choose between Jake\'s Clean, Blue Accent Tech, and Classic Executive Serif templates. 100% ATS parser friendly.'
    },
    {
      icon: (
        <svg className="w-7 h-7 text-[#A6FF5D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" strokeWidth="2" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        </svg>
      ),
      title: 'Job Description & ATS Matcher',
      description: 'Paste target job requirements to extract missing keywords using local NLP and run AI ATS score analysis.'
    },
    {
      icon: (
        <svg className="w-7 h-7 text-[#A6FF5D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'AI Bullet Enhancer',
      description: 'Rewrite bullet points with token-budgeted AI to emphasize quantifiable impact, metrics, and active verbs.'
    },
    {
      icon: (
        <svg className="w-7 h-7 text-[#A6FF5D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
        </svg>
      ),
      title: 'Cloud Resume Persistence',
      description: 'Save, load, and manage multiple resume drafts securely in MongoDB Atlas with automatic draft backup.'
    },
    {
      icon: (
        <svg className="w-7 h-7 text-[#A6FF5D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Side-by-Side Split View & LaTeX Code',
      description: 'Real-time 350ms PDF preview alongside a syntax-highlighted LaTeX source code inspector with instant copy/download.'
    },
    {
      icon: (
        <svg className="w-7 h-7 text-[#A6FF5D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      title: 'Public Shareable Links (/r/:id)',
      description: 'Generate public resume portfolio links with online PDF previews, view counters, and recruiter download analytics.'
    }
  ]

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 bg-zinc-950/80 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A6FF5D]/10 border border-[#A6FF5D]/30 text-[#A6FF5D] text-xs font-semibold uppercase tracking-wider mb-3">
            <span>⚡ Powerful Feature Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-3">
            Everything you need for a 100% ATS Resume
          </h2>
          <p className="text-zinc-400 text-sm sm:text-lg max-w-2xl mx-auto">
            From LaTeX compilation and AI bullet enhancement to job matching and public share links.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-black/80 backdrop-blur p-6 sm:p-7 rounded-3xl border border-zinc-800/80 hover:border-[#A6FF5D]/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="p-3 w-fit rounded-2xl bg-zinc-900 border border-zinc-800 mb-5 group-hover:border-[#A6FF5D]/40 transition">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#A6FF5D] transition">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
