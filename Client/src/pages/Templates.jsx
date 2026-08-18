import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { API_URL } from '../config/api'

const TEMPLATES = [
  {
    id: 'jake',
    name: "Jake's Clean ATS",
    tagline: 'Industry Standard for Software Engineers',
    badge: 'Popular Choice',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    description: 'Clean single-column monochrome design trusted by software engineers and DevOps specialists applying to top tech firms (Google, Meta, Amazon).',
    shortExplanation: 'Clean single-column monochrome layout trusted by top software engineers.',
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
    shortExplanation: 'Vibrant blue headers and section titles for clean visual hierarchy.',
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
    shortExplanation: 'Traditional serif typography designed for senior engineering leads and managers.',
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
    linkedin: 'https://linkedin.com/in/alexrivera',
    github: 'https://github.com/alexrivera',
    portfolio: 'https://alexrivera.dev',
    location: 'San Francisco, CA',
  },
  objective: 'Senior Full Stack Engineer with 6+ years of experience architecting scalable cloud microservices, real-time web applications, and AI platforms. Proven track record driving performance optimizations for high-throughput distributed systems.',
  sectionOrder: ['skills', 'experience', 'projects', 'education', 'certifications'],
  skills: [
    { label: 'Languages', skills: 'TypeScript, JavaScript, Python, Go, Java, SQL, HTML5/CSS3' },
    { label: 'Frontend', skills: 'React, Next.js, Redux, TailwindCSS, Vue.js, GraphQL, REST APIs' },
    { label: 'Backend & Cloud', skills: 'Node.js, Express, FastAPI, PostgreSQL, MongoDB, Docker, AWS, Redis' },
    { label: 'Developer Tools', skills: 'Git, GitHub Actions, CI/CD, Jest, Vite, Linux, NGINX, LaTeX' },
  ],
  experience: [
    {
      company: 'Apex Cloud Systems',
      title: 'Senior Full Stack Engineer',
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
      title: 'Software Engineer',
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
      technologies: 'React, Node.js, Express, Docker, MongoDB',
      date: '2024',
      liveLink: 'https://latexume.vercel.app',
      githubLink: 'https://github.com/alexrivera/latexume',
      bullets: [
        'Built open-source LaTeX resume generator with live PDF preview, ATS keyword matching, and AI bullet optimization.',
        'Containerized LaTeX compilation environment in Docker to achieve sub-second PDF generation speeds across 100,000+ downloads.',
      ],
    },
    {
      name: 'Distributed Vector DB Visualizer',
      technologies: 'Python, FastAPI, React, D3.js, Embeddings',
      date: '2023',
      liveLink: 'https://vectorviz.dev',
      githubLink: 'https://github.com/alexrivera/vector-viz',
      bullets: [
        'Created interactive 3D spatial visualization tool for high-dimensional vector embeddings, adopted by 3,000+ ML developers.',
      ],
    },
  ],
  education: [
    {
      institution: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science & Engineering',
      field: 'GPA: 3.89 / 4.0',
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
      issuer: 'Cloud Native Computing Foundation',
      date: '2022',
    },
  ],
}

