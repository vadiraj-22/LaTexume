import React, { useState, useRef, useEffect } from 'react'
import { API_URL } from '../config/api'

const ResumeImporter = ({ isOpen, onClose, onImportData }) => {
  const [activeTab, setActiveTab] = useState('upload') // 'upload' | 'paste'
  const [file, setFile] = useState(null)
  const [pastedText, setPastedText] = useState('')
  const [isParsing, setIsParsing] = useState(false)
  const [error, setError] = useState('')
  const [parsedResult, setParsedResult] = useState(null) // { data, isAiParsed, aiError, retryAfterSeconds }
  const [countdown, setCountdown] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (parsedResult && !parsedResult.isAiParsed && parsedResult.aiError) {
      const initialSeconds = parsedResult.retryAfterSeconds || 60
      setCountdown(initialSeconds)
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    } else {
      setCountdown(null)
    }
  }, [parsedResult])

  if (!isOpen) return null

  const handleFileDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (validateFile(droppedFile)) {
        setFile(droppedFile)
        setError('')
      }
    }
  }

  const validateFile = (selectedFile) => {
    const validTypes = ['application/pdf', 'text/plain']
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.pdf') && !selectedFile.name.endsWith('.txt')) {
      setError('Please upload a valid PDF or text (.txt) file.')
      return false
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit.')
      return false
    }
    return true
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      if (validateFile(selected)) {
        setFile(selected)
        setError('')
      }
    }
  }

  const handleParse = async () => {
    setError('')

    const isUploadingFile = activeTab === 'upload' || (file && !pastedText.trim())

    if (isUploadingFile && !file) {
      setError('Please select or drop a PDF or text file first.')
      return
    }
    if (!isUploadingFile && !pastedText.trim()) {
      setError('Please paste your resume text.')
      return
    }

    setIsParsing(true)

    try {
      let response
      if (isUploadingFile) {
        const formData = new FormData()
        formData.append('file', file)
        response = await fetch(`${API_URL}/api/parse-resume`, {
          method: 'POST',
          body: formData,
        })
      } else {
        response = await fetch(`${API_URL}/api/parse-resume`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText: pastedText }),
        })
      }

      const result = await response.json()
      if (response.ok && result.success) {
        setParsedResult(result)
      } else {
        setError(result.message || 'Failed to parse resume.')
      }
    } catch (err) {
      console.error('Parsing error:', err)
      setError('Network error. Please make sure the backend server is running.')
    } finally {
      setIsParsing(false)
    }
  }

  const handleApply = (mode) => {
    if (parsedResult?.data) {
      onImportData(parsedResult.data, mode)
      handleCloseModal()
    }
  }

  const handleCloseModal = () => {
    setFile(null)
    setPastedText('')
    setError('')
    setParsedResult(null)
    setIsParsing(false)
    setCountdown(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in-up">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Auto-Fill from Old Resume</h2>
              <p className="text-xs text-gray-400">Import PDF or text to automatically populate your builder form</p>
            </div>
          </div>
          <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* If parsing is done, show preview */}
          {parsedResult ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <div
                  className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border ${
                    parsedResult.isAiParsed
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-medium text-sm">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>
                      {parsedResult.isAiParsed
                        ? `Successfully extracted data using ${parsedResult.aiProvider || 'AI'} ✨`
                        : countdown !== null && countdown > 0
                        ? `Extracted using Built-in Engine ⚡ (AI Rate-Limited — Recharging in ${countdown}s)`
                        : countdown === 0
                        ? 'Extracted using Built-in Engine ⚡ (AI Recharged ✨)'
                        : 'Extracted data using built-in parsing engine ⚡'}
                    </span>
                  </div>

                  {!parsedResult.isAiParsed && countdown === 0 && (
                    <button
                      onClick={() => {
                        setParsedResult(null)
                        handleParse()
                      }}
                      className="mt-2 sm:mt-0 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 font-semibold"
                    >
                      <span>✨ Retry with AI</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Extracted Data Summary */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Extracted Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <span className="text-gray-400 block text-xs">Name & Contact</span>
                    <span className="text-white font-medium">{parsedResult.data.header.name || 'Not detected'}</span>
                    <span className="text-gray-400 block text-xs truncate">{parsedResult.data.header.email}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <span className="text-gray-400 block text-xs">Skills Categories</span>
                    <span className="text-white font-medium">{parsedResult.data.skills.length} categories extracted</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <span className="text-gray-400 block text-xs">Work Experience</span>
                    <span className="text-white font-medium">{parsedResult.data.experience.length} position(s) found</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <span className="text-gray-400 block text-xs">Projects</span>
                    <span className="text-white font-medium">{parsedResult.data.projects.length} project(s) found</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <span className="text-gray-400 block text-xs">Education</span>
                    <span className="text-white font-medium">{parsedResult.data.education.length} entry(ies) found</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <span className="text-gray-400 block text-xs">Certifications & Achievements</span>
                    <span className="text-white font-medium">{parsedResult.data.certifications.length} bullet(s) found</span>
                  </div>
                </div>
              </div>

              {/* Apply Action Buttons */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleApply('replace')}
                  className="flex-1 bg-primary hover:bg-primary/90 text-black font-semibold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Replace All Existing Data
                </button>
                <button
                  onClick={() => handleApply('merge')}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 px-4 rounded-xl border border-white/20 transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Merge / Append Data
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="flex border-b border-white/10 bg-black/20 p-1 rounded-xl">
                <button
                  onClick={() => {
                    setActiveTab('upload')
                    setError('')
                  }}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${
                    activeTab === 'upload' ? 'bg-primary text-black shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  📄 Upload Resume File (PDF/TXT)
                </button>
                <button
                  onClick={() => {
                    setActiveTab('paste')
                    setError('')
                  }}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition ${
                    activeTab === 'paste' ? 'bg-primary text-black shadow' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  📋 Paste Resume Text
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Upload Tab */}
              {activeTab === 'upload' && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/20 hover:border-primary/50 bg-white/5 hover:bg-white/10 transition rounded-2xl p-8 text-center cursor-pointer space-y-4"
                >
                  <input ref={fileInputRef} type="file" accept=".pdf,.txt" onChange={handleFileChange} className="hidden" />
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/20">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    {file ? (
                      <div className="text-primary font-semibold text-base">{file.name}</div>
                    ) : (
                      <>
                        <p className="text-white font-medium text-base">Drag & drop your PDF or TXT resume here</p>
                        <p className="text-xs text-gray-400 mt-1">Supports PDF & TXT up to 10MB</p>
                      </>
                    )}
                  </div>
                  <button type="button" className="text-xs bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition font-medium">
                    {file ? 'Change Selected File' : 'Browse Files'}
                  </button>
                </div>
              )}

              {/* Paste Text Tab */}
              {activeTab === 'paste' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">Paste Resume Content</label>
                  <textarea
                    rows={8}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste your raw resume text here (Name, Contact, Education, Experience, Projects...)"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-primary transition resize-y font-mono"
                  />
                </div>
              )}

              {/* Extract Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleParse}
                  disabled={isParsing}
                  className="w-full bg-primary hover:bg-primary/90 text-black font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isParsing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Extracting Resume Data...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Extract & Preview Data</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResumeImporter
