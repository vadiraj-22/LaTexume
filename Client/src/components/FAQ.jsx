import React, { useState, useEffect } from 'react'

const faqs = [
  {
    question: "How does LaTexume ensure 100% ATS compatibility for resumes?",
    answer: "LaTexume compiles your resume using clean, standard LaTeX syntax based on Jake's Resume template. Unlike graphic design tools (like Canva or Photoshop) that generate flattened rasterized text or complex table structures, LaTeX outputs clean, searchable text with standardized headers and linear reading order that Applicant Tracking Systems (ATS) can parse with 100% precision."
  },
  {
    question: "Why is Jake's Resume template the top choice for software engineers?",
    answer: "Jake's Resume is the industry-standard LaTeX resume template used by software engineers, product managers, and data scientists at top tech companies like Google, Meta, Amazon, Apple, and Microsoft. Its minimalist, single-page layout prioritizes technical skills, impactful bullet points, and clickable links without unnecessary graphics or distracting elements."
  },
  {
    question: "Do I need to know LaTeX syntax to use LaTexume?",
    answer: "No LaTeX knowledge is required! LaTexume provides an intuitive, form-based interface where you enter your experience, education, projects, and skills. Our engine automatically format-checks your input, escapes special characters, and renders a professional publication-quality LaTeX PDF instantly."
  },
  {
    question: "Are external links (GitHub, LinkedIn, Portfolio) clickable in the generated PDF?",
    answer: "Yes! LaTexume automatically embeds hyperref PDF metadata so all your live site demos, GitHub repositories, LinkedIn profiles, and email addresses are fully clickable and interactive when recruiters review your PDF."
  },
  {
    question: "Is LaTexume completely free to use?",
    answer: "Yes, LaTexume is 100% free with no hidden fees, paywalls, or watermarks. You can build, edit, and download unlimited LaTeX resumes whenever you need."
  },
  {
    question: "How can I improve my ATS score when building a resume with LaTexume?",
    answer: "To maximize your ATS score: 1) Include target keywords from the job description in your Skills and Experience sections. 2) Quantify your achievements using metrics (e.g., 'Increased API throughput by 40%'). 3) Keep formatting clean and consistent using standard bullet points."
  }
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Dynamically inject Schema.org FAQPage JSON-LD into document head
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'faq-schema-jsonld'
    script.innerHTML = JSON.stringify(faqSchema)
    document.head.appendChild(script)

    return () => {
      const existingScript = document.getElementById('faq-schema-jsonld')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  return (
    <section className="py-20 px-4 md:px-16 lg:px-24 xl:px-32 bg-black/90 border-t border-white/10" id="faq">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="text-[#A6FF5D] text-sm font-semibold tracking-wider uppercase mb-2 block">
            Got Questions?
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            Everything you need to know about building ATS-optimized LaTeX resumes with LaTexume
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <article 
                key={index} 
                className="bg-white/5 backdrop-blur rounded-xl border border-white/10 overflow-hidden transition-all duration-200 hover:border-[#A6FF5D]/30"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#A6FF5D]/50 rounded-xl"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-lg font-medium text-white pr-2">
                    {faq.question}
                  </h3>
                  <span className={`text-[#A6FF5D] transition-transform duration-300 transform flex-shrink-0 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div id={`faq-answer-${index}`} className="px-6 pb-5 text-gray-300 text-sm md:text-base leading-relaxed border-t border-white/5 pt-3 animate-fade-in">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQ
