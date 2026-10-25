import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEO from '../components/SEO'
import { API_URL } from '../config/api'

const DEFAULT_SAMPLE_RESUME = {
  header: {
    name: 'Alex Rivera',
    email: 'alex.rivera@example.com',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
  },
  skills: [
    { label: 'Languages', skills: 'TypeScript, JavaScript, Python, Go, SQL' },
    { label: 'Frameworks', skills: 'React, Next.js, Node.js, Express, TailwindCSS, REST APIs' },
    { label: 'Cloud & Tools', skills: 'Docker, AWS, Git, CI/CD, Linux, MongoDB, PostgreSQL' },
  ],
  experience: [
    {
      company: 'Apex Cloud Systems',
      title: 'Senior Full Stack Engineer',
      startDate: '2022',
      endDate: 'Present',
      bullets: ['Architected microservices handling 5M+ daily requests in TypeScript and Node.js.'],
    },
  ],
}

export default function AtsOptimizer() {
  const navigate = useNavigate()
  const [jobDescription, setJobDescription] = useState('')
  const [resumeData, setResumeData] = useState(DEFAULT_SAMPLE_RESUME)
  const [loading, setLoading] = useState(false)
  const [matchResult, setMatchResult] = useState(null)
  const [extractedKeywords, setExtractedKeywords] = useState([])
  const [toastMessage, setToastMessage] = useState('')
  const [isSampleResume, setIsSampleResume] = useState(false)
  const [keywordFilter, setKeywordFilter] = useState('all') // 'all' | 'missing' | 'matched'

  // Load current resume draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('latexume_draft')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed?.header?.name || parsed?.skills?.length || parsed?.experience?.length) {
          setResumeData(parsed)
          setIsSampleResume(false)
          return
        }
      } catch (e) {
        // ignore
      }
    }
    setResumeData(DEFAULT_SAMPLE_RESUME)
    setIsSampleResume(true)
  }, [])

const TECH_TAXONOMY = [
  { label: 'React', keys: ['react', 'react.js', 'reactjs'] },
  { label: 'Next.js', keys: ['next', 'next.js', 'nextjs'] },
  { label: 'Node.js', keys: ['node', 'node.js', 'nodejs'] },
  { label: 'TypeScript', keys: ['typescript', 'ts'] },
  { label: 'JavaScript', keys: ['javascript', 'js', 'es6'] },
  { label: 'Python', keys: ['python', 'py'] },
  { label: 'Go', keys: ['golang', 'go'] },
  { label: 'Java', keys: ['java'] },
  { label: 'C++', keys: ['c++'] },
  { label: 'C# / .NET', keys: ['c#', '.net', 'dotnet'] },
  { label: 'Express.js', keys: ['express', 'express.js', 'expressjs'] },
  { label: 'TailwindCSS', keys: ['tailwind', 'tailwindcss'] },
  { label: 'GraphQL', keys: ['graphql'] },
  { label: 'REST API', keys: ['rest', 'restful', 'api', 'apis'] },
  { label: 'Docker', keys: ['docker'] },
  { label: 'Kubernetes', keys: ['kubernetes', 'k8s'] },
  { label: 'AWS', keys: ['aws', 'amazon web services'] },
  { label: 'Azure', keys: ['azure'] },
  { label: 'GCP', keys: ['gcp', 'google cloud'] },
  { label: 'PostgreSQL', keys: ['postgres', 'postgresql'] },
  { label: 'MySQL', keys: ['mysql'] },
  { label: 'MongoDB', keys: ['mongodb', 'mongo'] },
  { label: 'Redis', keys: ['redis'] },
  { label: 'System Design', keys: ['system design', 'architecture'] },
  { label: 'Microservices', keys: ['microservices', 'microservice'] },
  { label: 'CI/CD Pipelines', keys: ['ci/cd', 'ci', 'cd', 'github actions'] },
  { label: 'Git / GitHub', keys: ['git', 'github'] },
  { label: 'Testing / Jest', keys: ['testing', 'jest', 'cypress', 'unit tests'] },
  { label: 'Web Security', keys: ['security', 'auth', 'oauth', 'jwt'] },
  { label: 'Linux / NGINX', keys: ['linux', 'nginx'] },
  { label: 'Agile / Scrum', keys: ['agile', 'scrum'] },
  { label: 'Full Stack', keys: ['fullstack', 'full stack', 'full-stack'] },
  { label: 'Backend Development', keys: ['backend', 'back-end'] },
  { label: 'Frontend Development', keys: ['frontend', 'front-end'] },
]

