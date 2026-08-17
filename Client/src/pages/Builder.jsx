import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ResumeImporter from '../components/ResumeImporter'
import SEO from '../components/SEO'
import TemplateSelector from '../components/TemplateSelector'
import BulletEnhancerModal from '../components/BulletEnhancerModal'
import JdMatcherCard from '../components/JdMatcherCard'
import SavedResumesModal from '../components/SavedResumesModal'
import LatexPreviewDrawer from '../components/LatexPreviewDrawer'
import RightPreviewPane from '../components/RightPreviewPane'

const inputCls = "w-full bg-white/[0.04] text-white placeholder-white/15 text-sm sm:text-base px-4 py-3 rounded-xl border border-white/20 hover:bg-white/[0.08] hover:border-white/40 focus:bg-black/70 focus:border-[#A6FF5D] focus:ring-2 focus:ring-[#A6FF5D]/30 focus:shadow-[0_0_20px_rgba(166,255,93,0.15)] focus:outline-none transition-all duration-200"
const cardCls = "bg-gray-950/70 backdrop-blur-xl p-5 sm:p-7 md:p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl"
const labelCls = "block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider"
const addBtnCls = "inline-flex items-center gap-2 text-sm font-semibold text-[#A6FF5D] bg-[#A6FF5D]/10 hover:bg-[#A6FF5D]/20 border border-[#A6FF5D]/30 px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer mt-3"
const removeBtnCls = "text-red-400 hover:text-red-300 hover:bg-red-500/15 border border-transparent hover:border-red-500/30 p-2.5 rounded-xl transition-all duration-200 shrink-0"

