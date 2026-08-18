import React, { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

// Set PDF.js worker URL matching version 3.11.174
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

export default function PdfCanvasViewer({ pdfUrl, loading, error, onRetry }) {
  const containerRef = useRef(null)
  const [numPages, setNumPages] = useState(0)
  const [rendering, setRendering] = useState(false)
  const [renderError, setRenderError] = useState('')
  const [pages, setPages] = useState([]) // Array of rendered page canvas data or element refs
  const pdfDocRef = useRef(null)

  // Effect to load PDF document when pdfUrl changes
  useEffect(() => {
    if (!pdfUrl) {
      pdfDocRef.current = null
      setNumPages(0)
      setPages([])
      return
    }

    let isMounted = true
    setRendering(true)
    setRenderError('')

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({ url: pdfUrl })
        const pdfDoc = await loadingTask.promise
        if (!isMounted) return

        pdfDocRef.current = pdfDoc
        setNumPages(pdfDoc.numPages)
        setPages(Array.from({ length: pdfDoc.numPages }, (_, i) => i + 1))
      } catch (err) {
        console.warn('PDF.js failed to load document:', err)
        if (isMounted) {
          setRenderError('Could not render inline PDF canvas. You can open or download the PDF directly below.')
        }
      } finally {
        if (isMounted) {
          setRendering(false)
        }
      }
    }

    loadPdf()

    return () => {
      isMounted = false
    }
  }, [pdfUrl])

  return (
    <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto relative bg-zinc-950 p-2 sm:p-4">
      {/* Loading state overlay */}
      {(loading || rendering) && (
        <div className="absolute inset-0 z-20 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-[#A6FF5D] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-zinc-300 font-semibold animate-pulse">
            Compiling & Rendering Resume PDF...
          </p>
        </div>
      )}

      {/* Main Error / Fallback message */}
      {(error || renderError) && !loading && !rendering && (
        <div className="my-auto p-6 max-w-md text-center bg-zinc-900/90 border border-zinc-800 rounded-2xl space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto text-xl font-bold">
            📄
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-1">PDF Preview Status</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {error || renderError}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-3 py-2 rounded-xl transition border border-zinc-700 cursor-pointer"
              >
                🔄 Retry Compilation
              </button>
            )}
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-[#A6FF5D] text-gray-950 font-bold px-4 py-2 rounded-xl hover:bg-[#b8ff7a] transition shadow-md inline-flex items-center gap-1"
              >
                <span>↗ Open PDF directly</span>
              </a>
            )}
          </div>
        </div>
      )}

      {/* Empty State before PDF is generated */}
      {!pdfUrl && !loading && !error && (
        <div className="my-auto p-6 text-center text-zinc-400 text-xs max-w-sm">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-500 flex items-center justify-center mx-auto mb-3 text-xl">
            📝
          </div>
          <p className="font-semibold text-zinc-200 mb-1">Live Resume Preview</p>
          <p className="text-zinc-500 leading-relaxed">
            Fill in your details in the builder to render your LaTeX resume live.
          </p>
        </div>
      )}

      {/* PDF Rendered Pages */}
      {pdfUrl && !error && pages.length > 0 && (
        <div ref={containerRef} className="w-full flex flex-col items-center gap-4 py-2">
          {pages.map((pageNum) => (
            <PdfSinglePageCanvas
              key={pageNum}
              pdfDoc={pdfDocRef.current}
              pageNum={pageNum}
              containerWidth={containerRef.current?.clientWidth || 400}
            />
          ))}
          {/* Quick Action Toolbar underneath canvas */}
          <div className="sticky bottom-2 z-10 bg-zinc-900/90 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800 shadow-xl flex items-center gap-3 text-xs">
            <span className="text-zinc-400 text-[11px] font-medium">
              Page 1 of {numPages}
            </span>
            <span className="text-zinc-700">•</span>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A6FF5D] font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>↗ Open PDF</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

function PdfSinglePageCanvas({ pdfDoc, pageNum, containerWidth }) {
  const canvasRef = useRef(null)
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return
    let isCancelled = false

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(pageNum)
        if (isCancelled) return

        // Compute scale to fit container width smoothly (max 750px for ideal reading)
        const unscaledViewport = page.getViewport({ scale: 1.0 })
        const targetWidth = Math.min((containerWidth || 400) - 24, 750)
        const scale = Math.max(0.5, targetWidth / unscaledViewport.width)
        const viewport = page.getViewport({ scale })

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        }

        await page.render(renderContext).promise
        if (!isCancelled) {
          setRendered(true)
        }
      } catch (e) {
        console.warn(`Page ${pageNum} render error:`, e)
      }
    }

    renderPage()

    return () => {
      isCancelled = true
    }
  }, [pdfDoc, pageNum, containerWidth])

  return (
    <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-zinc-700/50 max-w-full transition-all duration-200">
      <canvas ref={canvasRef} className="block max-w-full h-auto mx-auto" />
    </div>
  )
}