// Local NLP keyword extraction using Tech Taxonomy (zero AI tokens)
const runLocalKeywordMatch = (jdText, rData) => {
  if (!jdText || !rData) return []
  const cleanJd = jdText.toLowerCase()
  const resumeString = JSON.stringify(rData).toLowerCase()

  const extracted = []
  for (const item of TECH_TAXONOMY) {
    const foundInJd = item.keys.some((k) => {
      const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`(?:^|\\W)${escaped}(?:$|\\W)`, 'i')
      return regex.test(cleanJd)
    })

    if (foundInJd) {
      const isMatchedInResume = item.keys.some((k) => {
        const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(`(?:^|\\W)${escaped}(?:$|\\W)`, 'i')
        return regex.test(resumeString)
      })

      extracted.push({
        keyword: item.label,
        matched: isMatchedInResume,
      })
    }
  }

  return extracted
}

  useEffect(() => {
    if (jobDescription && resumeData) {
      const kw = runLocalKeywordMatch(jobDescription, resumeData)
      setExtractedKeywords(kw)
    } else {
      setExtractedKeywords([])
    }
  }, [jobDescription, resumeData])

  const handleAddSkill = (skillName) => {
    if (!resumeData) return
    const updated = { ...resumeData }
    const skillsList = updated.skills ? [...updated.skills] : []
    if (skillsList.length > 0) {
      const existing = skillsList[0].skills
      skillsList[0] = {
        ...skillsList[0],
        skills: existing ? `${existing}, ${skillName}` : skillName,
      }
    } else {
      skillsList.push({ label: 'Skills', skills: skillName })
    }

    updated.skills = skillsList
    setResumeData(updated)
    localStorage.setItem('latexume_draft', JSON.stringify(updated))

    // Refresh match status
    const kw = runLocalKeywordMatch(jobDescription, updated)
    setExtractedKeywords(kw)

    setToastMessage(`✓ Added "${skillName}" to your Resume Skills!`)
    setTimeout(() => setToastMessage(''), 4000)
  }

  const handleAddAllMissingSkills = () => {
    if (!resumeData || !extractedKeywords.length) return
    const missing = extractedKeywords.filter((k) => !k.matched).map((k) => k.keyword)
    if (!missing.length) {
      setToastMessage('All extracted keywords are already in your resume!')
      setTimeout(() => setToastMessage(''), 4000)
      return
    }

    const updated = { ...resumeData }
    const skillsList = updated.skills ? [...updated.skills] : []
    const newSkillsStr = missing.join(', ')

    if (skillsList.length > 0) {
      const existing = skillsList[0].skills
      skillsList[0] = {
        ...skillsList[0],
        skills: existing ? `${existing}, ${newSkillsStr}` : newSkillsStr,
      }
    } else {
      skillsList.push({ label: 'Skills', skills: newSkillsStr })
    }

    updated.skills = skillsList
    setResumeData(updated)
    localStorage.setItem('latexume_draft', JSON.stringify(updated))

    // Re-trigger keyword match so matched status updates to green ✓
    const kw = runLocalKeywordMatch(jobDescription, updated)
    setExtractedKeywords(kw)

    setToastMessage(`✓ Added ${missing.length} missing ATS skills (${missing.join(', ')}) to your Resume!`)
    setTimeout(() => setToastMessage(''), 5000)
  }

  const handleCopyMissingKeywords = () => {
    const missing = extractedKeywords.filter((k) => !k.matched).map((k) => k.keyword)
    if (!missing.length) {
      setToastMessage('No missing keywords to copy!')
      setTimeout(() => setToastMessage(''), 4000)
      return
    }
    navigator.clipboard.writeText(missing.join(', '))
    setToastMessage(`✓ Copied ${missing.length} missing keywords to clipboard!`)
    setTimeout(() => setToastMessage(''), 4000)
  }

  const handleFillSampleJd = () => {
    const sample = `We are seeking a Senior Full Stack Engineer proficient in React, TypeScript, Node.js, Express, Docker, PostgreSQL, AWS, and REST APIs. Experience with CI/CD pipelines, System Design, GraphQL, Microservices, and Redis is highly preferred. The ideal candidate will architect scalable cloud backend microservices and build responsive frontend user interfaces.`
    setJobDescription(sample)
  }

  const handleClearJd = () => {
    setJobDescription('')
    setMatchResult(null)
    setExtractedKeywords([])
  }

  const handleRunAiAnalysis = async () => {
    if (!jobDescription.trim()) {
      alert('Please paste a job description first.')
      return
    }

    setLoading(true)
    setMatchResult(null)

    try {
      const res = await fetch(`${API_URL}/api/ai/match-jd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          resumeData,
        }),
      })

      const data = await res.json()
      const matchData = data.result || data.match
      if (data.success && matchData) {
        setMatchResult({
          score: matchData.score || 85,
          missingKeywords: matchData.missingKeywords || [],
          matchingKeywords: matchData.matchingKeywords || [],
          suggestions: matchData.suggestions || matchData.feedback || [],
        })
      } else {
        alert(data.message || 'Could not analyze ATS match.')
      }
    } catch (err) {
      alert('Network error running AI ATS match.')
    } finally {
      setLoading(false)
    }
  }

  // Calculations for display
  const matchedList = extractedKeywords.filter((k) => k.matched)
  const missingList = extractedKeywords.filter((k) => !k.matched)
  const realTimeScore = extractedKeywords.length > 0 ? Math.round((matchedList.length / extractedKeywords.length) * 100) : 0
  const activeScore = matchResult ? matchResult.score : realTimeScore

  const filteredKeywords = extractedKeywords.filter((kw) => {
    if (keywordFilter === 'missing') return !kw.matched
    if (keywordFilter === 'matched') return kw.matched
    return true
  })

  // Circular gauge SVG renderer
  const renderCircularGauge = (score) => {
    const radius = 38
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (score / 100) * circumference
    const strokeColor = score >= 80 ? '#A6FF5D' : score >= 60 ? '#facc15' : '#f87171'
    const ratingText = score >= 85 ? 'Outstanding Match' : score >= 70 ? 'Strong Match' : score >= 50 ? 'Moderate Match' : 'Needs Optimization'

    return (
      <div className="flex items-center gap-5">
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              className="text-zinc-800"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke={strokeColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-white">{score}%</span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Match</span>
          </div>
        </div>
        <div>
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
            style={{ color: strokeColor, borderColor: `${strokeColor}40`, backgroundColor: `${strokeColor}15` }}
          >
            {ratingText}
          </span>
          <h3 className="text-lg font-bold text-white mt-1">
            {matchResult ? 'Deep AI Semantic Score' : 'Real-Time ATS Overlap'}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {matchResult 
              ? 'Evaluated across experience, impact verbs, and technical taxonomy.'
              : `${matchedList.length} of ${extractedKeywords.length} required skills verified in resume.`}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col selection:bg-[#A6FF5D] selection:text-black">
      <SEO
        title="ATS Job Description Matcher | LaTexume"
        description="Optimize your resume for ATS parsers. Analyze job descriptions, extract missing keywords, and boost match scores."
      />
      <Navbar />

      <main className="flex-1 pt-36 sm:pt-40 pb-16 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto w-full">
        {/* Toast */}
        {toastMessage && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl text-emerald-400 flex items-center justify-between shadow-lg animate-fade-in">
            <span className="text-sm font-semibold">{toastMessage}</span>
            <button onClick={() => setToastMessage('')} className="text-emerald-400/70 hover:text-emerald-400 text-sm">✕</button>
          </div>
        )}

        {/* Top Title & Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-zinc-950/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-[#A6FF5D]/30 shadow-[0_0_30px_rgba(166,255,93,0.15)] hover:border-[#A6FF5D]/50 transition-all duration-300">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A6FF5D]/10 border border-[#A6FF5D]/30 text-[#A6FF5D] text-xs font-semibold uppercase tracking-wider mb-2">
              <span>🎯 ATS Job Matcher</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              Target Job Description Matcher
            </h1>
            <p className="text-zinc-200 text-sm sm:text-base mt-1 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              Extract missing keywords &amp; run deep AI ATS scoring against your target job posting.
            </p>
          </div>
          <Link
            to="/builder"
            className="bg-[#A6FF5D] hover:bg-[#b8ff7a] text-black font-extrabold px-5 py-3 rounded-2xl transition shadow-lg shadow-[#A6FF5D]/20 text-sm flex items-center gap-2 whitespace-nowrap border border-[#A6FF5D] hover:scale-105 active:scale-95"
          >
            <span>Open Resume in Builder →</span>
          </Link>
        </div>

        {/* Target Resume Status Banner */}
        <div className="mb-8 p-3.5 bg-zinc-950/90 border border-zinc-800 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A6FF5D] animate-pulse" />
            <span className="text-zinc-400 font-medium">Evaluating Resume:</span>
            <span className="font-extrabold text-white">{resumeData?.header?.name || 'Alex Rivera'}</span>
            {isSampleResume ? (
              <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-md font-mono">
                Sample Candidate Profile Active
              </span>
            ) : (
              <span className="text-[10px] bg-[#A6FF5D]/10 text-[#A6FF5D] border border-[#A6FF5D]/30 px-2.5 py-0.5 rounded-md font-mono">
                Active Builder Draft Loaded
              </span>
            )}
          </div>
          <Link to="/builder" className="text-[#A6FF5D] hover:underline font-bold flex items-center gap-1">
            <span>Edit Resume in Builder →</span>
          </Link>
        </div>

        {/* Main 2-Column Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Left Column: Job Description Input & Action Toolbar */}
          <div className="bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6 shadow-2xl flex flex-col">
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Paste Target Job Description (JD)
                </label>
                <div className="flex items-center gap-3">
                  {jobDescription && (
                    <button
                      type="button"
                      onClick={handleClearJd}
                      className="text-xs text-zinc-400 hover:text-red-400 transition font-medium cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleFillSampleJd}
                    className="text-xs text-[#A6FF5D] hover:underline font-semibold cursor-pointer"
                  >
                    + Load Sample SWE JD
                  </button>
                </div>
              </div>
              <textarea
                placeholder="Paste the job requirements, responsibilities, or skills list here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full bg-white/[0.04] text-white placeholder-white/20 text-sm p-4 rounded-2xl border border-zinc-700 focus:border-[#A6FF5D] focus:outline-none transition resize-none flex-1 min-h-[220px]"
              />

              {/* Action Toolbar directly below textarea */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                <span className="text-xs text-zinc-400">
                  {jobDescription.length > 0 ? `${jobDescription.length} characters` : 'Zero tokens required for real-time match'}
                </span>
                <button
                  type="button"
                  onClick={handleRunAiAnalysis}
                  disabled={loading || !jobDescription.trim()}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg ${
                    loading || !jobDescription.trim()
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-[#A6FF5D] border border-[#A6FF5D]/40 hover:border-[#A6FF5D]'
                  }`}
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-[#A6FF5D] border-t-transparent rounded-full animate-spin" />
                      <span>Analyzing Job Match...</span>
                    </>
                  ) : (
                    <>
                      <span>🤖 Run Deep AI Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Extracted Keywords Area */}
            {extractedKeywords.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-zinc-800/80">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Extracted Job Keywords ({extractedKeywords.length})
                  </p>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setKeywordFilter('all')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                        keywordFilter === 'all' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      All ({extractedKeywords.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setKeywordFilter('missing')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                        keywordFilter === 'missing' ? 'bg-red-500/20 text-red-300 shadow-sm' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Missing ({missingList.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setKeywordFilter('matched')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                        keywordFilter === 'matched' ? 'bg-emerald-500/20 text-emerald-300 shadow-sm' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Matched ({matchedList.length})
                    </button>
                  </div>
                </div>

                {/* Keyword Pills */}
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                  {filteredKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition ${
                        kw.matched
                          ? 'bg-[#A6FF5D]/10 text-[#A6FF5D] border-[#A6FF5D]/30'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <span>{kw.matched ? '✓' : '•'} {kw.keyword}</span>
                      {!kw.matched && (
                        <button
                          type="button"
                          onClick={() => handleAddSkill(kw.keyword)}
                          className="text-[#A6FF5D] hover:text-[#b8ff7a] font-bold ml-1 cursor-pointer"
                          title="Add skill to resume"
                        >
                          + Add
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {/* Bulk Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  {missingList.length > 0 ? (
                    <>
                      <button
                        type="button"
                        onClick={handleAddAllMissingSkills}
                        className="flex-1 bg-[#A6FF5D] hover:bg-[#b8ff7a] text-black font-extrabold py-3.5 px-4 rounded-2xl transition-all duration-200 shadow-xl shadow-[#A6FF5D]/20 hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-center gap-2 text-sm border border-[#A6FF5D]"
                      >
                        <span>✨ Add {missingList.length} Missing Skills to Resume</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCopyMissingKeywords}
                        className="px-4 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-semibold rounded-2xl border border-zinc-800 text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>📋 Copy List</span>
                      </button>
                    </>
                  ) : (
                    <div className="w-full bg-[#A6FF5D]/10 border border-[#A6FF5D]/30 text-[#A6FF5D] font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 text-sm">
                      <span>✓ All Target Job Keywords Present in Resume!</span>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Real-Time & AI Analysis Results Dashboard */}
          <div className="bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6 shadow-2xl min-h-[460px] flex flex-col justify-start">
            
            {/* Empty State */}
            {!matchResult && !loading && extractedKeywords.length === 0 && (
              <div className="text-center text-zinc-400 space-y-2 my-auto py-12">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-2xl text-zinc-500 mb-3 shadow-inner">
                  🎯
                </div>
                <p className="text-lg font-bold text-white">AI ATS Match Score Dashboard</p>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Paste your target job description on the left (or click "+ Load Sample SWE JD") to calculate your ATS match score &amp; discover missing keywords.
                </p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center space-y-3 my-auto py-12">
                <div className="w-10 h-10 border-2 border-[#A6FF5D] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-zinc-200 font-semibold animate-pulse">Running Deep AI ATS semantic match &amp; scoring...</p>
                <p className="text-xs text-zinc-500">Checking domain relevance, action verbs, and quantifiable impact.</p>
              </div>
            )}

            {/* Instant Real-Time Keyword Dashboard (When JD is pasted but AI scan not run yet) */}
            {!matchResult && !loading && extractedKeywords.length > 0 && (
              <div className="space-y-6 animate-fade-in">
                {/* SVG Gauge Header */}
                <div className="border-b border-zinc-800 pb-5">
                  {renderCircularGauge(realTimeScore)}
                </div>

                {/* Missing Keywords Section */}
                {missingList.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-red-400 uppercase tracking-wider">
                        Missing Target Keywords ({missingList.length})
                      </p>
                      <button
                        type="button"
                        onClick={handleAddAllMissingSkills}
                        className="text-xs text-[#A6FF5D] hover:underline font-bold cursor-pointer"
                      >
                        + Add All Missing
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {missingList.map((kw, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddSkill(kw.keyword)}
                          className="text-xs bg-red-500/10 text-red-300 border border-red-500/30 hover:border-red-400 px-3 py-1.5 rounded-xl font-medium transition cursor-pointer flex items-center gap-1.5 group"
                        >
                          <span>{kw.keyword}</span>
                          <span className="text-[#A6FF5D] font-bold group-hover:scale-110 transition">+ Add</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Keywords Section */}
                {matchedList.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-[#A6FF5D] uppercase tracking-wider mb-2">
                      Matched Keywords ({matchedList.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {matchedList.map((kw, idx) => (
                        <span key={idx} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                          ✓ {kw.keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deep AI Callout Banner */}
                <div className="p-4 bg-zinc-900/90 border border-zinc-800 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-white">Want deeper AI semantic scoring?</p>
                    <p className="text-zinc-400">Evaluate bullet action verbs, quantifiable metrics, and senior role alignment.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRunAiAnalysis}
                    className="px-3.5 py-2 bg-[#A6FF5D] hover:bg-[#b8ff7a] text-black font-extrabold rounded-xl transition cursor-pointer shrink-0"
                  >
                    Analyze with AI
                  </button>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                  <span>💡 Click "+ Add" on missing skills to auto-update your resume</span>
                  <Link to="/builder" className="text-[#A6FF5D] hover:underline font-bold">
                    Open Builder →
                  </Link>
                </div>
              </div>
            )}

            {/* AI Deep Analysis Result Dashboard */}
            {matchResult && !loading && (
              <div className="space-y-6 animate-fade-in">
                {/* SVG Gauge Header */}
                <div className="border-b border-zinc-800 pb-5">
                  {renderCircularGauge(matchResult.score)}
                </div>

                {/* Missing Keywords */}
                {matchResult.missingKeywords?.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-red-400 uppercase tracking-wider">
                        Missing Keywords ({matchResult.missingKeywords.length})
                      </p>
                      <button
                        type="button"
                        onClick={handleAddAllMissingSkills}
                        className="text-xs text-[#A6FF5D] hover:underline font-bold cursor-pointer"
                      >
                        + Add to Resume
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.missingKeywords.map((kw, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddSkill(kw)}
                          className="text-xs bg-red-500/10 text-red-300 border border-red-500/30 hover:border-red-400 px-3 py-1.5 rounded-xl font-medium transition cursor-pointer flex items-center gap-1"
                        >
                          <span>{kw}</span>
                          <span className="text-[#A6FF5D] font-bold ml-1">+ Add</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched Keywords from AI */}
                {matchResult.matchingKeywords?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-[#A6FF5D] uppercase tracking-wider mb-2">
                      Matching Qualifications ({matchResult.matchingKeywords.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {matchResult.matchingKeywords.map((kw, idx) => (
                        <span key={idx} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                          ✓ {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Improvement Suggestions */}
                {matchResult.suggestions?.length > 0 && (
                  <div className="bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800 space-y-2.5">
                    <p className="text-xs font-bold text-[#A6FF5D] uppercase tracking-wider">
                      🤖 AI Suggestions for Your Resume
                    </p>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      {matchResult.suggestions.map((sug, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#A6FF5D] font-bold shrink-0">•</span>
                          <span className="leading-relaxed">{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Back to Builder Button */}
                <div className="pt-4 border-t border-zinc-800">
                  <Link
                    to="/builder"
                    className="w-full bg-[#A6FF5D] hover:bg-[#b8ff7a] text-black font-extrabold py-3.5 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-[#A6FF5D]/20 cursor-pointer"
                  >
                    <span>Open Resume Builder with Updated Skills →</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
