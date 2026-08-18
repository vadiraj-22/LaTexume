import React, { useState } from 'react'
import { API_URL } from '../config/api'

export default function BulletEnhancerModal({ isOpen, initialBullet, roleTitle, onClose, onApply }) {
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleEnhance = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/api/ai/enhance-bullet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bullet: initialBullet, roleTitle }),
      })

      const data = await response.json()

      if (data.success && data.suggestions?.length > 0) {
        setSuggestions(data.suggestions)
      } else {
        setError(data.message || 'Could not generate suggestions.')
      }
    } catch (err) {
      setError('Failed to reach AI service. Try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-sm">
              ✨
            </span>
            <h3 className="text-lg font-bold text-white">AI Bullet Polish</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-lg font-bold px-2 py-1 rounded-lg hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/80">
          <span className="text-[11px] font-semibold uppercase text-zinc-500 block mb-1">Original Bullet</span>
          <p className="text-xs text-zinc-300 font-mono italic">"{initialBullet || 'Empty bullet'}"</p>
        </div>

        {suggestions.length === 0 && !loading && (
          <div className="text-center py-6">
            <p className="text-sm text-zinc-400 mb-4">
              Click below to generate action-verb driven, quantified bullet variations using AI.
            </p>
            <button
              onClick={handleEnhance}
              disabled={!initialBullet?.trim()}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-5 py-2.5 rounded-xl transition text-sm disabled:opacity-50"
            >
              ✨ Generate AI Suggestions
            </button>
          </div>
        )}

        {loading && (
          <div className="py-8 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-zinc-400 animate-pulse">Polishing bullet with AI (Token-Budgeted)...</p>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs mb-4">
            {error}
          </div>
        )}

        {suggestions.length > 0 && !loading && (
          <div className="space-y-3 mb-6">
            <span className="text-xs font-semibold text-zinc-400 block">Select a suggestion to apply:</span>
            {suggestions.map((sug, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onApply(sug)
                  onClose()
                }}
                className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-800/50 cursor-pointer transition flex items-start justify-between group"
              >
                <p className="text-xs text-white leading-relaxed pr-3 group-hover:text-emerald-300">{sug}</p>
                <span className="text-xs text-emerald-400 font-bold shrink-0 opacity-0 group-hover:opacity-100 transition">
                  Apply ➔
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
