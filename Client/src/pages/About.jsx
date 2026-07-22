import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const About = () => {
  return (
    <div className="min-h-screen bg-black">
      <SEO 
        title="About LaTexume & Jake's Resume Template"
        description="Learn why software engineers at Google, Meta, and Amazon trust LaTexume and Jake's Resume LaTeX template for building 100% ATS-compliant resumes."
        keywords="about latexume, jake's resume template guide, ATS resume tips, software engineering resume guide, latex resume tutorial"
        canonicalPath="/about"
      />

      <header className="bg-black text-white border-b border-white/10 pt-16 sm:pt-20">
        <Navbar />
      </header>

      <main className="py-8 sm:py-12 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 animate-fade-in-down">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 gradient-text">
              About LaTexume & Jake's Resume Template
            </h1>
            <p className="text-gray-400 text-sm sm:text-lg">
              Empowering engineers and tech professionals with publication-quality LaTeX resumes
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white/5 backdrop-blur p-5 sm:p-8 rounded-2xl border border-white/10 hover:border-[#A6FF5D]/20 transition-all duration-300 hover-lift animate-fade-in-up animate-delay-100">
              <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Our Mission</h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                We believe every professional deserves a resume with perfect typography and 100% ATS compatibility. LaTexume combines the typesetting precision of LaTeX with <strong className="text-white">Jake's Resume template</strong>—the gold standard trusted by software engineers at FAANG companies—to ensure your resume passes Applicant Tracking Systems (ATS) and lands technical interviews.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur p-8 rounded-2xl border border-white/10 hover:border-[#A6FF5D]/20 transition-all duration-300 hover-lift animate-fade-in-up animate-delay-200">
              <h2 className="text-2xl font-semibold text-white mb-4">Why Tech Professionals Choose LaTexume</h2>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-start transition-transform duration-300 hover:translate-x-2">
                  <svg className="w-6 h-6 text-[#A6FF5D] mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong className="text-white">LaTeX-Powered Precision:</strong> Built with standard LaTeX packages ensuring mathematical precision, perfect vertical alignment, and crisp typography.</span>
                </li>
                <li className="flex items-start transition-transform duration-300 hover:translate-x-2">
                  <svg className="w-6 h-6 text-[#A6FF5D] mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong className="text-white">Battle-Tested Template:</strong> Employs Jake's Resume layout, proven to pass automated screeners at Google, Meta, Amazon, Microsoft, and Netflix.</span>
                </li>
                <li className="flex items-start transition-transform duration-300 hover:translate-x-2">
                  <svg className="w-6 h-6 text-[#A6FF5D] mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong className="text-white">100% ATS-Optimized:</strong> Eliminates graphics, tables, and unreadable fonts that cause ATS parsers to reject candidate resumes.</span>
                </li>
                <li className="flex items-start transition-transform duration-300 hover:translate-x-2">
                  <svg className="w-6 h-6 text-[#A6FF5D] mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span><strong className="text-white">Interactive Links:</strong> Keeps your Portfolio, GitHub repositories, and LinkedIn profile clickable directly inside the compiled PDF.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/5 backdrop-blur p-8 rounded-2xl border border-white/10 hover:border-[#A6FF5D]/20 transition-all duration-300 hover-lift animate-fade-in-up animate-delay-300">
              <h2 className="text-2xl font-semibold text-white mb-4">The Story Behind Jake's Resume Template</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Jake's Resume is widely regarded as the single most effective LaTeX resume template for computer science students, software engineers, and IT professionals. It eliminates visual clutter and focuses strictly on quantifiable metrics, engineering skill sets, project impact, and educational background.
              </p>
              <p className="text-gray-400 leading-relaxed">
                LaTexume brings this powerful template to your browser—no LaTeX installation, TeX compilers, or syntax troubleshooting required. Enter your details and generate your PDF in seconds.
              </p>
            </div>

            <div className="bg-gradient-to-r from-[#A6FF5D]/20 to-[#A6FF5D]/5 p-8 rounded-2xl border border-[#A6FF5D]/30 text-center hover-lift animate-fade-in-up animate-delay-400">
              <h2 className="text-2xl font-semibold text-white mb-4">Ready to Create Your LaTeX Resume?</h2>
              <p className="text-gray-300 mb-6">
                Join thousands of engineers who created their interview-ready resume with LaTexume
              </p>
              <a href="/builder">
                <button className="bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-gray-800 font-semibold px-8 py-4 rounded-full text-lg transition-smooth hover:scale-105 hover:shadow-lg hover:shadow-[#A6FF5D]/30 cursor-pointer">
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
