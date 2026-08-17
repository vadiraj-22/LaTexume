import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

const TEMPLATES = [
  {
    id: 'jake',
    name: "Jake's Clean ATS",
    tagline: 'Industry Standard for Software Engineers',
    badge: 'Popular Choice',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    description: 'Clean single-column monochrome design trusted by software engineers and DevOps specialists applying to top tech firms (Google, Meta, Amazon).',
    atsScore: '99/100 ATS Match',
    font: 'Helvetica / Sans-Serif',
    accent: 'Monochrome Black & White',
    features: ['Monochrome ATS Typography', 'Optimized for 1-Page Format', 'Ideal for SWE & DevOps'],
    bgGradient: 'from-emerald-900/20 to-zinc-950',
    borderColor: 'border-emerald-500/30 hover:border-emerald-400',
  },
  {
    id: 'blueAccent',
    name: 'Blue Accent Tech',
    tagline: 'Modern Colored Headers & Clean Layout',
    badge: 'Modern Tech',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    description: 'Vibrant ATS template featuring royal blue section headers and navy details. Excellent visual hierarchy while retaining 100% ATS parser compatibility.',
    atsScore: '98/100 ATS Match',
    font: 'Computer Modern / Sans',
    accent: 'Royal Blue & Navy Headers',
    features: ['Colored Section Titles (\\color{BlueViolet})', 'Compact Spacing', 'Great for Fullstack & Data Engineers'],
    bgGradient: 'from-blue-900/20 to-zinc-950',
    borderColor: 'border-blue-500/30 hover:border-blue-400',
  },
  {
    id: 'classic',
    name: 'Classic Executive Serif',
    tagline: 'Minimalist Elegance for Senior Roles',
    badge: 'Executive',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    description: 'Single-column Charter Serif typography designed for senior engineers, tech leads, managers, and corporate positions.',
    atsScore: '97/100 ATS Match',
    font: 'Charter Serif',
    accent: 'Classic Dark Gray Serif',
    features: ['Charter Serif Typography', 'Executive Single-Column Spacing', 'Perfect for Senior Leads & Managers'],
    bgGradient: 'from-amber-900/20 to-zinc-950',
    borderColor: 'border-amber-500/30 hover:border-amber-400',
  },
]

const SAMPLE_RESUME_DATA = {
  header: {
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    phone: '+1 (555) 019-2834',
    linkedin: 'linkedin.com/in/alexrivera',
    github: 'github.com/alexrivera',
    portfolio: 'alexrivera.dev',
    location: 'San Francisco, CA',
  },
  objective: 'Senior Full Stack & Cloud Systems Engineer with 6+ years of experience building high-throughput microservices, real-time web architectures, and AI-driven platforms. Proven track record scaling applications to millions of active users.',
  sectionOrder: ['skills', 'experience', 'projects', 'education', 'certifications'],
  skills: [
    { category: 'Languages', items: 'TypeScript, JavaScript, Python, Go, Java, SQL, HTML5/CSS3' },
    { category: 'Frameworks & Frontend', items: 'React, Next.js, Redux, TailwindCSS, Vue.js, GraphQL, REST APIs' },
    { category: 'Backend & Cloud', items: 'Node.js, Express, FastAPI, PostgreSQL, MongoDB, Docker, AWS, Redis' },
    { category: 'Developer Tools', items: 'Git, GitHub Actions, CI/CD Pipelines, Jest, Vite, Linux, NGINX, LaTeX' },
  ],
  experience: [
    {
      company: 'Apex Cloud Systems',
      position: 'Senior Full Stack Engineer',
      location: 'San Francisco, CA',
      startDate: 'Jun 2022',
      endDate: 'Present',
      bullets: [
        'Architected high-throughput microservices in TypeScript and Node.js, handling 5M+ daily active API requests with 99.99% service uptime.',
        'Engineered real-time data sync pipeline using WebSockets and Redis Pub/Sub, reducing data delivery latency by 68%.',
        'Spearheaded frontend migration to Next.js 14 and TailwindCSS, improving Google Lighthouse performance score from 62 to 98.',
      ],
    },
    {
      company: 'Nexus Tech Labs',
      position: 'Software Engineer',
      location: 'San Jose, CA',
      startDate: 'Jul 2020',
      endDate: 'May 2022',
      bullets: [
        'Developed serverless REST and GraphQL APIs deployed on AWS Lambda & PostgreSQL, reducing infrastructure costs by $45,000 annually.',
        'Implemented automated CI/CD deployment workflows using GitHub Actions and Docker, reducing release cycle time from 3 days to 15 minutes.',
        'Collaborated with security auditors to implement OAuth2 / JWT role-based access controls for 150,000+ active enterprise accounts.',
      ],
    },
  ],
  projects: [
    {
      name: 'LaTexume Platform',
      tech: 'React, Node.js, Express, LaTeX Engine, Docker, MongoDB',
      date: '2024',
      link: 'github.com/alexrivera/latexume',
      bullets: [
        'Built open-source LaTeX resume generator with live PDF preview, ATS keyword matching, and AI bullet optimization.',
        'Containerized LaTeX compilation environment in Docker to achieve sub-second PDF generation speeds across 100,000+ downloads.',
      ],
    },
    {
      name: 'Distributed Vector DB Visualizer',
      tech: 'Python, FastAPI, React, D3.js, Vector Embeddings',
      date: '2023',
      link: 'github.com/alexrivera/vector-viz',
      bullets: [
        'Created interactive 3D spatial visualization tool for high-dimensional vector embeddings, adopted by 3,000+ ML developers.',
      ],
    },
  ],
  education: [
    {
      school: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science & Engineering (GPA: 3.89 / 4.0)',
      location: 'Berkeley, CA',
      startDate: 'Aug 2016',
      endDate: 'May 2020',
    },
  ],
  certifications: [
    {
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      date: '2023',
    },
    {
      name: 'Certified Kubernetes Application Developer (CKAD)',
      issuer: 'Cloud Native Computing Foundation (CNCF)',
      date: '2022',
    },
  ],
}

