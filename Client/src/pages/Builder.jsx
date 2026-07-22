import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ResumeImporter from '../components/ResumeImporter'
import SEO from '../components/SEO'

const inputCls = "w-full bg-white/[0.04] text-white placeholder-white/15 text-sm sm:text-base px-4 py-3 rounded-xl border border-white/20 hover:bg-white/[0.08] hover:border-white/40 focus:bg-black/70 focus:border-[#A6FF5D] focus:ring-2 focus:ring-[#A6FF5D]/30 focus:shadow-[0_0_20px_rgba(166,255,93,0.15)] focus:outline-none transition-all duration-200"
const cardCls = "bg-gray-950/70 backdrop-blur-xl p-5 sm:p-7 md:p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl"
const labelCls = "block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider"
const addBtnCls = "inline-flex items-center gap-2 text-sm font-semibold text-[#A6FF5D] bg-[#A6FF5D]/10 hover:bg-[#A6FF5D]/20 border border-[#A6FF5D]/30 px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer mt-3"
const removeBtnCls = "text-red-400 hover:text-red-300 hover:bg-red-500/15 border border-transparent hover:border-red-500/30 p-2.5 rounded-xl transition-all duration-200 shrink-0"

const Builder = () => {
  const [formData, setFormData] = useState({
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
    certifications: ['']
  })

  const [loading, setLoading] = useState(false)
  const [isImporterOpen, setIsImporterOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const handleImportData = (parsedData, mode = 'replace') => {
    if (mode === 'replace') {
      setFormData(parsedData)
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

      <main className="py-8 sm:py-12 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-4xl mx-auto">
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

          {/* Page Heading & Auto-fill Action */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in-down">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
                Build Your LaTeX Resume
              </h1>
              <p className="text-gray-400 text-sm sm:text-lg">
                Using Jake's Resume template - industry-standard LaTeX format trusted by tech professionals
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsImporterOpen(true)}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-gray-900 font-semibold px-5 py-3 rounded-2xl transition flex items-center justify-center gap-2 hover:scale-105 shadow-xl shadow-primary/20 whitespace-nowrap cursor-pointer"
            >
              <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>✨ Auto-Fill from Old Resume</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Header Information */}
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

            {/* Objective */}
            <div className={cardCls + " animate-fade-in-up animate-delay-200"}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#A6FF5D]/15 border border-[#A6FF5D]/30 flex items-center justify-center text-[#A6FF5D] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Objective <span className="text-sm font-normal text-gray-400">(Optional)</span></h2>
              </div>
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
            </div>

            {/* Skills */}
            <div className={cardCls + " animate-fade-in-up animate-delay-300"}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#A6FF5D]/15 border border-[#A6FF5D]/30 flex items-center justify-center text-[#A6FF5D] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Technical Skills <span className="text-red-400">*</span></h2>
              </div>
              <div className="space-y-4">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl">
                    <div className="flex items-end gap-3">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className={labelCls}>Category Label</label>
                          <input
                            type="text"
                            placeholder="Languages & Frameworks"
                            value={skill.label}
                            onChange={(e) => handleSkillChange(index, 'label', e.target.value)}
                            className={inputCls}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className={labelCls}>Skills List (Comma-separated)</label>
                          <input
                            type="text"
                            placeholder="JavaScript, TypeScript, Python, C++, Java, React, Node.js"
                            value={skill.skills}
                            onChange={(e) => handleSkillChange(index, 'skills', e.target.value)}
                            className={inputCls}
                          />
                        </div>
                      </div>
                      {formData.skills.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
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
              <button
                type="button"
                onClick={addSkill}
                className={addBtnCls}
              >
                <span>+ Add Skill Category</span>
              </button>
            </div>

            {/* Experience */}
            <div className={cardCls + " animate-fade-in-up animate-delay-400"}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#A6FF5D]/15 border border-[#A6FF5D]/30 flex items-center justify-center text-[#A6FF5D] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Experience <span className="text-gray-400 text-sm font-normal">(Optional)</span></h2>
              </div>
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

            {/* Projects */}
            <div className={cardCls + " animate-fade-in-up animate-delay-500"}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#A6FF5D]/15 border border-[#A6FF5D]/30 flex items-center justify-center text-[#A6FF5D] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Projects <span className="text-red-400">*</span></h2>
              </div>
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

            {/* Education */}
            <div className={cardCls + " animate-fade-in-up animate-delay-600"}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#A6FF5D]/15 border border-[#A6FF5D]/30 flex items-center justify-center text-[#A6FF5D] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Education <span className="text-red-400">*</span></h2>
              </div>
              {formData.education.map((edu, index) => (
                <div key={index} className="mb-6 p-4 sm:p-5 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10">
                    <span className="text-xs font-semibold text-[#A6FF5D] uppercase tracking-wider">Education #{index + 1}</span>
                    {formData.education.length > 1 && (
                      <button type="button" onClick={() => removeEducation(index)} className={removeBtnCls} title="Delete education">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Institution Name</label>
                      <input type="text" placeholder="Indian Institute of Technology (IIT), Bombay" value={edu.institution} onChange={(e) => handleEducationChange(index, 'institution', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Location</label>
                      <input type="text" placeholder="Mumbai, Maharashtra" value={edu.location} onChange={(e) => handleEducationChange(index, 'location', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Degree</label>
                      <input type="text" placeholder="Bachelor of Technology (B.Tech)" value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Field of Study</label>
                      <input type="text" placeholder="Computer Science and Engineering" value={edu.field} onChange={(e) => handleEducationChange(index, 'field', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Start Date</label>
                      <input type="text" placeholder="Aug 2020" value={edu.startDate} onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>End Date</label>
                      <input type="text" placeholder="May 2024" value={edu.endDate} onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)} className={inputCls} />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addEducation} className={addBtnCls}>
                <span>+ Add Education</span>
              </button>
            </div>

            {/* Certifications */}
            <div className={cardCls + " animate-fade-in-up animate-delay-700"}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#A6FF5D]/15 border border-[#A6FF5D]/30 flex items-center justify-center text-[#A6FF5D] shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Certifications & Achievements <span className="text-red-400">*</span></h2>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mb-4">Add your certifications, honors, awards, or achievements as bullet points</p>
              <div className="space-y-3">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-[#A6FF5D] font-bold text-lg select-none">•</span>
                    <input
                      type="text"
                      placeholder="AWS Certified Solutions Architect – Associate (2023)"
                      value={cert}
                      onChange={(e) => handleCertificationChange(index, e.target.value)}
                      className={inputCls}
                    />
                    {formData.certifications.length > 1 && (
                      <button type="button" onClick={() => removeCertification(index)} className={removeBtnCls} title="Delete certification">
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
      </main>

      <Footer />

      <ResumeImporter
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
        onImportData={handleImportData}
      />
    </div>
  )
}

export default Builder
