import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ScrollDown from '../components/ScrollDown'
import TrustedBy from '../components/TrustedBy'
import ResumePreview from '../components/ResumePreview'
import Features from '../components/Features'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const Home = () => {
  return (
    <div className="min-h-screen bg-black">
      <SEO 
        title="Free LaTeX ATS Resume Builder | Jake's Resume Template"
        description="Build ATS-optimized LaTeX resumes in minutes using Jake's Resume template. Trusted by software engineers at Google, Meta, Amazon, and top tech companies. 100% Free."
        keywords="LaTeX resume builder, ATS resume builder, Jake's resume template, software engineer resume generator, free tech resume creator"
        canonicalPath="/"
      />

      <header className="bg-black text-white flex flex-col items-center bg-cover bg-center bg-no-repeat min-h-screen md:min-h-0 md:pb-10 pt-14" style={{backgroundImage: "url('https://assets.prebuiltui.com/components/hero-section/hero-background-image.png')"}}>
        <Navbar />
        <div className="flex-1 flex items-center justify-center w-full md:flex-initial">
          <Hero />
        </div>
        <TrustedBy />
        <ScrollDown />
      </header>

      <main>
        <ResumePreview />
        
        <Features />
        
        <FAQ />
        
        <section className="py-20 px-4 md:px-16 lg:px-24 xl:px-32 bg-black">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to create your LaTeX resume?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of engineers and professionals using Jake's Resume template
            </p>
            <a href="/builder">
              <button className="bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 text-gray-800 font-semibold px-8 py-4 rounded-full text-lg transition-smooth hover:scale-105 hover:shadow-lg hover:shadow-[#A6FF5D]/30 cursor-pointer">
                Start Building Now
              </button>
            </a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default Home