export default function Templates() {
  const navigate = useNavigate()
  const [selectedTemplateId, setSelectedTemplateId] = useState('jake')
  const [previewPdfUrl, setPreviewPdfUrl] = useState('')
  const [loadingPreview, setLoadingPreview] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  const selectedTemplate = TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0]

  useEffect(() => {
    let isMounted = true
    const fetchSamplePdf = async () => {
      setLoadingPreview(true)
      try {
        const response = await fetch(`${API_URL}/api/generate-resume`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...SAMPLE_RESUME_DATA, templateId: selectedTemplateId }),
        })
        if (response.ok && isMounted) {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          setPreviewPdfUrl(url)
        }
      } catch (e) {
        console.warn('Failed to load sample preview:', e)
      } finally {
        if (isMounted) setLoadingPreview(false)
      }
    }

    fetchSamplePdf()
    return () => {
      isMounted = false
    }
  }, [selectedTemplateId])

  const handleUseTemplate = (templateId) => {
    const savedDraft = localStorage.getItem('latexume_draft')
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        parsed.templateId = templateId
        localStorage.setItem('latexume_draft', JSON.stringify(parsed))
      } catch (e) {
        // ignore
      }
    }
    navigate(`/builder?template=${templateId}`)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-[#A6FF5D] selection:text-black">
      <SEO
        title="Resume Templates | LaTexume"
        description="Choose from ATS-friendly, professional LaTeX resume templates. Clean, modern, and free."
      />
      <Navbar />

      <main className="flex-1 pt-36 sm:pt-40 pb-16 px-4 sm:px-8 md:px-12 lg:px-16 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="text-center space-y-3 mb-10 animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#A6FF5D]/10 border border-[#A6FF5D]/30 text-[#A6FF5D] text-xs font-semibold uppercase tracking-wider">
            <span>📄 LaTeX Resume Styles</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Choose Your Resume Template
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Click any card to preview its live LaTeX styling beside the options, then launch into the Builder.
          </p>
        </div>

        {/* Split View: Template Selectors on Left, Live PDF Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Selectable Template Cards (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            {TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplateId === tmpl.id
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`bg-zinc-950 p-5 sm:p-6 rounded-3xl border transition-all duration-200 shadow-xl cursor-pointer relative group ${
                    isSelected
                      ? 'border-[#A6FF5D] ring-2 ring-[#A6FF5D]/40 bg-zinc-900/90'
                      : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${tmpl.badgeColor}`}>
                      {tmpl.badge}
                    </span>
                    {isSelected ? (
                      <span className="text-xs font-bold text-black bg-[#A6FF5D] px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                        ✓ Selected
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                        {tmpl.atsScore}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-white mb-1 group-hover:text-[#A6FF5D] transition">
                    {tmpl.name}
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium mb-2">{tmpl.tagline}</p>
                  
                  {/* High-Fidelity Document Visual Screenshot Mockup Thumbnail */}
                  <div className="w-full h-44 bg-white/95 rounded-2xl p-3.5 text-gray-900 shadow-inner overflow-hidden relative group/thumb border border-zinc-700/50 my-3 transition-transform duration-200 group-hover:scale-[1.01]">
                    {tmpl.id === 'jake' && (
                      <div className="space-y-1.5 text-[8px] font-sans">
                        <div className="text-center pb-1 border-b border-gray-300">
                          <h4 className="font-extrabold text-[10px] text-gray-900 tracking-tight">JAKE R. ENGINEER</h4>
                          <p className="text-[6.5px] text-gray-600">jake@example.com • +1 (555) 019-2834 • github.com/jake</p>
                        </div>
                        <div>
                          <p className="font-bold text-[8px] uppercase tracking-wider text-gray-900 border-b border-gray-900 pb-0.5">EDUCATION</p>
                          <div className="flex justify-between font-semibold mt-0.5 text-[7.5px]"><span>B.S. Computer Science — UC Berkeley</span><span>2018 – 2022</span></div>
                        </div>
                        <div>
                          <p className="font-bold text-[8px] uppercase tracking-wider text-gray-900 border-b border-gray-900 pb-0.5 mt-0.5">EXPERIENCE</p>
                          <div className="flex justify-between font-bold text-gray-800 text-[7.5px]"><span>Software Engineer — Google</span><span>2022 – Present</span></div>
                          <ul className="list-disc pl-2.5 text-[7px] text-gray-600 space-y-0.5">
                            <li>Architected cloud microservices serving 10M+ daily active requests.</li>
                            <li>Optimized database queries, reducing API latency by 35%.</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {tmpl.id === 'blueAccent' && (
                      <div className="space-y-1.5 text-[8px] font-sans">
                        <div className="text-center pb-1 border-b border-blue-200 bg-blue-50/50 -m-3.5 p-2.5 mb-1.5">
                          <h4 className="font-extrabold text-[10px] text-blue-950 tracking-tight">ALEX RIVERA</h4>
                          <p className="text-[6.5px] text-blue-700">alex@tech.dev • sf, ca • linkedin.com/in/alex</p>
                        </div>
                        <div>
                          <p className="font-bold text-[8px] uppercase tracking-wider text-blue-800 border-b border-blue-200 pb-0.5">TECHNICAL SKILLS</p>
                          <p className="text-[7px] text-gray-700 mt-0.5"><span className="font-semibold text-blue-900">Languages:</span> TypeScript, Python, React, Node.js, AWS</p>
                        </div>
                        <div>
                          <p className="font-bold text-[8px] uppercase tracking-wider text-blue-800 border-b border-blue-200 pb-0.5 mt-0.5">EXPERIENCE</p>
                          <div className="flex justify-between font-bold text-gray-900 text-[7.5px]"><span>Lead Fullstack Dev — Vercel</span><span>2021 – Present</span></div>
                          <ul className="list-disc pl-2.5 text-[7px] text-gray-600 space-y-0.5">
                            <li>Built high-concurrency edge infrastructure with 99.99% uptime.</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {tmpl.id === 'classic' && (
                      <div className="space-y-1.5 text-[8px] font-serif">
                        <div className="text-center pb-1 border-b border-gray-400">
                          <h4 className="font-bold text-[10px] text-gray-900 tracking-wide font-serif">VICTORIA STERLING</h4>
                          <p className="text-[6.5px] text-gray-600 italic">v.sterling@executive.com • +1 555 234 5678</p>
                        </div>
                        <div>
                          <p className="font-bold text-[8px] uppercase tracking-widest text-gray-800 border-b border-gray-700 pb-0.5 font-serif">EXECUTIVE PROFILE</p>
                          <p className="text-[7px] text-gray-700 leading-tight italic">Engineering Leader with 10+ years directing multi-disciplinary tech organizations.</p>
                        </div>
                        <div>
                          <p className="font-bold text-[8px] uppercase tracking-widest text-gray-800 border-b border-gray-700 pb-0.5 mt-0.5 font-serif">EXPERIENCE</p>
                          <div className="flex justify-between font-bold text-gray-900 text-[7.5px]"><span>VP of Engineering — Enterprise Corp</span><span>2019 – Present</span></div>
                        </div>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-[#A6FF5D] text-black font-bold text-[10px] px-3 py-1 rounded-full shadow-lg">
                        Click to Preview Live PDF
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-4">{tmpl.description}</p>

                  <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                    <div>
                      <span className="text-zinc-500">Font:</span> <span className="text-zinc-200 font-semibold">{tmpl.font}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Accent:</span> <span className="text-zinc-200 font-semibold">{tmpl.accent}</span>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Launch Builder Hero Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleUseTemplate(selectedTemplateId)}
                className="w-full bg-[#A6FF5D] hover:bg-[#b8ff7a] text-black font-extrabold py-4 px-6 rounded-2xl transition-all duration-200 shadow-xl shadow-[#A6FF5D]/20 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2 text-base border border-[#A6FF5D]"
              >
                <span>Use {selectedTemplate.name} in Builder →</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Live PDF Preview Viewer (7 Columns) */}
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-800 rounded-3xl p-4 shadow-2xl flex flex-col h-[780px] lg:sticky lg:top-24">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3 px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A6FF5D] animate-ping" />
                <h3 className="text-sm font-bold text-white">Live Style Preview: <span className="text-[#A6FF5D]">{selectedTemplate.name}</span></h3>
              </div>
              <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
                {selectedTemplate.atsScore}
              </span>
            </div>

            <div className="flex-1 bg-zinc-900 rounded-2xl overflow-hidden relative flex flex-col justify-center items-center border border-zinc-800">
              {loadingPreview && (
                <div className="absolute inset-0 z-10 bg-zinc-950/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                  <div className="w-7 h-7 border-2 border-[#A6FF5D] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-zinc-300 font-medium animate-pulse">Rendering {selectedTemplate.name} sample PDF...</p>
                </div>
              )}

              {previewPdfUrl ? (
                <iframe
                  src={`${previewPdfUrl}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full rounded-xl border-0 bg-zinc-900"
                  title="Template Sample PDF Preview"
                />
              ) : (
                <p className="text-xs text-zinc-500">Loading sample preview...</p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
