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
    <section className="py-20 px-4 md:px-16 lg:px-24 xl:px-32 bg-gray-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Your Resume Structure
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            See how your information will be organized in the professional LaTeX format
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Resume Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div
                key={index}
                className="flex gap-4 bg-white/5 backdrop-blur p-5 rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {section.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Resume Preview */}
          <div className="sticky top-8">
            <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Preview</h3>
                <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full">
                  LaTeX Format
                </span>
              </div>
              
              {/* Resume Preview Image */}
              <div className="bg-white rounded-lg p-4 shadow-2xl">
                <div className="aspect-[8.5/11] bg-white rounded overflow-hidden border border-gray-200">
                  <img 
                    src="/myResume.png" 
                    alt="Resume Preview - LaTeX Format" 
                    className="w-full h-full object-cover object-top"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  {/* Fallback skeleton if image doesn't load */}
                  <div style={{ display: 'none' }}>
                    {/* Header */}
                    <div className="text-center py-4 border-b border-gray-300">
                      <div className="h-6 bg-gray-800 w-48 mx-auto mb-2 rounded"></div>
                      <div className="h-2 bg-gray-400 w-64 mx-auto rounded"></div>
                    </div>
                    
                    {/* Objective */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="h-3 bg-gray-700 w-24 mb-2 rounded"></div>
                      <div className="h-2 bg-gray-300 w-full mb-1 rounded"></div>
                      <div className="h-2 bg-gray-300 w-5/6 rounded"></div>
                    </div>
                    
                    {/* Skills */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="h-3 bg-gray-700 w-32 mb-2 rounded"></div>
                      <div className="space-y-1">
                        <div className="h-2 bg-gray-300 w-full rounded"></div>
                        <div className="h-2 bg-gray-300 w-4/5 rounded"></div>
                      </div>
                    </div>
                    
                    {/* Experience */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="h-3 bg-gray-700 w-28 mb-2 rounded"></div>
                      <div className="flex justify-between mb-1">
                        <div className="h-2 bg-gray-600 w-32 rounded"></div>
                        <div className="h-2 bg-gray-400 w-24 rounded"></div>
                      </div>
                      <div className="h-2 bg-gray-400 w-40 mb-2 rounded"></div>
                      <div className="space-y-1 ml-2">
                        <div className="h-1.5 bg-gray-300 w-full rounded"></div>
                        <div className="h-1.5 bg-gray-300 w-11/12 rounded"></div>
                      </div>
                    </div>
                    
                    {/* Projects */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="h-3 bg-gray-700 w-24 mb-2 rounded"></div>
                      <div className="flex justify-between mb-1">
                        <div className="h-2 bg-gray-600 w-36 rounded"></div>
                        <div className="h-2 bg-gray-400 w-16 rounded"></div>
                      </div>
                      <div className="space-y-1 ml-2">
                        <div className="h-1.5 bg-gray-300 w-full rounded"></div>
                        <div className="h-1.5 bg-gray-300 w-10/12 rounded"></div>
                      </div>
                    </div>
                    
                    {/* Education */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="h-3 bg-gray-700 w-28 mb-2 rounded"></div>
                      <div className="flex justify-between mb-1">
                        <div className="h-2 bg-gray-600 w-40 rounded"></div>
                        <div className="h-2 bg-gray-400 w-28 rounded"></div>
                      </div>
                      <div className="h-2 bg-gray-400 w-48 rounded"></div>
                    </div>
                    
                    {/* Certifications */}
                    <div className="px-4 py-2">
                      <div className="h-3 bg-gray-700 w-36 mb-2 rounded"></div>
                      <div className="space-y-1 ml-2">
                        <div className="h-1.5 bg-gray-300 w-11/12 rounded"></div>
                        <div className="h-1.5 bg-gray-300 w-10/12 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-400">
                  Professional LaTeX formatting ensures perfect typography and ATS compatibility
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ResumePreview
