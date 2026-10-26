import React, { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.js?url'

// Configure PDF.js worker: use locally bundled Vite asset first, fallback to CDN
try {
  if (pdfWorker) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker
  } else {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
  }
} catch (_) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
}

export default function PdfCanvasViewer({ pdfUrl, loading, error, onRetry }) {
  const containerRef = useRef(null)
  const lastWidthRef = useRef(0)
  const [containerWidth, setContainerWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return Math.min(window.innerWidth - 32, 750)
    }
    return 550
  })
  const [numPages, setNumPages] = useState(0)
  const [rendering, setRendering] = useState(false)
  const [renderError, setRenderError] = useState('')
  const [pages, setPages] = useState([])
  const [zoomScale, setZoomScale] = useState(1.0)
  const pdfDocRef = useRef(null)

  // Track container width accurately with ResizeObserver (debounced threshold)
  useEffect(() => {
    if (!containerRef.current) return

    const updateWidth = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth
        if (w > 0 && Math.abs(w - lastWidthRef.current) > 8) {
          lastWidthRef.current = w
          setContainerWidth(w)
        }
      }
    }

    updateWidth()

    const handleResize = (entries) => {
      for (const entry of entries) {
        const width = entry.contentRect?.width || containerRef.current?.clientWidth
        if (width && width > 0 && Math.abs(width - lastWidthRef.current) > 8) {
          lastWidthRef.current = width
          setContainerWidth(width)
        }
      }
    }

    const observer = new ResizeObserver(handleResize)
    observer.observe(containerRef.current)
    window.addEventListener('resize', updateWidth)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateWidth)
    }
  }, [])

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
        let loadingTask

        // If pdfUrl is a blob: or data: URL, fetch the binary buffer on the main thread.
        // This avoids the common WebKit / mobile Safari issue where Web Workers
        // fail when attempting to fetch main-thread blob: URLs.
        if (typeof pdfUrl === 'string' && (pdfUrl.startsWith('blob:') || pdfUrl.startsWith('data:'))) {
          const resp = await fetch(pdfUrl)
          const arrayBuffer = await resp.arrayBuffer()
          const data = new Uint8Array(arrayBuffer)
          loadingTask = pdfjsLib.getDocument({ data })
        } else if (pdfUrl instanceof ArrayBuffer || pdfUrl instanceof Uint8Array) {
          loadingTask = pdfjsLib.getDocument({ data: pdfUrl })
        } else {
          loadingTask = pdfjsLib.getDocument({ url: pdfUrl })
        }

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

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.15, 2.2))
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev - 0.15, 0.6))
  const handleZoomReset = () => setZoomScale(1.0)

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col items-center justify-start overflow-y-auto relative bg-zinc-950 p-2 sm:p-4">
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
              <>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-[#A6FF5D] text-gray-950 font-bold px-4 py-2 rounded-xl hover:bg-[#b8ff7a] transition shadow-md inline-flex items-center gap-1"
                >
                  <span>↗ Open PDF directly</span>
                </a>
                <a
                  href={pdfUrl}
                  download="resume.pdf"
                  className="text-xs bg-zinc-800 text-zinc-200 hover:text-white font-semibold px-3 py-2 rounded-xl transition border border-zinc-700 inline-flex items-center gap-1"
                >
                  <span>📥 Download</span>
                </a>
              </>
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
        <div className="w-full flex flex-col items-center gap-4 py-2">
          {pages.map((pageNum) => (
            <PdfSinglePageCanvas
              key={pageNum}
              pdfDoc={pdfDocRef.current}
              pageNum={pageNum}
              containerWidth={containerWidth}
              zoomScale={zoomScale}
            />
          ))}

          {/* Quick Action & Zoom Toolbar underneath canvas */}
          <div className="sticky bottom-2 z-10 bg-zinc-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-800 shadow-xl flex items-center gap-2 sm:gap-3 text-xs max-w-full overflow-x-auto">
            {/* Zoom Controls */}
            <div className="flex items-center bg-zinc-950 rounded-lg p-0.5 border border-zinc-800">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomScale <= 0.65}
                className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40 transition font-bold"
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                −
              </button>
              <button
                type="button"
                onClick={handleZoomReset}
                className="px-1.5 text-[10px] text-zinc-400 hover:text-white font-mono"
                title="Reset Zoom to 100%"
              >
                {Math.round(zoomScale * 100)}%
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomScale >= 2.1}
                className="w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-40 transition font-bold"
                title="Zoom In"
                aria-label="Zoom In"
              >
                +
              </button>
            </div>

            <span className="text-zinc-600 hidden sm:inline">•</span>

            <span className="text-zinc-400 text-[11px] font-medium hidden sm:inline whitespace-nowrap">
              Page 1 of {numPages}
            </span>

            <span className="text-zinc-600">•</span>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#A6FF5D] font-bold hover:underline inline-flex items-center gap-1 whitespace-nowrap text-xs"
            >
              <span>↗ Open</span>
            </a>

            <a
              href={pdfUrl}
              download="resume.pdf"
              className="text-zinc-300 hover:text-white inline-flex items-center gap-1 whitespace-nowrap text-xs"
              title="Download Resume PDF"
            >
              <span>📥 Download</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

