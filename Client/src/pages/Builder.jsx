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

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { title: '', company: '', location: '', startDate: '', endDate: '', bullets: [''] }]
    })
  }

  const addExperienceBullet = (index) => {
    const newExperience = [...formData.experience]
    newExperience[index].bullets.push('')
    setFormData({ ...formData, experience: newExperience })
  }

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: '', technologies: '', date: '', bullets: [''], liveLink: '', githubLink: '' }]
    })
  }

  const addProjectBullet = (index) => {
    const newProjects = [...formData.projects]
    newProjects[index].bullets.push('')
    setFormData({ ...formData, projects: newProjects })
  }

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { institution: '', location: '', degree: '', field: '', startDate: '', endDate: '' }]
    })
  }

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [...formData.certifications, '']
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('http://localhost:3001/api/generate-resume', {
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

      <main className="py-12 px-4 md:px-16 lg:px-24 xl:px-32">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Build Your LaTeX Resume
            </h1>
            <p className="text-gray-400 text-lg">
              Using Jake's Resume template - the industry-standard LaTeX format trusted by FAANG engineers and top tech professionals
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Header Information */}
            <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.header.name}
                  onChange={(e) => handleHeaderChange('name', e.target.value)}
                  required
                  className="bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
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
            <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-6">Objective</h2>
              <textarea
                placeholder="Career objective or professional summary"
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                rows="4"
                className="w-full bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
              />
            </div>

            {/* Skills */}
            <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-6">Technical Skills</h2>
              {formData.skills.map((skill, index) => (
                <div key={index} className="mb-4 pb-4 border-b border-white/10 last:border-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-6">Experience</h2>
              {formData.experience.map((exp, expIndex) => (
                <div key={expIndex} className="mb-6 pb-6 border-b border-white/10 last:border-0">
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
                      <input
                        key={bulletIndex}
                        type="text"
                        placeholder={`Bullet point ${bulletIndex + 1}`}
                        value={bullet}
                        onChange={(e) => handleExperienceBulletChange(expIndex, bulletIndex, e.target.value)}
                        className="w-full bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                      />
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
            <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-6">Projects</h2>
              {formData.projects.map((proj, projIndex) => (
                <div key={projIndex} className="mb-6 pb-6 border-b border-white/10 last:border-0">
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
                      <input
                        key={bulletIndex}
                        type="text"
                        placeholder={`Detail ${bulletIndex + 1}`}
                        value={bullet}
                        onChange={(e) => handleProjectBulletChange(projIndex, bulletIndex, e.target.value)}
                        className="w-full bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                      />
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
            <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-6">Education</h2>
              {formData.education.map((edu, index) => (
                <div key={index} className="mb-6 pb-6 border-b border-white/10 last:border-0">
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
            <div className="bg-white/5 backdrop-blur p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-6">Certifications & Achievements</h2>
              <p className="text-sm text-gray-400 mb-4">Add your certifications, achievements, or awards as bullet points</p>
              <div className="space-y-3">
                {formData.certifications.map((cert, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Certification or Achievement ${index + 1}`}
                    value={cert}
                    onChange={(e) => handleCertificationChange(index, e.target.value)}
                    className="w-full bg-white/10 text-white placeholder-gray-400 px-4 py-3 rounded-lg border border-white/20 focus:border-primary focus:outline-none"
                  />
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
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#A6FF5D] hover:bg-[#A6FF5D]/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-800 font-semibold px-8 py-4 rounded-full text-lg transition"
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
