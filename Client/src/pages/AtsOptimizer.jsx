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
    }
  }, [jobDescription, resumeData])

  const handleAddSkill = (skillName) => {
    if (!resumeData) return
    const updated = { ...resumeData }
    const skillsList = updated.skills || []
    if (skillsList.length > 0) {
      const existing = skillsList[0].skills
      skillsList[0].skills = existing ? `${existing}, ${skillName}` : skillName
    } else {
      skillsList.push({ label: 'Skills', skills: skillName })
    }

    updated.skills = skillsList
    setResumeData(updated)
    localStorage.setItem('latexume_draft', JSON.stringify(updated))

    setToastMessage(`Added "${skillName}" to your Resume Skills!`)
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
    const skillsList = updated.skills || []
    const newSkillsStr = missing.join(', ')

    if (skillsList.length > 0) {
      const existing = skillsList[0].skills
      skillsList[0].skills = existing ? `${existing}, ${newSkillsStr}` : newSkillsStr
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

  const handleFillSampleJd = () => {
    const sample = `We are seeking a Senior Full Stack Engineer proficient in React, TypeScript, Node.js, Express, Docker, PostgreSQL, AWS, and REST APIs. Experience with CI/CD pipelines, System Design, GraphQL, Microservices, and Redis is highly preferred. The ideal candidate will architect scalable cloud backend microservices and build responsive frontend user interfaces.`
    setJobDescription(sample)
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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-[#A6FF5D] selection:text-black">
      <SEO
        title="ATS Job Description Matcher | LaTexume"
        description="Optimize your resume for ATS parsers. Analyze job descriptions, extract missing keywords, and boost match scores."
      />
      <Navbar />

      <main className="flex-1 pt-36 sm:pt-40 pb-16 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto w-full">
        {/* Toast */}
        {toastMessage && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-2xl text-emerald-400 flex items-center justify-between shadow-lg">
            <span>{toastMessage}</span>
            <button onClick={() => setToastMessage('')} className="text-emerald-400/70 hover:text-emerald-400">✕</button>
          </div>
        )}

        {/* Top Title & Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A6FF5D]/10 border border-[#A6FF5D]/30 text-[#A6FF5D] text-xs font-semibold uppercase tracking-wider mb-2">
              <span>🎯 ATS Job Matcher</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
              Target Job Description Matcher
            </h1>
            <p className="text-gray-400 text-sm sm:text-base mt-1">
              Extract missing keywords & run AI ATS scoring against your target job posting.
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Job Description Input & Local Keyword Pills */}
          <div className="bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6 shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Paste Target Job Description (JD)
                </label>
                <button
                  type="button"
                  onClick={handleFillSampleJd}
                  className="text-xs text-[#A6FF5D] hover:underline font-semibold cursor-pointer"
                >
                  + Load Sample JD
                </button>
              </div>
              <textarea
                placeholder="Paste the job requirements, responsibilities, or skills list here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows="10"
                className="w-full bg-white/[0.04] text-white placeholder-white/20 text-sm p-4 rounded-2xl border border-zinc-700 focus:border-[#A6FF5D] focus:outline-none transition resize-y min-h-[220px]"
              />
            </div>

            {/* Local Keyword Overlap (Zero Token) */}
            {extractedKeywords.length > 0 && (
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Extracted Job Keywords (Click + to add individual skills)
                </p>
                <div className="flex flex-wrap gap-2">
                  {extractedKeywords.map((kw, idx) => (
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

                {/* Big Full-Width Hero Action Button at Bottom */}
                {extractedKeywords.some((k) => !k.matched) ? (
                  <button
                    type="button"
                    onClick={handleAddAllMissingSkills}
                    className="w-full bg-[#A6FF5D] hover:bg-[#b8ff7a] text-black font-extrabold py-4 px-6 rounded-2xl transition-all duration-200 shadow-xl shadow-[#A6FF5D]/20 hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-center gap-2 text-base border border-[#A6FF5D] mt-4"
                  >
                    <span>✨ Add All Missing Skills to Resume</span>
                  </button>
                ) : (
                  <div className="w-full bg-[#A6FF5D]/10 border border-[#A6FF5D]/30 text-[#A6FF5D] font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-sm mt-4">
                    <span>✓ All Target Job Keywords Added to Resume!</span>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Right Column: Real-Time & AI Analysis Results Dashboard */}
          <div className="bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 space-y-6 shadow-2xl min-h-[460px] flex flex-col justify-start">
            {!matchResult && !loading && extractedKeywords.length === 0 && (
              <div className="text-center text-zinc-400 space-y-2 my-auto py-12">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-xl text-zinc-500 mb-3">
                  🎯
                </div>
                <p className="text-base font-bold text-white">AI ATS Match Score Dashboard</p>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Paste your target job description on the left (or click "+ Load Sample JD") to instantly calculate your ATS match score & missing keywords.
                </p>
              </div>
            )}

            {loading && (
              <div className="text-center space-y-3 my-auto py-12">
                <div className="w-9 h-9 border-2 border-[#A6FF5D] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-zinc-300 font-medium animate-pulse">Running Deep AI ATS semantic match & scoring...</p>
              </div>
            )}

            {/* Instant Real-Time Keyword Dashboard (When JD is pasted but AI scan not run yet) */}
            {!matchResult && !loading && extractedKeywords.length > 0 && (() => {
              const matchedKw = extractedKeywords.filter(k => k.matched)
              const missingKw = extractedKeywords.filter(k => !k.matched)
              const realTimeScore = Math.round((matchedKw.length / extractedKeywords.length) * 100)
              
              return (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-[#A6FF5D] uppercase bg-[#A6FF5D]/10 px-2.5 py-0.5 rounded-full border border-[#A6FF5D]/30 tracking-wider">
                        Real-Time Keyword Match
                      </span>
                      <h2 className="text-3xl font-extrabold text-white mt-1.5">
                        {realTimeScore}% <span className="text-xs text-[#A6FF5D] font-normal">Keyword Match</span>
                      </h2>
                      <p className="text-xs text-zinc-400 mt-1">
                        {matchedKw.length} of {extractedKeywords.length} key job terms found in your resume.
                      </p>
                    </div>
                    <div className="w-16 h-16 rounded-2xl bg-[#A6FF5D]/10 border border-[#A6FF5D]/40 flex items-center justify-center text-[#A6FF5D] font-extrabold text-xl shadow-lg">
                      {realTimeScore}%
                    </div>
                  </div>

                  {missingKw.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
                        Missing Target Keywords ({missingKw.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {missingKw.map((kw, idx) => (
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

                  {matchedKw.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-[#A6FF5D] uppercase tracking-wider mb-2">
                        Matched Keywords ({matchedKw.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {matchedKw.map((kw, idx) => (
                          <span key={idx} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                            ✓ {kw.keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                    <span>💡 Click "+ Add" on missing skills to auto-update your resume</span>
                    <Link to="/builder" className="text-[#A6FF5D] hover:underline font-bold">
                      Open Builder →
                    </Link>
                  </div>
                </div>
              )
            })()}

            {matchResult && !loading && (
              <div className="space-y-6">
                {/* Score Header */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div>
                    <p className="text-xs text-zinc-400 uppercase font-semibold">ATS Compatibility Score</p>
                    <h2 className="text-3xl font-extrabold text-white mt-1">
                      {matchResult.score}% <span className="text-xs text-[#A6FF5D] font-normal">Match</span>
                    </h2>
                  </div>
                  <div className="w-16 h-16 rounded-full bg-[#A6FF5D]/10 border border-[#A6FF5D]/40 flex items-center justify-center text-[#A6FF5D] font-extrabold text-xl">
                    {matchResult.score}%
                  </div>
                </div>

                {/* Missing Keywords */}
                {matchResult.missingKeywords?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">
                      Missing Keywords
                    </p>
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

                {/* AI Improvement Suggestions */}
                {matchResult.suggestions?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-[#A6FF5D] uppercase tracking-wider mb-2">
                      AI Suggestions
                    </p>
                    <ul className="space-y-2 text-xs text-zinc-300">
                      {matchResult.suggestions.map((sug, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[#A6FF5D] font-bold">•</span>
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Back to Builder Button */}
                <div className="pt-4 border-t border-zinc-800">
                  <Link
                    to="/builder"
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition"
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