const Builder = () => {
  const [formData, setFormData] = useState({
    templateId: 'jake',
    header: {
      name: '',
      phone: '',
      email: '',
      portfolio: '',
      linkedin: '',
      github: '',
      leetcode: ''
    },
    objective: '',
    skills: [{ label: '', skills: '' }],
    experience: [{ 
      title: '', 
      company: '', 
      location: '', 
      startDate: '', 
      endDate: '', 
      bullets: [''] 
    }],
    projects: [{ 
      name: '', 
      technologies: '', 
      date: '', 
      bullets: [''],
      liveLink: '',
      githubLink: ''
    }],
    education: [{ 
      institution: '', 
      location: '', 
      degree: '', 
      field: '', 
      startDate: '', 
      endDate: '' 
    }],
    certifications: [''],
    sectionOrder: ['objective', 'skills', 'experience', 'projects', 'education', 'certifications'],
  })

  const moveSection = (sectionKey, direction) => {
    const currentOrder = formData.sectionOrder || ['objective', 'skills', 'experience', 'projects', 'education', 'certifications']
    const idx = currentOrder.indexOf(sectionKey)
    if (idx === -1) return
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= currentOrder.length) return

    const updated = [...currentOrder]
    const temp = updated[idx]
    updated[idx] = updated[targetIdx]
    updated[targetIdx] = temp

    setFormData((prev) => ({ ...prev, sectionOrder: updated }))
  }

  const handleDragStartSection = (e, sectionKey) => {
    e.dataTransfer.setData('text/plain', sectionKey)
  }

  const handleDropSection = (e, targetKey) => {
    e.preventDefault()
    const draggedKey = e.dataTransfer.getData('text/plain')
    if (!draggedKey || draggedKey === targetKey) return

    const currentOrder = formData.sectionOrder || ['objective', 'skills', 'experience', 'projects', 'education', 'certifications']
    const draggedIdx = currentOrder.indexOf(draggedKey)
    const targetIdx = currentOrder.indexOf(targetKey)
    if (draggedIdx === -1 || targetIdx === -1) return

    const updated = [...currentOrder]
    updated.splice(draggedIdx, 1)
    updated.splice(targetIdx, 0, draggedKey)

    setFormData((prev) => ({ ...prev, sectionOrder: updated }))
  }

  const [loading, setLoading] = useState(false)
  const [isImporterOpen, setIsImporterOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [activeEnhanceBullet, setActiveEnhanceBullet] = useState(null)
  const [currentResumeId, setCurrentResumeId] = useState(null)
  const [currentResumeTitle, setCurrentResumeTitle] = useState('')
  const [isSavedResumesOpen, setIsSavedResumesOpen] = useState(false)
  const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false)
  const [searchParams] = useSearchParams()

  // Sync template choice from URL parameter if present
  useEffect(() => {
    const tmpl = searchParams.get('template')
    if (tmpl) {
      setFormData((prev) => ({ ...prev, templateId: tmpl }))
    }
  }, [searchParams])

  // Auto-save draft to localStorage on change
  useEffect(() => {
    if (formData.header.name || formData.header.email) {
      localStorage.setItem('latexume_draft', JSON.stringify(formData))
    }
  }, [formData])

  // Load local draft on mount if form is uninitialized
  useEffect(() => {
    const savedDraft = localStorage.getItem('latexume_draft')
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        if (parsed.header && !formData.header.name && !formData.header.email) {
          setFormData(parsed)
        }
      } catch (e) {
        // Ignore JSON errors
      }
    }
  }, [])

  const handleSaveToCloud = async () => {
    const defaultTitle = formData.header.name ? `${formData.header.name}'s Resume` : 'Untitled Resume'
    const title = window.prompt('Enter a title for this resume draft:', currentResumeTitle || defaultTitle)

    if (title === null) return

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/v1/resumes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          resumeId: currentResumeId,
          title,
          templateId: formData.templateId || 'jake',
          formData,
        }),
      })

      const data = await res.json()

      if (data.success && data.data) {
        setCurrentResumeId(data.data._id)
        setCurrentResumeTitle(data.data.title)
        setToastMessage(`Resume "${data.data.title}" saved to Cloud!`)
        setTimeout(() => setToastMessage(''), 5000)
      } else {
        alert(data.message || 'Could not save resume. Please sign in to save resumes to your account.')
      }
    } catch (err) {
      alert('Network error saving resume to cloud.')
    } finally {
      setLoading(false)
    }
  }

  const handleLoadSavedResume = (loadedFormData, resumeId, title) => {
    setFormData(loadedFormData)
    setCurrentResumeId(resumeId)
    setCurrentResumeTitle(title)
    setToastMessage(`Loaded "${title}" into builder!`)
    setTimeout(() => setToastMessage(''), 5000)
  }

  const handleAddSkillFromJd = (skillName) => {
    const updatedSkills = [...formData.skills]
    if (updatedSkills.length > 0) {
      const existing = updatedSkills[0].skills
      updatedSkills[0].skills = existing ? `${existing}, ${skillName}` : skillName
    } else {
      updatedSkills.push({ label: 'Skills', skills: skillName })
    }
    setFormData({ ...formData, skills: updatedSkills })
    setToastMessage(`Added "${skillName}" to your Skills section!`)
    setTimeout(() => setToastMessage(''), 4000)
  }

  const handleImportData = (parsedData, mode = 'replace') => {
    if (mode === 'replace') {
      setFormData({
        templateId: formData.templateId || 'jake',
        ...parsedData,
      })
    } else {
      setFormData((prev) => ({
        header: {
          name: parsedData.header.name || prev.header.name,
          phone: parsedData.header.phone || prev.header.phone,
          email: parsedData.header.email || prev.header.email,
          portfolio: parsedData.header.portfolio || prev.header.portfolio,
          linkedin: parsedData.header.linkedin || prev.header.linkedin,
          github: parsedData.header.github || prev.header.github,
          leetcode: parsedData.header.leetcode || prev.header.leetcode,
        },
        objective: parsedData.objective || prev.objective,
        skills: [...prev.skills.filter((s) => s.label || s.skills), ...(parsedData.skills || [])],
        experience: [...prev.experience.filter((e) => e.title || e.company), ...(parsedData.experience || [])],
        projects: [...prev.projects.filter((p) => p.name), ...(parsedData.projects || [])],
        education: [...prev.education.filter((ed) => ed.institution || ed.degree), ...(parsedData.education || [])],
        certifications: [...prev.certifications.filter(Boolean), ...(parsedData.certifications || [])],
      }))
    }

    setToastMessage(`Resume auto-filled successfully (${mode === 'replace' ? 'replaced draft' : 'merged data'})!`)
    setTimeout(() => setToastMessage(''), 5000)
  }

  const handleHeaderChange = (field, value) => {
    setFormData({ ...formData, header: { ...formData.header, [field]: value } })
  }

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...formData.skills]
    newSkills[index][field] = value
    setFormData({ ...formData, skills: newSkills })
  }

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.experience]
    newExperience[index][field] = value
    setFormData({ ...formData, experience: newExperience })
  }

  const handleExperienceBulletChange = (expIndex, bulletIndex, value) => {
    const newExperience = [...formData.experience]
    newExperience[expIndex].bullets[bulletIndex] = value
    setFormData({ ...formData, experience: newExperience })
  }

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...formData.projects]
    newProjects[index][field] = value
    setFormData({ ...formData, projects: newProjects })
  }

  const handleProjectBulletChange = (projIndex, bulletIndex, value) => {
    const newProjects = [...formData.projects]
    newProjects[projIndex].bullets[bulletIndex] = value
    setFormData({ ...formData, projects: newProjects })
  }

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education]
    newEducation[index][field] = value
    setFormData({ ...formData, education: newEducation })
  }

  const handleCertificationChange = (index, value) => {
    const newCertifications = [...formData.certifications]
    newCertifications[index] = value
    setFormData({ ...formData, certifications: newCertifications })
  }

  const addSkill = () => {
    setFormData({ ...formData, skills: [...formData.skills, { label: '', skills: '' }] })
  }

  const removeSkill = (index) => {
    const newSkills = formData.skills.filter((_, i) => i !== index)
    setFormData({ ...formData, skills: newSkills.length > 0 ? newSkills : [{ label: '', skills: '' }] })
  }

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { title: '', company: '', location: '', startDate: '', endDate: '', bullets: [''] }]
    })
  }

  const removeExperience = (index) => {
    const newExperience = formData.experience.filter((_, i) => i !== index)
    setFormData({ ...formData, experience: newExperience.length > 0 ? newExperience : [{ title: '', company: '', location: '', startDate: '', endDate: '', bullets: [''] }] })
  }

  const addExperienceBullet = (index) => {
    const newExperience = [...formData.experience]
    newExperience[index].bullets.push('')
    setFormData({ ...formData, experience: newExperience })
  }

  const removeExperienceBullet = (expIndex, bulletIndex) => {
    const newExperience = [...formData.experience]
    newExperience[expIndex].bullets = newExperience[expIndex].bullets.filter((_, i) => i !== bulletIndex)
    if (newExperience[expIndex].bullets.length === 0) {
      newExperience[expIndex].bullets = ['']
    }
    setFormData({ ...formData, experience: newExperience })
  }

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: '', technologies: '', date: '', bullets: [''], liveLink: '', githubLink: '' }]
    })
  }

  const removeProject = (index) => {
    const newProjects = formData.projects.filter((_, i) => i !== index)
    setFormData({ ...formData, projects: newProjects.length > 0 ? newProjects : [{ name: '', technologies: '', date: '', bullets: [''], liveLink: '', githubLink: '' }] })
  }

  const addProjectBullet = (index) => {
    const newProjects = [...formData.projects]
    newProjects[index].bullets.push('')
    setFormData({ ...formData, projects: newProjects })
  }

  const removeProjectBullet = (projIndex, bulletIndex) => {
    const newProjects = [...formData.projects]
    newProjects[projIndex].bullets = newProjects[projIndex].bullets.filter((_, i) => i !== bulletIndex)
    if (newProjects[projIndex].bullets.length === 0) {
      newProjects[projIndex].bullets = ['']
    }
    setFormData({ ...formData, projects: newProjects })
  }

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { institution: '', location: '', degree: '', field: '', startDate: '', endDate: '' }]
    })
  }

  const removeEducation = (index) => {
    const newEducation = formData.education.filter((_, i) => i !== index)
    setFormData({ ...formData, education: newEducation.length > 0 ? newEducation : [{ institution: '', location: '', degree: '', field: '', startDate: '', endDate: '' }] })
  }

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [...formData.certifications, '']
    })
  }

  const removeCertification = (index) => {
    const newCertifications = formData.certifications.filter((_, i) => i !== index)
    setFormData({ ...formData, certifications: newCertifications.length > 0 ? newCertifications : [''] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Use environment variable for API URL
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

    try {
      const response = await fetch(`${API_URL}/api/generate-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${formData.header.name.replace(/\s+/g, '_')}_Resume.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const error = await response.json()
        alert(`Failed to generate resume: ${error.message}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <SEO 
        title="Interactive LaTeX Resume Builder & Editor"
        description="Build and customize your LaTeX resume online with real-time preview and instant PDF export using Jake's Resume template."
        keywords="online latex resume editor, build latex resume, resume generator app, ATS resume creator"
        canonicalPath="/builder"
      />
      <header className="bg-black text-white border-b border-white/10 pt-20">
        <Navbar />
      </header>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-6 animate-fade-in">
            {/* Document with Pen Animation */}
            <div className="relative">
              {/* Document */}
              <div className="w-48 h-64 bg-white rounded-lg shadow-2xl relative overflow-hidden">
                {/* Document Lines */}
                <div className="absolute top-8 left-6 right-6 space-y-3">
                  <div className="h-2 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-2 bg-gray-300 rounded animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                  <div className="h-2 bg-gray-300 rounded w-3/4 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 bg-gray-300 rounded animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                  <div className="h-2 bg-gray-300 rounded w-5/6 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <div className="h-2 bg-gray-300 rounded animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="h-2 bg-gray-300 rounded w-2/3 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                </div>

                {/* Animated Pen/Typewriter */}
                <div className="absolute bottom-20 right-8 animate-bounce" style={{ animationDuration: '1s' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" fill="#A6FF5D"/>
                    <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" fill="#A6FF5D"/>
                  </svg>
                </div>

                {/* Writing Effect Line */}
                <div className="absolute bottom-24 left-6 right-12">
                  <div className="h-2 bg-primary rounded animate-pulse"></div>
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10 animate-pulse"></div>
            </div>

            {/* Loading Text */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold text-white">Generating Your Resume</h3>
              <p className="text-gray-400 text-sm">Compiling LaTeX and creating PDF...</p>
              
              {/* Progress Dots */}
              <div className="flex items-center justify-center gap-2 pt-4">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>

            {/* LaTeX Logo */}
            <div className="mt-4 flex items-center gap-2 text-gray-500 text-xs">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
              <span>Powered by LaTeX</span>
            </div>
          </div>
        </div>
      )}

      <main className="pt-4 sm:pt-6 pb-8 px-4 sm:px-6 md:px-8 lg:px-10 max-w-[1650px] mx-auto w-full">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/40 rounded-2xl text-primary flex items-center justify-between animate-fade-in-down shadow-lg shadow-primary/10">
            <div className="flex items-center gap-3 font-medium text-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="text-primary/70 hover:text-primary">
              ✕
            </button>
          </div>
        )}

        {/* Page Heading & Action Toolbar */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6 animate-fade-in-down">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Build Your LaTeX Resume
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Reorder sections via ⠿ Drag or ▲/▼ • Real-time side-by-side LaTeX preview
            </p>
          </div>

          {/* Compact Action Toolbar (No empty bar gap) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Template Switcher */}
            <Link
              to="/templates"
              className="bg-purple-950/50 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 font-medium px-3.5 py-1.5 rounded-xl transition flex items-center gap-2 text-xs sm:text-sm cursor-pointer group shadow-md"
              title="Change resume template style"
            >
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h3a1 1 0 011 1v6a1 1 0 01-1 1h-3a1 1 0 01-1-1v-6z" />
              </svg>
              <span className="text-purple-300/70">Template:</span>
              <span className="font-semibold text-white">
                {formData.templateId === 'blueAccent' ? 'Blue Accent' : formData.templateId === 'classic' ? 'Classic Serif' : "Jake's Clean"}
              </span>
              <svg className="w-3.5 h-3.5 text-purple-400 group-hover:text-white transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {/* ATS Matcher */}
            <Link
              to="/ats-optimizer"
              className="bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 font-medium px-3.5 py-1.5 rounded-xl transition flex items-center gap-2 text-xs sm:text-sm cursor-pointer shadow-md"
              title="Target Job Description & ATS Optimizer"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v3M12 18v3M3 12h3M18 12h3" />
              </svg>
              <span>ATS Matcher</span>
            </Link>

            {/* Save Draft */}
            <button
              type="button"
              onClick={handleSaveToCloud}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-medium px-3.5 py-1.5 rounded-xl transition flex items-center gap-2 text-xs sm:text-sm cursor-pointer shadow-md"
            >
              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>Save Draft</span>
            </button>

            {/* My Resumes */}
            <button
              type="button"
              onClick={() => setIsSavedResumesOpen(true)}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-medium px-3.5 py-1.5 rounded-xl transition flex items-center gap-2 text-xs sm:text-sm cursor-pointer shadow-md"
            >
              <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span>My Resumes</span>
            </button>

            {/* Auto-Fill */}
            <button
              type="button"
              onClick={() => setIsImporterOpen(true)}
              className="bg-[#A6FF5D] hover:bg-[#b8ff7a] text-black font-bold px-4 py-1.5 rounded-xl transition flex items-center gap-2 hover:scale-[1.02] active:scale-95 shadow-md shadow-[#A6FF5D]/20 whitespace-nowrap cursor-pointer text-xs sm:text-sm border border-[#A6FF5D]"
            >
              <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Auto-Fill</span>
            </button>
          </div>
        </div>

        {/* TRUE SIDE-BY-SIDE SPLIT VIEW */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* LEFT COLUMN: FORM INPUTS & REORDERABLE SECTIONS (Independently Scrollable) */}
          <div className="w-full lg:w-[54%] xl:w-[56%] space-y-6 overflow-y-auto lg:max-h-[calc(100vh-80px)] pr-2 pb-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Header Information (Fixed at top) */}
              <div className={cardCls + " animate-fade-in-up animate-delay-100"}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#A6FF5D]/15 border border-[#A6FF5D]/30 flex items-center justify-center text-[#A6FF5D] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Personal Information <span className="text-red-400">*</span></h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    placeholder="Aarav Sharma"
                    value={formData.header.name}
                    onChange={(e) => handleHeaderChange('name', e.target.value)}
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Email Address <span className="text-red-400">*</span></label>
                  <input
                    type="email"
                    placeholder="aarav.sharma@gmail.com"
                    value={formData.header.email}
                    onChange={(e) => handleHeaderChange('email', e.target.value)}
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.header.phone}
                    onChange={(e) => handleHeaderChange('phone', e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Portfolio Link</label>
                  <input
                    type="text"
                    placeholder="https://aaravsharma.dev"
                    value={formData.header.portfolio}
                    onChange={(e) => handleHeaderChange('portfolio', e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>LinkedIn URL</label>
                  <input
                    type="text"
                    placeholder="https://linkedin.com/in/aaravsharma"
                    value={formData.header.linkedin}
                    onChange={(e) => handleHeaderChange('linkedin', e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>GitHub URL</label>
                  <input
                    type="text"
                    placeholder="https://github.com/aaravsharma"
                    value={formData.header.github}
                    onChange={(e) => handleHeaderChange('github', e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelCls}>LeetCode URL</label>
                  <input
                    type="text"
                    placeholder="https://leetcode.com/aaravsharma"
                    value={formData.header.leetcode}
                    onChange={(e) => handleHeaderChange('leetcode', e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Reorderable Sections */}
            {(formData.sectionOrder || ['objective', 'skills', 'experience', 'projects', 'education', 'certifications']).map((key, index) => {
              const currentOrder = formData.sectionOrder || ['objective', 'skills', 'experience', 'projects', 'education', 'certifications']
              
              const SECTION_TITLES = {
                objective: 'Objective',
                skills: 'Technical Skills',
                experience: 'Experience',
                projects: 'Projects',
                education: 'Education',
                certifications: 'Certifications & Achievements',
              }

              return (
                <div
                  key={key}
                  draggable
                  onDragStart={(e) => handleDragStartSection(e, key)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDropSection(e, key)}
                  className={cardCls + " transition-all duration-200 border border-white/10 hover:border-emerald-500/30"}
                >
                  {/* Reorder Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-6 select-none">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-zinc-400 hover:text-white cursor-grab font-mono text-xs px-2.5 py-1 rounded bg-white/5 border border-white/10 transition flex items-center gap-1.5"
                        title="Drag and drop to reorder section"
                      >
                        <span className="text-emerald-400">⠿</span>
                        <span className="font-sans font-semibold">Drag Section</span>
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">
                        {SECTION_TITLES[key]}
                      </h2>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => moveSection(key, 'up')}
                        disabled={index === 0}
                        className="text-xs bg-white/5 hover:bg-white/15 text-zinc-300 disabled:opacity-20 px-2.5 py-1 rounded-lg border border-white/10 transition cursor-pointer"
                        title="Move section up"
                      >
                        ▲ Up
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSection(key, 'down')}
                        disabled={index === currentOrder.length - 1}
                        className="text-xs bg-white/5 hover:bg-white/15 text-zinc-300 disabled:opacity-20 px-2.5 py-1 rounded-lg border border-white/10 transition cursor-pointer"
                        title="Move section down"
                      >
                        ▼ Down
                      </button>
                    </div>
                  </div>

                  {/* OBJECTIVE CARD */}
                  {key === 'objective' && (
                    <div>
                      <label className={labelCls}>Career Summary / Objective Statement</label>
                      <textarea
                        placeholder="Results-driven Software Development Engineer with 3+ years of experience building high-performance web applications and scalable cloud microservices..."
                        value={formData.objective}
                        onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                        rows="4"
                        className={inputCls + " resize-y min-h-[110px]"}
                      />
                    </div>
                  )}

                  {/* SKILLS CARD */}
                  {key === 'skills' && (
                    <div>
                      <div className="space-y-4">
                        {formData.skills.map((skill, skillIdx) => (
                          <div key={skillIdx} className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl">
                            <div className="flex items-end gap-3">
                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                  <label className={labelCls}>Category Label</label>
                                  <input
                                    type="text"
                                    placeholder="Languages & Frameworks"
                                    value={skill.label}
                                    onChange={(e) => handleSkillChange(skillIdx, 'label', e.target.value)}
                                    className={inputCls}
                                  />
                                </div>
                                <div className="sm:col-span-2">
                                  <label className={labelCls}>Skills List (Comma-separated)</label>
                                  <input
                                    type="text"
                                    placeholder="JavaScript, TypeScript, Python, C++, Java, React, Node.js"
                                    value={skill.skills}
                                    onChange={(e) => handleSkillChange(skillIdx, 'skills', e.target.value)}
                                    className={inputCls}
                                  />
                                </div>
                              </div>
                              {formData.skills.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeSkill(skillIdx)}
                                  className={removeBtnCls}
                                  title="Delete skill category"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={addSkill} className={addBtnCls}>
                        <span>+ Add Skill Category</span>
                      </button>
                    </div>
                  )}

                  {/* EXPERIENCE CARD */}
                  {key === 'experience' && (
                    <div>
                      {formData.experience.map((exp, expIndex) => (
                        <div key={expIndex} className="mb-6 p-4 sm:p-5 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b border-white/10">
                            <span className="text-xs font-semibold text-[#A6FF5D] uppercase tracking-wider">Position #{expIndex + 1}</span>
                            {formData.experience.length > 1 && (
                              <button type="button" onClick={() => removeExperience(expIndex)} className={removeBtnCls} title="Delete experience">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className={labelCls}>Job Title</label>
                              <input type="text" placeholder="Software Development Engineer" value={exp.title} onChange={(e) => handleExperienceChange(expIndex, 'title', e.target.value)} className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>Company</label>
                              <input type="text" placeholder="Flipkart" value={exp.company} onChange={(e) => handleExperienceChange(expIndex, 'company', e.target.value)} className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>Location</label>
                              <input type="text" placeholder="Bengaluru, Karnataka" value={exp.location} onChange={(e) => handleExperienceChange(expIndex, 'location', e.target.value)} className={inputCls} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className={labelCls}>Start Date</label>
                                <input type="text" placeholder="July 2022" value={exp.startDate} onChange={(e) => handleExperienceChange(expIndex, 'startDate', e.target.value)} className={inputCls} />
                              </div>
                              <div>
                                <label className={labelCls}>End Date</label>
                                <input type="text" placeholder="Present" value={exp.endDate} onChange={(e) => handleExperienceChange(expIndex, 'endDate', e.target.value)} className={inputCls} />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3 pt-2">
                            <label className={labelCls}>Key Responsibilities & Achievements</label>
                            {exp.bullets.map((bullet, bulletIndex) => (
                              <div key={bulletIndex} className="flex items-center gap-2">
                                <span className="text-[#A6FF5D] font-bold text-lg select-none">•</span>
                                <input
                                  type="text"
                                  placeholder={`Architected microservices handling 1.5M+ daily requests using Node.js & Redis`}
                                  value={bullet}
                                  onChange={(e) => handleExperienceBulletChange(expIndex, bulletIndex, e.target.value)}
                                  className={inputCls}
                                />
                                <button
                                  type="button"
                                  onClick={() => setActiveEnhanceBullet({ section: 'experience', expIndex, bulletIndex, text: bullet, roleTitle: exp.title })}
                                  className="text-xs text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-2.5 rounded-xl font-semibold transition shrink-0 cursor-pointer"
                                  title="Polish bullet with AI"
                                >
                                  ✨ Polish
                                </button>
                                {exp.bullets.length > 1 && (
                                  <button type="button" onClick={() => removeExperienceBullet(expIndex, bulletIndex)} className={removeBtnCls}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            ))}
                            <button type="button" onClick={() => addExperienceBullet(expIndex)} className="text-xs font-semibold text-[#A6FF5D] hover:underline transition flex items-center gap-1">
                              + Add Bullet Point
                            </button>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={addExperience} className={addBtnCls}>
                        <span>+ Add Experience Position</span>
                      </button>
                    </div>
                  )}

                  {/* PROJECTS CARD */}
                  {key === 'projects' && (
                    <div>
                      {formData.projects.map((proj, projIndex) => (
                        <div key={projIndex} className="mb-6 p-4 sm:p-5 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b border-white/10">
                            <span className="text-xs font-semibold text-[#A6FF5D] uppercase tracking-wider">Project #{projIndex + 1}</span>
                            {formData.projects.length > 1 && (
                              <button type="button" onClick={() => removeProject(projIndex)} className={removeBtnCls} title="Delete project">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className={labelCls}>Project Name</label>
                              <input type="text" placeholder="LaTexume Website" value={proj.name} onChange={(e) => handleProjectChange(projIndex, 'name', e.target.value)} className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>Date / Duration</label>
                              <input type="text" placeholder="Jan 2024" value={proj.date} onChange={(e) => handleProjectChange(projIndex, 'date', e.target.value)} className={inputCls} />
                            </div>
                          </div>
                          <div>
                            <label className={labelCls}>Technologies Used</label>
                            <input type="text" placeholder="React.js, Node.js, Express, MongoDB, Tailwind CSS" value={proj.technologies} onChange={(e) => handleProjectChange(projIndex, 'technologies', e.target.value)} className={inputCls} />
                          </div>
                          <div className="space-y-3 pt-2">
                            <label className={labelCls}>Project Highlights / Bullet Points</label>
                            {proj.bullets.map((bullet, bulletIndex) => (
                              <div key={bulletIndex} className="flex items-center gap-2">
                                <span className="text-[#A6FF5D] font-bold text-lg select-none">•</span>
                                <input
                                  type="text"
                                  placeholder={`Developed responsive UI using React & Tailwind with 99.8% test coverage`}
                                  value={bullet}
                                  onChange={(e) => handleProjectBulletChange(projIndex, bulletIndex, e.target.value)}
                                  className={inputCls}
                                />
                                <button
                                  type="button"
                                  onClick={() => setActiveEnhanceBullet({ section: 'project', projIndex, bulletIndex, text: bullet, roleTitle: proj.name })}
                                  className="text-xs text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-2.5 rounded-xl font-semibold transition shrink-0 cursor-pointer"
                                  title="Polish bullet with AI"
                                >
                                  ✨ Polish
                                </button>
                                {proj.bullets.length > 1 && (
                                  <button type="button" onClick={() => removeProjectBullet(projIndex, bulletIndex)} className={removeBtnCls}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            ))}
                            <button type="button" onClick={() => addProjectBullet(projIndex)} className="text-xs font-semibold text-[#A6FF5D] hover:underline transition flex items-center gap-1">
                              + Add Detail
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className={labelCls}>Live Site Link</label>
                              <input type="text" placeholder="https://latexume.vercel.app" value={proj.liveLink} onChange={(e) => handleProjectChange(projIndex, 'liveLink', e.target.value)} className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>GitHub Link</label>
                              <input type="text" placeholder="https://github.com/aaravsharma/latexume" value={proj.githubLink} onChange={(e) => handleProjectChange(projIndex, 'githubLink', e.target.value)} className={inputCls} />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={addProject} className={addBtnCls}>
                        <span>+ Add Project</span>
                      </button>
                    </div>
                  )}

                  {/* EDUCATION CARD */}
                  {key === 'education' && (
                    <div>
                      {formData.education.map((edu, eduIdx) => (
                        <div key={eduIdx} className="mb-6 p-4 sm:p-5 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                          <div className="flex justify-between items-center pb-2 border-b border-white/10">
                            <span className="text-xs font-semibold text-[#A6FF5D] uppercase tracking-wider">Education #{eduIdx + 1}</span>
                            {formData.education.length > 1 && (
                              <button type="button" onClick={() => removeEducation(eduIdx)} className={removeBtnCls} title="Delete education">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className={labelCls}>Institution Name</label>
                              <input type="text" placeholder="Indian Institute of Technology (IIT), Bombay" value={edu.institution} onChange={(e) => handleEducationChange(eduIdx, 'institution', e.target.value)} className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>Location</label>
                              <input type="text" placeholder="Mumbai, Maharashtra" value={edu.location} onChange={(e) => handleEducationChange(eduIdx, 'location', e.target.value)} className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>Degree</label>
                              <input type="text" placeholder="Bachelor of Technology (B.Tech)" value={edu.degree} onChange={(e) => handleEducationChange(eduIdx, 'degree', e.target.value)} className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>Field of Study</label>
                              <input type="text" placeholder="Computer Science and Engineering" value={edu.field} onChange={(e) => handleEducationChange(eduIdx, 'field', e.target.value)} className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>Start Date</label>
                              <input type="text" placeholder="Aug 2020" value={edu.startDate} onChange={(e) => handleEducationChange(eduIdx, 'startDate', e.target.value)} className={inputCls} />
                            </div>
                            <div>
                              <label className={labelCls}>End Date</label>
                              <input type="text" placeholder="May 2024" value={edu.endDate} onChange={(e) => handleEducationChange(eduIdx, 'endDate', e.target.value)} className={inputCls} />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={addEducation} className={addBtnCls}>
                        <span>+ Add Education</span>
                      </button>
                    </div>
                  )}

                  {/* CERTIFICATIONS CARD */}
                  {key === 'certifications' && (
                    <div>
                      <p className="text-xs sm:text-sm text-gray-400 mb-4">Add your certifications, honors, awards, or achievements as bullet points</p>
                      <div className="space-y-3">
                        {formData.certifications.map((cert, certIdx) => (
                          <div key={certIdx} className="flex items-center gap-2">
                            <span className="text-[#A6FF5D] font-bold text-lg select-none">•</span>
                            <input
                              type="text"
                              placeholder="AWS Certified Solutions Architect – Associate (2023)"
                              value={cert}
                              onChange={(e) => handleCertificationChange(certIdx, e.target.value)}
                              className={inputCls}
                            />
                            {formData.certifications.length > 1 && (
                              <button type="button" onClick={() => removeCertification(certIdx)} className={removeBtnCls} title="Delete certification">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={addCertification} className={addBtnCls}>
                        <span>+ Add Certification / Achievement</span>
                      </button>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Submit Button */}
            <div className="flex justify-center animate-fade-in-up pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-[#A6FF5D] hover:bg-[#b8ff7a] disabled:bg-gray-700 disabled:cursor-not-allowed text-gray-950 font-bold px-10 py-4 rounded-full text-lg shadow-xl shadow-[#A6FF5D]/25 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-gray-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Compiling LaTeX PDF...</span>
                  </>
                ) : (
                  <span>🚀 Generate Resume PDF</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: STICKY REAL-TIME PDF & LATEX PREVIEW */}
        <div className="w-full lg:w-[46%] xl:w-[44%] sticky top-24 self-start">
          <RightPreviewPane formData={formData} />
        </div>
      </div>
    </main>

      <Footer />

      <ResumeImporter
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
        onImportData={handleImportData}
      />

      <SavedResumesModal
        isOpen={isSavedResumesOpen}
        onClose={() => setIsSavedResumesOpen(false)}
        onLoadResume={handleLoadSavedResume}
      />

      <BulletEnhancerModal
        isOpen={!!activeEnhanceBullet}
        initialBullet={activeEnhanceBullet?.text || ''}
        roleTitle={activeEnhanceBullet?.roleTitle || ''}
        onClose={() => setActiveEnhanceBullet(null)}
        onApply={(appliedText) => {
          if (!activeEnhanceBullet) return
          if (activeEnhanceBullet.section === 'experience') {
            handleExperienceBulletChange(activeEnhanceBullet.expIndex, activeEnhanceBullet.bulletIndex, appliedText)
          } else if (activeEnhanceBullet.section === 'project') {
            handleProjectBulletChange(activeEnhanceBullet.projIndex, activeEnhanceBullet.bulletIndex, appliedText)
          }
        }}
      />

      <LatexPreviewDrawer
        isOpen={isPreviewDrawerOpen}
        onClose={() => setIsPreviewDrawerOpen(false)}
        formData={formData}
      />
    </div>
  )
}

export default Builder
