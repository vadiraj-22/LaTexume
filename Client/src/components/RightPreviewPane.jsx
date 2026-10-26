import React, { useEffect, useState } from 'react'
import PdfCanvasViewer from './PdfCanvasViewer'
import { API_URL } from '../config/api'

export default function RightPreviewPane({ formData, onBackToEditor }) {
  const [activeTab, setActiveTab] = useState('pdf') // 'pdf' | 'tex'
  const [pdfUrl, setPdfUrl] = useState('')
  const [texSource, setTexSource] = useState('')
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [loadingTex, setLoadingTex] = useState(false)
  const [pdfError, setPdfError] = useState('')
  const [copied, setCopied] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Fetch compiled PDF
  const fetchPdf = async () => {
    setLoadingPdf(true)
    setPdfError('')
    try {
      const response = await fetch(`${API_URL}/api/generate-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        setPdfUrl((prevUrl) => {
          if (prevUrl) window.URL.revokeObjectURL(prevUrl)
          return url
        })
      } else {
        const err = await response.json().catch(() => ({}))
        setPdfError(err.message || 'Failed to compile PDF.')
      }
    } catch (e) {
      setPdfError('Network error compiling PDF preview.')
    } finally {
      setLoadingPdf(false)
    }
  }

  // Fetch Raw LaTeX string
  const fetchTex = async () => {
    setLoadingTex(true)
    try {
      const response = await fetch(`${API_URL}/api/generate-resume/tex`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.success && data.texSource) {
        setTexSource(data.texSource)
      }
    } catch (e) {
      console.warn('Could not fetch LaTeX source code:', e)
    } finally {
      setLoadingTex(false)
    }
  }

  // Spontaneous live refresh on mount and form edits (debounced 350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPdf()
      if (activeTab === 'tex') fetchTex()
    }, 350)

    return () => clearTimeout(timer)
  }, [formData, activeTab])

  const handleCopyTex = () => {
    if (!texSource) return
    navigator.clipboard.writeText(texSource)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleDownloadTex = () => {
    if (!texSource) return
    const blob = new Blob([texSource], { type: 'text/x-tex' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(formData?.header?.name || 'resume').replace(/\s+/g, '_')}.tex`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleDownloadPdf = () => {
    if (!pdfUrl) return
    const a = document.createElement('a')
    a.href = pdfUrl
    a.download = `${(formData?.header?.name || 'resume').replace(/\s+/g, '_')}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div
      className={`bg-zinc-950 border border-zinc-800 rounded-3xl flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? 'fixed top-20 bottom-4 left-4 right-4 z-50 h-[calc(100vh-96px)]'
          : 'w-full h-[calc(100dvh-130px)] sm:h-[calc(100vh-80px)] min-h-[480px] sm:min-h-[700px] lg:sticky lg:top-20'
      }`}
    >
      {/* Header Bar */}
      <div className="p-3 sm:p-3.5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between gap-2 shrink-0 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Back to Form button on mobile */}
          {onBackToEditor && (
            <button
              type="button"
              onClick={onBackToEditor}
              className="lg:hidden bg-zinc-800 hover:bg-zinc-700 text-[#A6FF5D] border border-zinc-700/80 hover:border-[#A6FF5D]/40 font-bold px-2.5 py-1.5 rounded-xl transition flex items-center gap-1 text-xs cursor-pointer"
              title="Return to editing form"
            >
              <span>← Form</span>
            </button>
          )}

          {/* Back to Builder Button when Fullscreen */}
          {isFullscreen && (
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="bg-[#A6FF5D] hover:bg-[#b8ff7a] text-black font-extrabold px-3 py-1.5 rounded-xl transition flex items-center gap-1 text-xs shadow-lg cursor-pointer hover:scale-105 active:scale-95 border border-[#A6FF5D]"
            >
              <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">← Back</span>
            </button>
          )}

          <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800/80">
            <button
              type="button"
              onClick={() => {
                setActiveTab('pdf')
                if (!pdfUrl) fetchPdf()
              }}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'pdf'
                  ? 'bg-[#A6FF5D] text-black shadow-md font-extrabold border border-[#A6FF5D]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              📄 Live PDF
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('tex')
                fetchTex()
              }}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'tex'
                  ? 'bg-[#A6FF5D] text-black shadow-md font-extrabold border border-[#A6FF5D]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              💻 Raw .tex
            </button>
          </div>

          {loadingPdf ? (
            <span className="text-[10px] sm:text-[11px] font-medium text-[#A6FF5D] bg-[#A6FF5D]/10 border border-[#A6FF5D]/30 px-2 py-0.5 sm:py-1 rounded-full animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A6FF5D] animate-ping" />
              <span>Syncing...</span>
            </span>
          ) : (
            <span className="text-[10px] sm:text-[11px] font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 sm:py-1 rounded-full hidden sm:flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A6FF5D]" />
              <span>Live Sync</span>
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {activeTab === 'pdf' && (
            <>
              <button
                type="button"
                onClick={fetchPdf}
                disabled={loadingPdf}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-2.5 py-1.5 rounded-lg transition border border-zinc-700 cursor-pointer flex items-center gap-1"
                title="Recompile PDF"
              >
                <span>{loadingPdf ? '⏳' : '🔄'}</span>
                <span className="hidden sm:inline">{loadingPdf ? 'Compiling...' : 'Refresh'}</span>
              </button>

              {pdfUrl && (
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="text-xs bg-[#A6FF5D] text-gray-950 font-extrabold px-2.5 py-1.5 rounded-lg transition border border-[#A6FF5D] cursor-pointer hover:bg-[#b8ff7a] flex items-center gap-1 shadow-sm"
                  title="Download Compiled PDF"
                >
                  <span>📥</span>
                  <span className="hidden sm:inline">PDF</span>
                </button>
              )}
            </>
          )}

          {activeTab === 'tex' && (
            <>
              <button
                type="button"
                onClick={handleCopyTex}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-2.5 py-1.5 rounded-lg transition border border-zinc-700 cursor-pointer"
              >
                {copied ? '✓ Copied!' : '📋 Copy'}
              </button>
              <button
                type="button"
                onClick={handleDownloadTex}
                className="text-xs bg-[#A6FF5D]/15 text-[#A6FF5D] hover:bg-[#A6FF5D]/25 font-semibold px-2.5 py-1.5 rounded-lg transition border border-[#A6FF5D]/30 cursor-pointer"
              >
                📥 .tex
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold px-2 py-1.5 rounded-lg border border-zinc-700 transition cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? '↘' : '⤢'}
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-hidden p-2 sm:p-2.5 bg-zinc-950/60 min-h-0">
        {/* PDF TAB */}
        {activeTab === 'pdf' && (
          <div className="w-full h-full bg-zinc-900 rounded-2xl overflow-hidden flex flex-col border border-zinc-800/80 relative">
            <PdfCanvasViewer
              pdfUrl={pdfUrl}
              loading={loadingPdf}
              error={pdfError}
              onRetry={fetchPdf}
            />
          </div>
        )}

        {/* RAW TEX TAB */}
        {activeTab === 'tex' && (
          <div className="w-full h-full bg-zinc-950 rounded-2xl p-4 overflow-y-auto font-mono text-[11px] text-zinc-300 border border-zinc-800">
            {loadingTex ? (
              <p className="text-zinc-500 animate-pulse">Generating LaTeX source code...</p>
            ) : (
              <pre className="whitespace-pre-wrap select-all leading-relaxed">
                {texSource || 'Fill in form fields to see generated LaTeX source code.'}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