export default function Templates() {
  const navigate = useNavigate()
  const [selectedTemplateId, setSelectedTemplateId] = useState('jake')
  const [previewPdfUrl, setPreviewPdfUrl] = useState('')
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [previewError, setPreviewError] = useState(false)

  const selectedTemplate = TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0]

  const getPayloadData = () => {
    let baseData = SAMPLE_RESUME_DATA
    const savedDraft = localStorage.getItem('latexume_draft')
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        if (parsed?.header?.name || parsed?.experience?.length > 0) {
          baseData = parsed
        }
      } catch (e) {
        console.warn('Draft parse error:', e)
      }
    }

    return {
      ...baseData,
      header: {
        ...baseData?.header,
        phone: baseData?.header?.phone ? '+1 (555) 000-0000' : '',
        email: baseData?.header?.email ? 'user@example.com' : '',
        location: baseData?.header?.location ? 'City, State' : '',
      },
      templateId: selectedTemplateId,
    }
  }

  const fetchSamplePdf = async () => {
    setLoadingPreview(true)
    setPreviewError(false)
    try {
      const payload = getPayloadData()
      const response = await fetch(`${API_URL}/api/generate-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        setPreviewPdfUrl(url)
      } else {
        setPreviewError(true)
      }
    } catch (e) {
      console.warn('Failed to load sample preview:', e)
      setPreviewError(true)
    } finally {
      setLoadingPreview(false)
    }
  }

  useEffect(() => {
    fetchSamplePdf()
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

      <main className="flex-1 pt-36 sm:pt-40 pb-16 px-4 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto w-full flex flex-col items-center">
        {/* Header */}
        <div className="text-center space-y-3 mb-10 animate-fade-in-down w-full max-w-3xl mx-auto flex flex-col items-center">
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

        {/* Split View: Compact Template Selectors on Left, Live PDF Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          {/* LEFT: Compact Square Template Cards (5 Columns on Desktop) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Select Style ({TEMPLATES.length})
              </span>
              <span className="text-xs text-[#A6FF5D] font-semibold">
                Click card to preview →
              </span>
            </div>

            {/* Vertical Stack of Text-Only Template Cards (One Below the Other) */}
            <div className="flex flex-col gap-3">
              {TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateId(tmpl.id)}
                    className={`bg-zinc-950 p-4 rounded-2xl border transition-all duration-200 shadow-lg cursor-pointer relative group flex flex-col gap-2 ${
                      isSelected
                        ? 'border-[#A6FF5D] ring-2 ring-[#A6FF5D]/30 bg-zinc-900/90 scale-[1.01]'
                        : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/80 hover:bg-zinc-900/50'
                    }`}
                  >
                    {/* Top Row: Title + Badge + Score + Active status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-bold transition ${isSelected ? 'text-[#A6FF5D]' : 'text-white group-hover:text-[#A6FF5D]'}`}>
                          {tmpl.name}
                        </h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tmpl.badgeColor}`}>
                          {tmpl.badge}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-zinc-400 font-semibold">
                          {tmpl.atsScore.split(' ')[0]}
                        </span>
                        {isSelected && (
                          <span className="text-[10px] font-extrabold text-black bg-[#A6FF5D] px-2.5 py-0.5 rounded-full">
                            ✓ Active
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Text-Only ~10-word Explanation */}
                    <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                      {tmpl.shortExplanation}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Launch Builder Action */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleUseTemplate(selectedTemplateId)}
                className="w-full bg-[#A6FF5D] hover:bg-[#b8ff7a] text-black font-extrabold py-3.5 px-5 rounded-2xl shadow-xl shadow-[#A6FF5D]/20 text-sm flex items-center justify-center gap-2 border border-[#A6FF5D] transition cursor-pointer hover:scale-[1.01] active:scale-95"
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
              {loadingPreview ? (
                <div className="absolute inset-0 z-10 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-[#A6FF5D] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-zinc-300 font-medium animate-pulse">
                    Compiling {selectedTemplate.name} sample PDF...
                  </p>
                </div>
              ) : previewPdfUrl ? (
                <div className="w-full h-full rounded-xl overflow-hidden relative bg-zinc-900 flex justify-center items-center">
                  <iframe
                    src={`${previewPdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                    className="min-w-[calc(100%+32px)] w-[calc(100%+32px)] -mr-[32px] h-full border-0 bg-zinc-900"
                    title="Template Sample PDF Preview"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
                  <span className="text-2xl">⚠️</span>
                  <p className="text-xs text-zinc-400 font-medium">
                    Unable to load online preview right now
                  </p>
                  <button
                    type="button"
                    onClick={fetchSamplePdf}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold border border-zinc-700 transition"
                  >
                    🔄 Retry Live Preview
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
