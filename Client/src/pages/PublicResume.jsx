import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

export default function PublicResume() {
  const { id } = useParams()
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
  const pdfEndpoint = `${API_URL}/api/v1/resumes/public/${id}/pdf`

  useEffect(() => {
    const fetchPublicResume = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`${API_URL}/api/v1/resumes/public/${id}`)
        const data = await res.json()
        if (data.success && data.data) {
          setResume(data.data)
        } else {
          setError(data.message || 'Public resume not found or link has expired.')
        }
      } catch (err) {
        setError('Network error loading public resume.')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchPublicResume()
  }, [id])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const candidateName = resume?.formData?.header?.name || resume?.owner?.fullName || 'Candidate'
  const resumeTitle = resume?.title || `${candidateName}'s Resume`

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-[#A6FF5D] selection:text-black">
      <SEO
        title={`${resumeTitle} | LaTexume`}
        description={`View and download ${candidateName}'s ATS-optimized LaTeX resume on LaTexume.`}
      />
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        {loading && (
          <div className="text-center py-20 space-y-4">
            <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-zinc-400 animate-pulse">Loading public resume preview...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-zinc-950 p-8 sm:p-12 rounded-3xl border border-zinc-800 text-center max-w-lg mx-auto space-y-4 my-12">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto text-xl font-bold">
              ✕
            </div>
            <h2 className="text-2xl font-bold text-white">Resume Unavailable</h2>
            <p className="text-sm text-zinc-400">{error}</p>
            <div className="pt-4">
              <Link
                to="/"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-6 py-2.5 rounded-xl text-sm transition"
              >
                Go to LaTexume Home
              </Link>
            </div>
          </div>
        )}

        {resume && !loading && (
          <div className="space-y-6 animate-fade-in-down">
            {/* Candidate Header Bar */}
            <div className="bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-semibold">
                    🌐 Verified Public Resume
                  </span>
                  <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
                    👁️ {resume.viewsCount || 1} Views
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                  {candidateName}
                </h1>
                <p className="text-zinc-400 text-sm mt-1">{resumeTitle}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-zinc-700 transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>{copied ? '✓ Link Copied!' : '📋 Copy Share Link'}</span>
                </button>
                <a
                  href={pdfEndpoint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-950/40 flex items-center gap-1.5"
                >
                  <span>📥 Download PDF</span>
                </a>
              </div>
            </div>

            {/* Embedded PDF Viewer */}
            <div className="bg-zinc-950 p-3 rounded-3xl border border-zinc-800 shadow-2xl h-[calc(100vh-220px)] min-h-[600px] overflow-hidden">
              <object
                data={pdfEndpoint}
                type="application/pdf"
                className="w-full h-full rounded-2xl"
              >
                <div className="p-8 text-center text-zinc-400 text-sm">
                  <p className="mb-3">Your browser does not support inline PDF previews.</p>
                  <a
                    href={pdfEndpoint}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 underline font-bold"
                  >
                    Click here to open and download candidate PDF
                  </a>
                </div>
              </object>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
