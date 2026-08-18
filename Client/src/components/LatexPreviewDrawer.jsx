import React, { useEffect, useState } from 'react'
import PdfCanvasViewer from './PdfCanvasViewer'

export default function LatexPreviewDrawer({ isOpen, onClose, formData }) {
  const [activeTab, setActiveTab] = useState('pdf') // 'pdf' | 'tex'
  const [pdfUrl, setPdfUrl] = useState('')
  const [texSource, setTexSource] = useState('')
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [loadingTex, setLoadingTex] = useState(false)
  const [pdfError, setPdfError] = useState('')
  const [copied, setCopied] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

  // Compile PDF Blob
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
        if (pdfUrl) window.URL.revokeObjectURL(pdfUrl)
        setPdfUrl(url)
      } else {
        const err = await response.json()
        setPdfError(err.message || 'Failed to compile PDF.')
      }
    } catch (e) {
      setPdfError('Network error compiling PDF preview.')
    } finally {
      setLoadingPdf(false)
    }
  }

  // Fetch Raw .tex string
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

  useEffect(() => {
    if (isOpen) {
      fetchPdf()
      fetchTex()
    }
  }, [isOpen])

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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col md:flex-row justify-end">
      {/* Backdrop overlay area */}
      <div className="hidden md:block flex-1" onClick={onClose} />

      {/* Drawer Container */}
      <div className="w-full md:w-[650px] lg:w-[750px] h-full bg-zinc-950 border-l border-zinc-800 flex flex-col shadow-2xl animate-fade-in-right">
        {/* Top Bar */}
        <div className="p-3 sm:p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveTab('pdf')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'pdf'
                    ? 'bg-[#A6FF5D] text-black shadow font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                📄 PDF Preview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('tex')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'tex'
                    ? 'bg-[#A6FF5D] text-black shadow font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                💻 Raw .tex
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'pdf' && (
              <button
                type="button"
                onClick={fetchPdf}
                disabled={loadingPdf}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-3 py-1.5 rounded-lg transition border border-zinc-700 cursor-pointer"
              >
                {loadingPdf ? 'Refreshing...' : '🔄 Refresh'}
              </button>
            )}

            {activeTab === 'tex' && (
              <>
                <button
                  type="button"
                  onClick={handleCopyTex}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-3 py-1.5 rounded-lg transition border border-zinc-700 cursor-pointer"
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadTex}
                  className="text-xs bg-[#A6FF5D]/15 text-[#A6FF5D] hover:bg-[#A6FF5D]/25 font-medium px-3 py-1.5 rounded-lg transition border border-[#A6FF5D]/30 cursor-pointer"
                >
                  📥 Download
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white text-lg font-bold px-2.5 py-1 rounded-lg hover:bg-zinc-800 cursor-pointer"
              aria-label="Close Preview Drawer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden p-2 sm:p-4">
          {/* TAB 1: PDF Canvas Viewer */}
          {activeTab === 'pdf' && (
            <div className="w-full h-full bg-zinc-900 rounded-xl overflow-hidden flex flex-col border border-zinc-800">
              <PdfCanvasViewer
                pdfUrl={pdfUrl}
                loading={loadingPdf}
                error={pdfError}
                onRetry={fetchPdf}
              />
            </div>
          )}

          {/* TAB 2: Raw LaTeX Source Code */}
          {activeTab === 'tex' && (
            <div className="w-full h-full bg-zinc-950 rounded-xl p-4 overflow-y-auto font-mono text-xs text-zinc-300 border border-zinc-800">
              {loadingTex ? (
                <p className="text-zinc-500 animate-pulse">Generating LaTeX source code...</p>
              ) : (
                <pre className="whitespace-pre-wrap select-all leading-relaxed">
                  {texSource}
                </pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

