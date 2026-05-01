import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

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
      <header className="bg-black text-white border-b border-white/10">
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

      <main className="py-12 px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in-down">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Build Your LaTeX Resume
            </h1>
            <p className="text-gray-400 text-lg">
              Using Jake's Resume template - the industry-standard LaTeX format trusted by FAANG engineers and top tech professionals
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Header Information */}
            <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10 hover:border-primary/20 transition-all duration-300 animate-fade-in-up animate-delay-100">
              <h2 className="text-2xl font-semibold text-white mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.header.name}
                  onChange={(e) => handleHeaderChange('name', e.target.value)}
                  required
                  className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none transition-all duration-300 focus:scale-[1.02]"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={formData.header.email}
                  onChange={(e) => handleHeaderChange('email', e.target.value)}
                  required
                  className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.header.phone}
                  onChange={(e) => handleHeaderChange('phone', e.target.value)}
                  className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                />
                <input
                  type="url"
                  placeholder="Portfolio URL"
                  value={formData.header.portfolio}
                  onChange={(e) => handleHeaderChange('portfolio', e.target.value)}
                  className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                />
                <input
                  type="url"
                  placeholder="LinkedIn URL"
                  value={formData.header.linkedin}
                  onChange={(e) => handleHeaderChange('linkedin', e.target.value)}
                  className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                />
                <input
                  type="url"
                  placeholder="GitHub URL"
                  value={formData.header.github}
                  onChange={(e) => handleHeaderChange('github', e.target.value)}
                  className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                />
                <input
                  type="url"
                  placeholder="LeetCode URL"
                  value={formData.header.leetcode}
                  onChange={(e) => handleHeaderChange('leetcode', e.target.value)}
                  className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* Objective */}
            <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10 hover:border-primary/20 transition-all duration-300 animate-fade-in-up animate-delay-200">
              <h2 className="text-2xl font-semibold text-white mb-6">Objective</h2>
              <textarea
                placeholder="Career objective or professional summary"
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                rows="4"
                className="w-full bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none transition-all duration-300 focus:scale-[1.01]"
              />
            </div>

            {/* Skills */}
            <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10 hover:border-primary/20 transition-all duration-300 animate-fade-in-up animate-delay-300">
              <h2 className="text-2xl font-semibold text-white mb-6">Technical Skills</h2>
              {formData.skills.map((skill, index) => (
                <div key={index} className="mb-4 pb-4 border-b border-white/10 last:border-0">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="Category (e.g., Languages)"
                        value={skill.label}
                        onChange={(e) => handleSkillChange(index, 'label', e.target.value)}
                        className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Skills (e.g., JavaScript, Python, Java)"
                        value={skill.skills}
                        onChange={(e) => handleSkillChange(index, 'skills', e.target.value)}
                        className="md:col-span-2 bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                    {formData.skills.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-red-400 hover:text-red-300 transition p-3 hover:bg-red-500/10 rounded-lg"
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
              <button
                type="button"
                onClick={addSkill}
                className="text-primary hover:text-primary/80 font-medium transition"
              >
                + Add Skill Category
              </button>
            </div>

            {/* Experience */}
            <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10 hover:border-primary/20 transition-all duration-300 animate-fade-in-up animate-delay-400">
              <h2 className="text-2xl font-semibold text-white mb-6">Experience</h2>
              {formData.experience.map((exp, expIndex) => (
                <div key={expIndex} className="mb-6 pb-6 border-b border-white/10 last:border-0">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg text-gray-300 font-medium">Experience {expIndex + 1}</h3>
                    {formData.experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeExperience(expIndex)}
                        className="text-red-400 hover:text-red-300 transition p-2 hover:bg-red-500/10 rounded-lg"
                        title="Delete experience"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) => handleExperienceChange(expIndex, 'title', e.target.value)}
                      className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(expIndex, 'company', e.target.value)}
                      className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={exp.location}
                      onChange={(e) => handleExperienceChange(expIndex, 'location', e.target.value)}
                      className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Start Date"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(expIndex, 'startDate', e.target.value)}
                        className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="End Date"
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(expIndex, 'endDate', e.target.value)}
                        className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Responsibilities & Achievements:</label>
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={`Bullet point ${bulletIndex + 1}`}
                          value={bullet}
                          onChange={(e) => handleExperienceBulletChange(expIndex, bulletIndex, e.target.value)}
                          className="flex-1 bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                        />
                        {exp.bullets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeExperienceBullet(expIndex, bulletIndex)}
                            className="text-red-400 hover:text-red-300 transition p-2 hover:bg-red-500/10 rounded-lg"
                            title="Delete bullet point"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addExperienceBullet(expIndex)}
                      className="text-sm text-primary/80 hover:text-primary transition"
                    >
                      + Add Bullet Point
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addExperience}
                className="text-primary hover:text-primary/80 font-medium transition"
              >
                + Add Experience
              </button>
            </div>

            {/* Projects */}
            <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10 hover:border-primary/20 transition-all duration-300 animate-fade-in-up animate-delay-500">
              <h2 className="text-2xl font-semibold text-white mb-6">Projects</h2>
              {formData.projects.map((proj, projIndex) => (
                <div key={projIndex} className="mb-6 pb-6 border-b border-white/10 last:border-0">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg text-gray-300 font-medium">Project {projIndex + 1}</h3>
                    {formData.projects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProject(projIndex)}
                        className="text-red-400 hover:text-red-300 transition p-2 hover:bg-red-500/10 rounded-lg"
                        title="Delete project"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={proj.name}
                      onChange={(e) => handleProjectChange(projIndex, 'name', e.target.value)}
                      className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Date"
                      value={proj.date}
                      onChange={(e) => handleProjectChange(projIndex, 'date', e.target.value)}
                      className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Technologies Used (e.g., React, Node.js, MongoDB)"
                    value={proj.technologies}
                    onChange={(e) => handleProjectChange(projIndex, 'technologies', e.target.value)}
                    className="w-full mb-4 bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                  />
                  <div className="space-y-2 mb-4">
                    <label className="text-sm text-gray-400">Project Details:</label>
                    {proj.bullets.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={`Detail ${bulletIndex + 1}`}
                          value={bullet}
                          onChange={(e) => handleProjectBulletChange(projIndex, bulletIndex, e.target.value)}
                          className="flex-1 bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                        />
                        {proj.bullets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProjectBullet(projIndex, bulletIndex)}
                            className="text-red-400 hover:text-red-300 transition p-2 hover:bg-red-500/10 rounded-lg"
                            title="Delete detail"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addProjectBullet(projIndex)}
                      className="text-sm text-primary/80 hover:text-primary transition"
                    >
                      + Add Detail
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="url"
                      placeholder="Live Site Link (optional)"
                      value={proj.liveLink}
                      onChange={(e) => handleProjectChange(projIndex, 'liveLink', e.target.value)}
                      className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                    />
                    <input
                      type="url"
                      placeholder="GitHub Link (optional)"
                      value={proj.githubLink}
                      onChange={(e) => handleProjectChange(projIndex, 'githubLink', e.target.value)}
                      className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addProject}
                className="text-primary hover:text-primary/80 font-medium transition"
              >
                + Add Project
              </button>
            </div>

            {/* Education */}
            <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10 hover:border-primary/20 transition-all duration-300 animate-fade-in-up animate-delay-600">
              <h2 className="text-2xl font-semibold text-white mb-6">Education</h2>
              {formData.education.map((edu, index) => (
                <div key={index} className="mb-6 pb-6 border-b border-white/10 last:border-0">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg text-gray-300 font-medium">Education {index + 1}</h3>
                    {formData.education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-400 hover:text-red-300 transition p-2 hover:bg-red-500/10 rounded-lg"
                        title="Delete education"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={edu.location}
                      onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                      className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Degree (e.g., Bachelor of Science)"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Field (e.g., Computer Science)"
                      value={edu.field}
                      onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                      className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Start Date"
                      value={edu.startDate}
                      onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                      className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="End Date"
                      value={edu.endDate}
                      onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                      className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addEducation}
                className="text-primary hover:text-primary/80 font-medium transition"
              >
                + Add Education
              </button>
            </div>

            {/* Certifications */}
            <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10 hover:border-primary/20 transition-all duration-300 animate-fade-in-up animate-delay-700">
              <h2 className="text-2xl font-semibold text-white mb-6">Certifications & Achievements</h2>
              <p className="text-sm text-gray-400 mb-4">Add your certifications, achievements, or awards as bullet points</p>
              <div className="space-y-3">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Certification or Achievement ${index + 1}`}
                      value={cert}
                      onChange={(e) => handleCertificationChange(index, e.target.value)}
                      className="flex-1 bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                    />
                    {formData.certifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCertification(index)}
                        className="text-red-400 hover:text-red-300 transition p-2 hover:bg-red-500/10 rounded-lg"
                        title="Delete certification"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addCertification}
                className="mt-4 text-primary hover:text-primary/80 font-medium transition"
              >
                + Add Certification/Achievement
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center animate-fade-in-up">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-800 font-semibold px-8 py-4 rounded-full text-lg transition-smooth hover:scale-105 hover:shadow-lg hover:shadow-[#A6FF5D]/30"
              >
                {loading ? 'Generating PDF...' : 'Generate Resume PDF'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Builder