function PdfSinglePageCanvas({ pdfDoc, pageNum, containerWidth, zoomScale = 1.0 }) {
  const canvasRef = useRef(null)
  const renderTaskRef = useRef(null)
  const [rendered, setRendered] = useState(false)

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return
    let isCancelled = false

    const renderPage = async () => {
      try {
        // Cancel previous render task if still active
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel()
          } catch (_) {}
          renderTaskRef.current = null
        }

        const page = await pdfDoc.getPage(pageNum)
        if (isCancelled || !canvasRef.current) return

        // Compute responsive scale to fit container width smoothly on mobile and desktop
        const unscaledViewport = page.getViewport({ scale: 1.0 })
        const effectiveContainerW = containerWidth > 0
          ? containerWidth
          : (typeof window !== 'undefined' ? window.innerWidth - 32 : 550)
        
        // Base fit width capped between 160px and 750px
        const availableWidth = Math.max(160, Math.min(effectiveContainerW - 16, 750))
        const fitScale = availableWidth / unscaledViewport.width
        const cssScale = Math.min(2.5, Math.max(0.35, fitScale * zoomScale))
        const displayViewport = page.getViewport({ scale: cssScale })

        // High-DPI super-sampling factor (capped at 2.5 for mobile GPU memory efficiency)
        const dpr = Math.min(Math.max(window.devicePixelRatio || 1, 2), 2.5)
        const renderViewport = page.getViewport({ scale: cssScale * dpr })

        const canvas = canvasRef.current
        const context = canvas.getContext('2d', { alpha: false })

        // Set backing store dimensions (high resolution)
        canvas.width = Math.floor(renderViewport.width)
        canvas.height = Math.floor(renderViewport.height)

        // Set display CSS size (crisp vector rendering, responsive max-width)
        canvas.style.width = `${Math.floor(displayViewport.width)}px`
        canvas.style.height = `${Math.floor(displayViewport.height)}px`
        canvas.style.maxWidth = '100%'

        const renderContext = {
          canvasContext: context,
          viewport: renderViewport,
        }

        const renderTask = page.render(renderContext)
        renderTaskRef.current = renderTask

        await renderTask.promise
        if (!isCancelled) {
          setRendered(true)
        }
      } catch (e) {
        if (e?.name !== 'RenderingCancelledException') {
          console.warn(`Page ${pageNum} render error:`, e)
        }
      }
    }

    renderPage()

    return () => {
      isCancelled = true
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel()
        } catch (_) {}
        renderTaskRef.current = null
      }
    }
  }, [pdfDoc, pageNum, containerWidth, zoomScale])

  return (
    <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-zinc-700/50 max-w-full transition-all duration-200 flex justify-center p-0.5">
      <canvas ref={canvasRef} className="block mx-auto max-w-full h-auto" />
    </div>
  )
}
