import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const About = () => {
  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black text-white border-b border-white/10">
        <Navbar />
      </header>

      <main className="py-12 px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-down">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 gradient-text">
              About LaTexume
            </h1>
            <p className="text-gray-400 text-lg">
              LaTeX-powered resumes for the modern professional
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur p-8 rounded-2xl border border-white/10 hover:border-primary/20 transition-all duration-300 hover-lift animate-fade-in-up animate-delay-100">
              <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
              <p className="text-gray-400 leading-relaxed">
                We believe every professional deserves a resume with perfect typography and ATS compatibility. LaTexume uses LaTeX and Jake's Resume template - the industry standard trusted by engineers at top tech companies - to ensure your resume passes ATS systems and impresses recruiters.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur p-8 rounded-2xl border border-white/10 hover:border-primary/20 transition-all duration-300 hover-lift animate-fade-in-up animate-delay-200">
              <h2 className="text-2xl font-semibold text-white mb-4">Why Choose Us?</h2>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start transition-transform duration-300 hover:translate-x-2">
                  <svg className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong className="text-white">LaTeX-Powered:</strong> Built with LaTeX, the professional standard for technical documents, ensuring perfect typography and formatting.</span>
                </li>
                <li className="flex items-start transition-transform duration-300 hover:translate-x-2">
                  <svg className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong className="text-white">Jake's Resume Template:</strong> Uses the industry-standard template trusted by engineers at Google, Meta, Amazon, and Microsoft.</span>
                </li>
                <li className="flex items-start transition-transform duration-300 hover:translate-x-2">
                  <svg className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong className="text-white">ATS-Optimized:</strong> LaTeX formatting ensures 100% compatibility with Applicant Tracking Systems used by top companies.</span>
                </li>
                <li className="flex items-start transition-transform duration-300 hover:translate-x-2">
                  <svg className="w-6 h-6 text-primary mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong className="text-white">Professional Quality:</strong> Generate publication-quality PDFs with perfect spacing, alignment, and typography.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur p-8 rounded-2xl border border-white/10 hover:border-primary/20 transition-all duration-300 hover-lift animate-fade-in-up animate-delay-300">
              <h2 className="text-2xl font-semibold text-white mb-4">Why Jake's Resume Template?</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Jake's Resume is the most popular LaTeX resume template among software engineers and tech professionals. It's clean, ATS-friendly, and has been battle-tested by thousands of successful applicants at FAANG companies.
              </p>
              <p className="text-gray-400 leading-relaxed">
                CVForge makes this powerful template accessible to everyone - no LaTeX knowledge required. Just fill in your information and get a perfectly formatted, ATS-optimized PDF in seconds.
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary/20 to-primary/5 p-8 rounded-2xl border border-primary/30 text-center hover-lift animate-fade-in-up animate-delay-400">
              <h2 className="text-2xl font-semibold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-gray-300 mb-6">
                Join thousands of professionals who have created their perfect resume with us
              </p>
              <a href="/builder">
                <button className="bg-primary hover:bg-primary/90 text-gray-800 font-semibold px-8 py-4 rounded-full text-lg transition-smooth hover:scale-105 hover:shadow-lg hover:shadow-primary/30">
                  Create Your Resume Now
                </button>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default About
