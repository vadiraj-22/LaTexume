import React, { useState } from 'react'
import { API_URL } from '../config/api'

export default function JdMatcherCard({ resumeData, onAddSkill }) {
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) return
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/ai/match-jd`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, jobDescription }),
      })

      const data = await response.json()
      if (data.success && data.result) {
        setResult(data.result)
      } else {
        setError(data.message || 'Failed to match job description.')
      }
    } catch (err) {
      setError('Network error analyzing job description.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 mb-8 backdrop-blur-sm shadow-xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold shrink-0">
          🎯
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Target Job Description & ATS Match</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Paste a job posting to test ATS keyword overlap and receive token-light AI optimization tips.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <textarea
          rows={4}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste Job Description text here..."
          className="w-full bg-zinc-950/80 text-white text-xs p-3.5 rounded-xl border border-zinc-800 focus:border-purple-500 focus:outline-none transition"
        />

        <div className="flex justify-between items-center">
          <span className="text-[11px] text-zinc-500 font-mono">
            {jobDescription.length}/1200 chars (Truncated for Token Economy)
          </span>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || !jobDescription.trim()}
            className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            {loading ? 'Analyzing...' : '🎯 Scan ATS Match'}
          </button>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        {result && (
          <div className="mt-6 pt-6 border-t border-zinc-800/80 space-y-5 animate-fade-in">
            {/* Score & Gauge */}
            <div className="flex items-center gap-4 bg-zinc-950/80 p-4 rounded-xl border border-zinc-800">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 border-2 border-purple-500 text-purple-400 font-extrabold text-xl shrink-0">
                {result.score}%
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">ATS Keyword Match Score</h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {result.score >= 75
                    ? 'Excellent match! Your resume contains major target keywords.'
                    : 'Good foundation. Consider adding missing keywords below.'}
                </p>
              </div>
            </div>

            {/* Keyword Pills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Matching */}
              <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
                <span className="text-xs font-bold text-emerald-400 block mb-2">
                  ✓ Matching Keywords ({result.matchingKeywords?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.matchingKeywords?.map((kw, i) => (
                    <span key={i} className="text-[11px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      {kw}
                    </span>
                  )) || <span className="text-xs text-zinc-500">None found</span>}
                </div>
              </div>

              {/* Missing */}
              <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800">
                <span className="text-xs font-bold text-amber-400 block mb-2">
                  ⚠ Missing Key Skills ({result.missingKeywords?.length || 0})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords?.map((kw, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onAddSkill && onAddSkill(kw)}
                      className="text-[11px] bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/20 transition cursor-pointer"
                      title="Click to add to skills"
                    >
                      + {kw}
                    </button>
                  )) || <span className="text-xs text-zinc-500">None missing</span>}
                </div>
              </div>
            </div>

            {/* AI Feedback Bullets */}
            {result.feedback?.length > 0 && (
              <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-800">
                <span className="text-xs font-bold text-purple-300 block mb-2">💡 ATS Optimization Tips:</span>
                <ul className="list-disc list-inside space-y-1 text-xs text-zinc-300">
                  {result.feedback.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
