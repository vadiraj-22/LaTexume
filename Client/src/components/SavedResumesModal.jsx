import React, { useEffect, useState } from 'react'
import { API_URL, getAuthHeaders } from '../config/api'

export default function SavedResumesModal({ isOpen, onClose, onLoadResume }) {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchResumes = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/api/v1/resumes`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      })

      const data = await res.json()

      if (data.success && Array.isArray(data.data)) {
        setResumes(data.data)
      } else {
        setError(data.message || 'Could not fetch saved resumes. Please sign in.')
      }
    } catch (err) {
      setError('Network error fetching saved resumes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchResumes()
    }
  }, [isOpen])

  const handleLoadSingle = async (id) => {
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/v1/resumes/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      })

      const data = await res.json()

      if (data.success && data.data?.formData) {
        onLoadResume(data.data.formData, data.data._id, data.data.title)
        onClose()
      } else {
        alert('Failed to load resume details.')
      }
    } catch (err) {
      alert('Error loading resume.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      const res = await fetch(`${API_URL}/api/v1/resumes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      })

      const data = await res.json()
      if (data.success) {
        setResumes((prev) => prev.filter((r) => r._id !== id))
      } else {
        alert(data.message || 'Could not delete resume.')
      }
    } catch (err) {
      alert('Network error deleting resume.')
    }
  }

  const handleTogglePublic = async (id, currentIsPublic) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/resumes/${id}/toggle-public`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ isPublic: !currentIsPublic }),
      })

      const data = await res.json()
      if (data.success && data.data) {
        setResumes((prev) =>
          prev.map((r) => (r._id === id ? { ...r, isPublic: data.data.isPublic } : r))
        )
      } else {
        alert(data.message || 'Could not update public status.')
      }
    } catch (err) {
      alert('Error updating public status.')
    }
  }

  const handleCopyPublicUrl = (id) => {
    const shareUrl = `${window.location.origin}/r/${id}`
    navigator.clipboard.writeText(shareUrl)
    alert(`Public share link copied!\n${shareUrl}`)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-xl w-full shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 font-bold text-sm">📂</span>
            <h3 className="text-lg font-bold text-white">My Saved Resumes</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-lg font-bold px-2 py-1 rounded-lg hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        {loading && (
          <div className="py-12 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-zinc-400">Loading your saved resumes from MongoDB...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs mb-4">
            {error}
          </div>
        )}

        {!loading && !error && resumes.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm text-zinc-400 mb-2">No saved resumes found in your cloud storage.</p>
            <p className="text-xs text-zinc-500">
              Click <strong>"💾 Save to Cloud"</strong> in the Builder to store your first resume draft!
            </p>
          </div>
        )}

        {!loading && resumes.length > 0 && (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {resumes.map((res) => (
              <div
                key={res._id}
                className="p-4 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center justify-between hover:border-zinc-700 transition"
              >
                <div>
                  <h4 className="text-sm font-bold text-white">{res.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {res.templateId || 'jake'}
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      Updated: {new Date(res.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleTogglePublic(res._id, res.isPublic)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg border transition font-medium cursor-pointer ${
                      res.isPublic
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                    title="Toggle public share link"
                  >
                    {res.isPublic ? '🌐 Public' : '🔒 Private'}
                  </button>

                  {res.isPublic && (
                    <button
                      type="button"
                      onClick={() => handleCopyPublicUrl(res._id)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs px-2.5 py-1.5 rounded-lg border border-zinc-700 transition cursor-pointer"
                      title="Copy public URL"
                    >
                      📋 Link
                    </button>
                  )}

                  <button
                    onClick={() => handleLoadSingle(res._id)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    Load ➔
                  </button>
                  <button
                    onClick={() => handleDelete(res._id, res.title)}
                    className="text-zinc-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
                    title="Delete resume"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
