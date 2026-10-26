import React, { useState, useEffect, useRef } from 'react'
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
import { API_URL, getAuthHeaders } from '../config/api'

const inputCls = "w-full bg-white/[0.04] text-white placeholder-white/15 text-sm sm:text-base px-4 py-3 rounded-xl border border-white/20 hover:bg-white/[0.08] hover:border-white/40 focus:bg-black/70 focus:border-[#A6FF5D] focus:ring-2 focus:ring-[#A6FF5D]/30 focus:shadow-[0_0_20px_rgba(166,255,93,0.15)] focus:outline-none transition-all duration-200"
const cardCls = "bg-gray-950/70 backdrop-blur-xl p-5 sm:p-7 md:p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-300 shadow-2xl"
const labelCls = "block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider"
const addBtnCls = "inline-flex items-center gap-2 text-sm font-semibold text-[#A6FF5D] bg-[#A6FF5D]/10 hover:bg-[#A6FF5D]/20 border border-[#A6FF5D]/30 px-4 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer mt-3"
const removeBtnCls = "text-red-400 hover:text-red-300 hover:bg-red-500/15 border border-transparent hover:border-red-500/30 p-2.5 rounded-xl transition-all duration-200 shrink-0"

const SECTION_METADATA = {
  objective: { title: 'Objective', label: 'Objective' },
  skills: { title: 'Technical Skills', label: 'Technical Skills' },
  experience: { title: 'Experience', label: 'Experience' },
  projects: { title: 'Projects', label: 'Projects' },
  education: { title: 'Education', label: 'Education' },
  achievements: { title: 'Achievements', label: 'Achievements' },
  certifications: { title: 'Certifications', label: 'Certifications' },
}

const DEFAULT_SECTION_ORDER = ['objective', 'skills', 'experience', 'projects', 'education', 'achievements', 'certifications']

const SAMPLE_RESUME_BUILDER = {
  header: {
    name: 'Alex Rivera',
    phone: '+1 (555) 019-2834',
    email: 'alex.rivera@example.com',
    portfolio: 'https://alexrivera.dev',
    linkedin: 'https://linkedin.com/in/alexrivera',
    github: 'https://github.com/alexrivera',
    leetcode: 'https://leetcode.com/alexrivera',
  },
  objective: 'Senior Full Stack Software Engineer with 6+ years of experience architecting high-throughput microservices, distributed cloud systems, and real-time reactive web applications. Proven track record driving 99.99% service availability.',
  skills: [
    { label: 'Languages', skills: 'TypeScript, JavaScript, Python, Go, Java, SQL, C++' },
    { label: 'Frontend', skills: 'React, Next.js, Redux, TailwindCSS, Vue.js, GraphQL, WebSockets' },
    { label: 'Backend & Cloud', skills: 'Node.js, Express, FastAPI, PostgreSQL, MongoDB, Docker, AWS, Redis, Kubernetes' },
    { label: 'Developer Tools', skills: 'Git, GitHub Actions, CI/CD, Jest, Vite, Linux, NGINX, LaTeX' },
  ],
  experience: [
    {
      company: 'Apex Cloud Systems',
      title: 'Senior Full Stack Engineer',
      location: 'San Francisco, CA',
      startDate: 'Jun 2022',
      endDate: 'Present',
      bullets: [
        'Architected high-throughput microservices in TypeScript and Node.js, handling 5M+ daily active API requests with 99.99% service uptime.',
        'Engineered real-time data sync pipeline using WebSockets and Redis Pub/Sub, reducing data delivery latency by 68%.',
        'Spearheaded frontend migration to Next.js 14 and TailwindCSS, improving Google Lighthouse performance score from 62 to 98.',
      ],
    },
    {
      company: 'Nexus Tech Labs',
      title: 'Software Engineer',
      location: 'San Jose, CA',
      startDate: 'Jul 2020',
      endDate: 'May 2022',
      bullets: [
        'Developed serverless REST and GraphQL APIs deployed on AWS Lambda & PostgreSQL, reducing infrastructure costs by $45,000 annually.',
        'Implemented automated CI/CD deployment workflows using GitHub Actions and Docker, reducing release cycle time from 3 days to 15 minutes.',
        'Collaborated with security auditors to implement OAuth2 / JWT role-based access controls for 150,000+ active enterprise accounts.',
      ],
    },
  ],
  projects: [
    {
      name: 'LaTexume Platform',
      technologies: 'React, Node.js, Express, Docker, MongoDB',
      date: '2024',
      liveLink: 'https://latexume.vercel.app',
      githubLink: 'https://github.com/alexrivera/latexume',
      bullets: [
        'Built open-source LaTeX resume generator with live PDF preview, ATS keyword matching, and AI bullet optimization.',
        'Containerized LaTeX compilation environment in Docker to achieve sub-second PDF generation speeds across 100,000+ downloads.',
      ],
    },
    {
      name: 'Distributed Vector DB Visualizer',
      technologies: 'Python, FastAPI, React, D3.js, Embeddings',
      date: '2023',
      liveLink: 'https://vectorviz.dev',
      githubLink: 'https://github.com/alexrivera/vector-viz',
      bullets: [
        'Created interactive 3D spatial visualization tool for high-dimensional vector embeddings, adopted by 3,000+ ML developers.',
      ],
    },
  ],
  education: [
    {
      institution: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science & Engineering',
      field: 'GPA: 3.89 / 4.0',
      location: 'Berkeley, CA',
      startDate: 'Aug 2016',
      endDate: 'May 2020',
      coursework: 'Data Structures, Operating Systems, Algorithms, Distributed Systems',
    },
  ],
  certifications: [
    'AWS Certified Solutions Architect – Associate (2023)',
    'Certified Kubernetes Application Developer (CKAD) – CNCF (2022)',
  ],
  achievements: [
    'Winner – Global Cloud Hackathon 2023: Built real-time collaborative workspace tool (1st place out of 450+ teams)',
    'Published author: "Architecting Resilient Microservices with TypeScript and Redis" on InfoQ',
  ],
}

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
      endDate: '',
      coursework: ''
    }],
    certifications: [''],
    achievements: [''],
    sectionOrder: DEFAULT_SECTION_ORDER,
  })

  const [draggedSectionKey, setDraggedSectionKey] = useState(null)
  const [dragOverSectionKey, setDragOverSectionKey] = useState(null)
  const [dropPosition, setDropPosition] = useState(null) // 'above' | 'below'

  const moveSection = (sectionKey, direction) => {
    const currentOrder = formData.sectionOrder || DEFAULT_SECTION_ORDER
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

  const moveSectionToExtremity = (sectionKey, position) => {
    const currentOrder = formData.sectionOrder || DEFAULT_SECTION_ORDER
    const filtered = currentOrder.filter((k) => k !== sectionKey)
    const updated = position === 'top' ? [sectionKey, ...filtered] : [...filtered, sectionKey]
    setFormData((prev) => ({ ...prev, sectionOrder: updated }))
  }

  const resetSectionOrder = () => {
    setFormData((prev) => ({ ...prev, sectionOrder: DEFAULT_SECTION_ORDER }))
    setToastMessage('Section order reset to recommended default')
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleDragStartSection = (e, sectionKey) => {
    e.stopPropagation()
    e.dataTransfer.setData('text/plain', sectionKey)
    e.dataTransfer.effectAllowed = 'move'
    setDraggedSectionKey(sectionKey)
  }

  const handleDragEndSection = () => {
    setDraggedSectionKey(null)
    setDragOverSectionKey(null)
    setDropPosition(null)
  }

  const handleCardDragOver = (e, targetKey) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (!draggedSectionKey || draggedSectionKey === targetKey) {
      if (dragOverSectionKey) {
        setDragOverSectionKey(null)
        setDropPosition(null)
      }
      return
    }
    const rect = e.currentTarget.getBoundingClientRect()
    const offset = e.clientY - rect.top
    const pos = offset < rect.height / 2 ? 'above' : 'below'
    if (dragOverSectionKey !== targetKey || dropPosition !== pos) {
      setDragOverSectionKey(targetKey)
      setDropPosition(pos)
    }
  }

  const handleCardDragLeave = (e, targetKey) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      if (dragOverSectionKey === targetKey) {
        setDragOverSectionKey(null)
        setDropPosition(null)
      }
    }
  }

  const handleDropSection = (e, targetKey) => {
    e.preventDefault()
    e.stopPropagation()
    const draggedKey = e.dataTransfer.getData('text/plain') || draggedSectionKey
    const pos = dropPosition

    setDraggedSectionKey(null)
    setDragOverSectionKey(null)
    setDropPosition(null)

    if (!draggedKey || draggedKey === targetKey) return

    const currentOrder = formData.sectionOrder || DEFAULT_SECTION_ORDER
    const draggedIdx = currentOrder.indexOf(draggedKey)
    if (draggedIdx === -1) return

    const filtered = currentOrder.filter((k) => k !== draggedKey)
    const targetIdx = filtered.indexOf(targetKey)
    if (targetIdx === -1) return

    const insertIdx = pos === 'below' ? targetIdx + 1 : targetIdx
    filtered.splice(insertIdx, 0, draggedKey)

    setFormData((prev) => ({ ...prev, sectionOrder: filtered }))
    const title = SECTION_METADATA[draggedKey]?.title || draggedKey
    setToastMessage(`Reordered section: ${title}`)
    setTimeout(() => setToastMessage(''), 2500)
  }

  const [loading, setLoading] = useState(false)
  const [isImporterOpen, setIsImporterOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [activeEnhanceBullet, setActiveEnhanceBullet] = useState(null)
  const [currentResumeId, setCurrentResumeId] = useState(null)
  const [currentResumeTitle, setCurrentResumeTitle] = useState('')
  const [isSavedResumesOpen, setIsSavedResumesOpen] = useState(false)
  const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false)
  const [mobileViewTab, setMobileViewTab] = useState('editor') // 'editor' | 'preview'
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false)
  const templateDropdownRef = useRef(null)
  const [searchParams] = useSearchParams()
  const [collapsedSections, setCollapsedSections] = useState({})

  const toggleCollapseSection = (key) => {
    setCollapsedSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Calculate dynamic ATS Completeness / Readiness Score (0-100)
  const calculateAtsScore = () => {
    let score = 0
    if (formData.header?.name?.trim()) score += 10
    if (formData.header?.email?.trim()) score += 8
    if (formData.header?.phone?.trim()) score += 4
    if (formData.header?.linkedin || formData.header?.github || formData.header?.portfolio) score += 4
    if (formData.objective?.trim()?.length > 40) score += 14
    else if (formData.objective?.trim()) score += 7

    const validSkills = (formData.skills || []).filter((s) => s.skills?.trim())
    if (validSkills.length >= 2) score += 20
    else if (validSkills.length === 1) score += 12

    const validExp = (formData.experience || []).filter((e) => e.company?.trim() || e.title?.trim())
    const hasBullets = validExp.some((e) => (e.bullets || []).some((b) => b?.trim()?.length > 15))
    if (validExp.length >= 1 && hasBullets) score += 20
    else if (validExp.length >= 1) score += 10

    const validEdu = (formData.education || []).filter((e) => e.institution?.trim() || e.degree?.trim())
    if (validEdu.length >= 1) score += 10

    const validProj = (formData.projects || []).filter((p) => p.name?.trim())
    const validCert = (formData.certifications || []).filter((c) => typeof c === 'string' ? c?.trim() : c?.name?.trim())
    if (validProj.length >= 1 || validCert.length >= 1) score += 10

    return Math.min(score, 100)
  }

  const atsScore = calculateAtsScore()

  const handleLoadSampleData = () => {
    if (formData.header?.name && !window.confirm('Populate form with sample data? This will overwrite unsaved fields.')) {
      return
    }
    setFormData({
      ...SAMPLE_RESUME_BUILDER,
      templateId: formData.templateId || 'jake',
      sectionOrder: DEFAULT_SECTION_ORDER,
    })
    setToastMessage('⚡ Realistic software engineer resume loaded!')
    setTimeout(() => setToastMessage(''), 4000)
  }

  const handleClearForm = () => {
    if (!window.confirm('Are you sure you want to clear all form fields?')) return
    setFormData({
      templateId: formData.templateId || 'jake',
      header: { name: '', phone: '', email: '', portfolio: '', linkedin: '', github: '', leetcode: '' },
      objective: '',
      skills: [{ label: '', skills: '' }],
      experience: [{ title: '', company: '', location: '', startDate: '', endDate: '', bullets: [''] }],
      projects: [{ name: '', technologies: '', date: '', bullets: [''], liveLink: '', githubLink: '' }],
      education: [{ institution: '', location: '', degree: '', field: '', startDate: '', endDate: '', coursework: '' }],
      certifications: [''],
      achievements: [''],
      sectionOrder: DEFAULT_SECTION_ORDER,
    })
    setCurrentResumeId(null)
    setCurrentResumeTitle('')
    setToastMessage('Form cleared.')
    setTimeout(() => setToastMessage(''), 3000)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (templateDropdownRef.current && !templateDropdownRef.current.contains(event.target)) {
        setIsTemplateDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  // Helper to sanitize project items and remove duplicate Tech: / Link: bullets
  const sanitizeProjectItem = (p) => {
    if (!p) return { name: '', technologies: '', date: '', bullets: [''], liveLink: '', githubLink: '' }
    let technologies = (p.technologies || '').trim()
    let liveLink = p.liveLink || ''
    let githubLink = p.githubLink || ''
    const cleanBullets = []

    for (const b of (p.bullets || [])) {
      if (!b || typeof b !== 'string') continue
      const trimmed = b.trim()
      if (!trimmed) continue

      const techMatch = trimmed.match(/^(?:tech|technologies|tech stack)\s*:\s*(.*)$/i)
      if (techMatch) {
        if (!technologies) technologies = techMatch[1].trim()
        continue
      }

      if (technologies && trimmed.toLowerCase() === technologies.toLowerCase()) {
        continue
      }

      const liveMatch = trimmed.match(/live:\s*([^\s,|]+)/i)
      if (liveMatch && !liveLink) {
        liveLink = liveMatch[1].trim()
        continue
      }

      const githubMatch = trimmed.match(/github:\s*([^\s,|]+)/i)
      if (githubMatch && !githubLink) {
        githubLink = githubMatch[1].trim()
        continue
      }

      if (/^(?:live|github|demo|repo)\s*:\s*/i.test(trimmed)) {
        continue
      }

      if (/^[•\-\*◦▪▫–—\s]*((Live(\s*Site|\s*Demo)?)|GitHub|Demo|Code)(\s*\|\s*((Live(\s*Site|\s*Demo)?)|GitHub|Demo|Code|\s*))*$/i.test(trimmed)) {
        continue
      }

      cleanBullets.push(trimmed)
    }

    return {
      ...p,
      technologies,
      liveLink,
      githubLink,
      bullets: cleanBullets.length > 0 ? cleanBullets : [''],
    }
  }

  // Load local draft on mount if form is uninitialized, cleaning any duplicate bullets
  useEffect(() => {
    const savedDraft = localStorage.getItem('latexume_draft')
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        if (parsed.header && !formData.header.name && !formData.header.email) {
          const cleanedProjects = Array.isArray(parsed.projects)
            ? parsed.projects.map(sanitizeProjectItem)
            : parsed.projects
          const updatedDraft = {
            ...parsed,
            projects: cleanedProjects,
            sectionOrder: parsed.sectionOrder || DEFAULT_SECTION_ORDER,
          }
          setFormData(updatedDraft)
          localStorage.setItem('latexume_draft', JSON.stringify(updatedDraft))
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

    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/v1/resumes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          resumeId: currentResumeId,
          title,
          templateId: formData.templateId || 'jake',
          formData: {
            ...formData,
            templateId: formData.templateId || 'jake',
          },
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
    setFormData({
      ...loadedFormData,
      sectionOrder: loadedFormData.sectionOrder || DEFAULT_SECTION_ORDER,
    })
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
    const cleanParsed = {
      ...parsedData,
      projects: (parsedData.projects || []).map(sanitizeProjectItem),
    }

    if (mode === 'replace') {
      setFormData({
        templateId: formData.templateId || 'jake',
        ...cleanParsed,
        sectionOrder: cleanParsed.sectionOrder || formData.sectionOrder || DEFAULT_SECTION_ORDER,
      })
    } else {
      setFormData((prev) => ({
        ...prev,
        header: {
          name: cleanParsed.header.name || prev.header.name,
          phone: cleanParsed.header.phone || prev.header.phone,
          email: cleanParsed.header.email || prev.header.email,
          portfolio: cleanParsed.header.portfolio || prev.header.portfolio,
          linkedin: cleanParsed.header.linkedin || prev.header.linkedin,
          github: cleanParsed.header.github || prev.header.github,
          leetcode: cleanParsed.header.leetcode || prev.header.leetcode,
        },
        objective: cleanParsed.objective || prev.objective,
        skills: [...prev.skills.filter((s) => s.label || s.skills), ...(cleanParsed.skills || [])],
        experience: [...prev.experience.filter((e) => e.title || e.company), ...(cleanParsed.experience || [])],
        projects: [...prev.projects.filter((p) => p.name).map(sanitizeProjectItem), ...(cleanParsed.projects || [])],
        education: [...prev.education.filter((ed) => ed.institution || ed.degree), ...(cleanParsed.education || [])],
        certifications: [...prev.certifications.filter(Boolean), ...(cleanParsed.certifications || [])],
        achievements: [...(prev.achievements || []).filter(Boolean), ...(cleanParsed.achievements || [])],
        sectionOrder: prev.sectionOrder || DEFAULT_SECTION_ORDER,
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

  const handleAchievementChange = (index, value) => {
    const newAchievements = [...(formData.achievements || [])]
    newAchievements[index] = value
    setFormData({ ...formData, achievements: newAchievements })
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
      education: [...formData.education, { institution: '', location: '', degree: '', field: '', startDate: '', endDate: '', coursework: '' }]
    })
  }

  const removeEducation = (index) => {
    const newEducation = formData.education.filter((_, i) => i !== index)
    setFormData({ ...formData, education: newEducation.length > 0 ? newEducation : [{ institution: '', location: '', degree: '', field: '', startDate: '', endDate: '', coursework: '' }] })
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

  const addAchievement = () => {
    setFormData({
      ...formData,
      achievements: [...(formData.achievements || []), '']
    })
  }

  const removeAchievement = (index) => {
    const newAchievements = (formData.achievements || []).filter((_, i) => i !== index)
    setFormData({ ...formData, achievements: newAchievements.length > 0 ? newAchievements : [''] })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

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
        const cleanName = (formData?.header?.name || 'Resume').trim().replace(/\s+/g, '_')
        a.download = `${cleanName || 'Resume'}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setMobileViewTab('preview')
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
    <div className="min-h-screen bg-transparent">
      <SEO 
        title="Interactive LaTeX Resume Builder & Editor"
        description="Build and customize your LaTeX resume online with real-time preview and instant PDF export using Jake's Resume template."
        keywords="online latex resume editor, build latex resume, resume generator app, ATS resume creator"
        canonicalPath="/builder"
      />
      <header className="bg-transparent text-white border-b border-white/10 pt-20">
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
        <div className="relative z-50 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6 animate-fade-in-down bg-zinc-950/80 backdrop-blur-xl p-5 sm:p-7 rounded-3xl border border-[#A6FF5D]/30 shadow-[0_0_30px_rgba(166,255,93,0.15)] hover:border-[#A6FF5D]/50 transition-all duration-300">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-black bg-[#A6FF5D] px-2.5 py-0.5 rounded-full shadow-sm">
                Pro LaTeX Editor
              </span>
              <span className="text-xs text-zinc-400 font-mono hidden sm:inline">
                Real-time Live Sync
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              Build Your LaTeX Resume
            </h1>
            <p className="text-zinc-300 text-xs sm:text-sm mt-1 font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              Reorder sections via ⠿ Drag or ▲/▼ • Instant sub-second PDF compilation
            </p>
          </div>

          {/* Compact Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Real-time ATS Readiness Meter */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700/80 shadow-md">
              <div className="relative flex items-center justify-center">
                <span className={`w-2.5 h-2.5 rounded-full ${atsScore >= 80 ? 'bg-[#A6FF5D] shadow-[0_0_8px_#A6FF5D]' : atsScore >= 50 ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : 'bg-red-400 shadow-[0_0_8px_#f87171]'} animate-pulse`} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider leading-none">ATS Readiness</span>
                <span className="text-xs font-bold text-white leading-none mt-0.5">
                  <span className={atsScore >= 80 ? 'text-[#A6FF5D]' : atsScore >= 50 ? 'text-amber-400' : 'text-red-400'}>
                    {atsScore}%
                  </span>
                  {' '}<span className="text-zinc-400 font-normal hidden sm:inline">• {atsScore >= 80 ? 'Ready ⚡' : atsScore >= 50 ? 'Good' : 'Needs Info'}</span>
                </span>
              </div>
            </div>

            {/* Template Switcher */}
            <div ref={templateDropdownRef} className="relative bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 hover:border-[#A6FF5D]/50 font-medium rounded-xl transition-all duration-300 flex items-center shadow-md">
              <button 
                type="button"
                onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                className="w-full flex items-center gap-2 px-3.5 py-1.5 cursor-pointer text-xs sm:text-sm"
              >
                <svg className="w-4 h-4 text-[#A6FF5D] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h3a1 1 0 011 1v6a1 1 0 01-1 1h-3a1 1 0 01-1-1v-6z" />
                </svg>
                <span className="text-zinc-400 shrink-0">Template:</span>
                <span className="text-white font-semibold">
                  {formData.templateId === 'blueAccent' ? 'Blue Accent' : formData.templateId === 'classic' ? 'Classic Serif' : "Jake's Clean"}
                </span>
                <svg className={`w-3 h-3 ml-1 transition-transform ${isTemplateDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isTemplateDropdownOpen && (
                <div className="absolute top-full mt-1.5 left-0 w-full min-w-[160px] bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-xl overflow-hidden z-50">
                  <button
                    type="button"
                    onClick={() => { setFormData(prev => ({ ...prev, templateId: 'jake', sectionOrder: prev.sectionOrder || DEFAULT_SECTION_ORDER })); setIsTemplateDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-semibold hover:bg-zinc-800 transition ${formData.templateId === 'jake' ? 'bg-zinc-800 text-[#A6FF5D]' : 'text-zinc-300'}`}
                  >
                    Jake's Clean (Standard)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFormData(prev => ({ ...prev, templateId: 'blueAccent', sectionOrder: prev.sectionOrder || DEFAULT_SECTION_ORDER })); setIsTemplateDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-semibold hover:bg-zinc-800 transition ${formData.templateId === 'blueAccent' ? 'bg-zinc-800 text-blue-400' : 'text-zinc-300'}`}
                  >
                    Blue Accent (Modern)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFormData(prev => ({ ...prev, templateId: 'classic', sectionOrder: prev.sectionOrder || DEFAULT_SECTION_ORDER })); setIsTemplateDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-semibold hover:bg-zinc-800 transition ${formData.templateId === 'classic' ? 'bg-zinc-800 text-amber-400' : 'text-zinc-300'}`}
                  >
                    Classic Serif (Executive)
                  </button>
                </div>
              )}
            </div>

            {/* Quick Sample Data */}
            <button
              type="button"
              onClick={handleLoadSampleData}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 hover:border-[#A6FF5D]/50 font-medium px-3.5 py-1.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer shadow-md"
              title="Populate form with comprehensive sample software engineer resume"
            >
              <span className="text-[#A6FF5D]">⚡</span>
              <span>Sample Data</span>
            </button>

            {/* ATS Matcher */}
            <Link
              to="/ats-optimizer"
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 hover:border-[#A6FF5D]/50 font-medium px-3.5 py-1.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer shadow-md"
              title="Target Job Description & ATS Optimizer"
            >
              <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 hover:border-[#A6FF5D]/50 font-medium px-3.5 py-1.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer shadow-md"
            >
              <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span>Save Draft</span>
            </button>

            {/* My Resumes */}
            <button
              type="button"
              onClick={() => setIsSavedResumesOpen(true)}
              className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 hover:border-[#A6FF5D]/50 font-medium px-3.5 py-1.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer shadow-md"
            >
              <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            {/* Clear Form */}
            <button
              type="button"
              onClick={handleClearForm}
              className="bg-zinc-900 hover:bg-red-500/15 text-zinc-400 hover:text-red-400 border border-zinc-700/80 hover:border-red-500/30 font-medium px-2.5 py-1.5 rounded-xl transition-all duration-300 flex items-center gap-1 text-xs cursor-pointer shadow-md"
              title="Clear all fields"
            >
              <span>🗑️</span>
              <span className="hidden sm:inline">Clear</span>
            </button>

            {/* Mobile View Mode Quick Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = mobileViewTab === 'editor' ? 'preview' : 'editor'
                setMobileViewTab(next)
                if (next === 'preview') window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="lg:hidden bg-[#A6FF5D] hover:bg-[#b8ff7a] text-black font-extrabold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 text-xs shadow-md border border-[#A6FF5D] cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Toggle between Form Editor and Live Preview"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
              </span>
              <span>{mobileViewTab === 'preview' ? '✏️ Edit Form' : '👁️ Preview'}</span>
            </button>
          </div>
        </div>

        {/* Mobile View Switcher Segmented Tabs */}
        <div className="lg:hidden flex items-center justify-center p-1 bg-zinc-900/90 border border-zinc-800 rounded-2xl mb-5 shadow-xl backdrop-blur-md">
          <button
            type="button"
            onClick={() => setMobileViewTab('editor')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mobileViewTab === 'editor'
                ? 'bg-[#A6FF5D] text-black shadow-lg font-extrabold border border-[#A6FF5D]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>✏️ Form Editor</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileViewTab('preview')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mobileViewTab === 'preview'
                ? 'bg-[#A6FF5D] text-black shadow-lg font-extrabold border border-[#A6FF5D]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
            </span>
            <span>👁️ Live Preview</span>
          </button>
        </div>

        {/* TRUE SIDE-BY-SIDE SPLIT VIEW ON DESKTOP, RESPONSIVE TABS ON MOBILE */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* LEFT COLUMN: FORM INPUTS & REORDERABLE SECTIONS */}
          <div className={`${mobileViewTab === 'preview' ? 'hidden lg:block' : 'block'} w-full lg:w-[54%] xl:w-[56%] space-y-6 overflow-y-auto lg:max-h-[calc(100vh-80px)] pr-2 pb-6`}>
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

            {/* Section Hierarchy & Quick Reorder Ribbon */}
            <div className="bg-gray-950/80 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-white/10 shadow-2xl space-y-3 animate-fade-in-up">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#A6FF5D] shadow-[0_0_8px_#A6FF5D]" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-200">
                    Section Hierarchy & Order
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#A6FF5D]/10 text-[#A6FF5D] font-semibold border border-[#A6FF5D]/30">
                    {(formData.sectionOrder || DEFAULT_SECTION_ORDER).length} sections
                  </span>
                </div>
                <button
                  type="button"
                  onClick={resetSectionOrder}
                  className="text-xs text-zinc-400 hover:text-white hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Reset to recommended standard resume order"
                >
                  <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Reset Default</span>
                </button>
              </div>

              <p className="text-xs text-zinc-400">
                Drag chips below or grab the <span className="text-[#A6FF5D] font-mono font-semibold">⠿ Drag Handle</span> on any section to reorder. Text and word selection inside inputs is fully preserved.
              </p>

              {/* Quick Interactive Reorder Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {(formData.sectionOrder || DEFAULT_SECTION_ORDER).map((key, idx) => {
                  const meta = SECTION_METADATA[key] || { title: key, label: key }
                  const isBeingDragged = draggedSectionKey === key
                  const isDropTarget = dragOverSectionKey === key

                  return (
                    <div
                      key={`chip-${key}`}
                      draggable
                      onDragStart={(e) => handleDragStartSection(e, key)}
                      onDragEnd={handleDragEndSection}
                      onDragOver={(e) => handleCardDragOver(e, key)}
                      onDrop={(e) => handleDropSection(e, key)}
                      onClick={() => {
                        const el = document.getElementById(`section-card-${key}`)
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                      className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-grab active:cursor-grabbing transition-all select-none duration-150 ${
                        isBeingDragged
                          ? 'opacity-40 border-dashed border-[#A6FF5D] bg-[#A6FF5D]/10 scale-95'
                          : isDropTarget
                          ? 'border-[#A6FF5D] bg-[#A6FF5D]/20 text-[#A6FF5D] shadow-[0_0_12px_rgba(166,255,93,0.3)] scale-105'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border-white/10 hover:border-white/30'
                      }`}
                      title={`Click to scroll, or drag to reorder ${meta.title}`}
                    >
                      <span className="text-[10px] font-mono font-bold text-zinc-400 group-hover:text-[#A6FF5D]">
                        #{idx + 1}
                      </span>
                      <span>{meta.label}</span>
                      <span className="text-zinc-500 group-hover:text-[#A6FF5D] text-[11px] ml-0.5">⠿</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Dynamic Reorderable Sections */}
            {(formData.sectionOrder || DEFAULT_SECTION_ORDER).map((key, index) => {
              const currentOrder = formData.sectionOrder || DEFAULT_SECTION_ORDER
              const meta = SECTION_METADATA[key] || { title: key, label: key }
              const isBeingDragged = draggedSectionKey === key
              const isDropTarget = dragOverSectionKey === key

              return (
                <div key={key} className="relative group">
                  {/* Drop Indicator Above */}
                  {isDropTarget && dropPosition === 'above' && (
                    <div className="h-2 w-full bg-gradient-to-r from-transparent via-[#A6FF5D] to-transparent rounded-full shadow-[0_0_14px_#A6FF5D] my-2 animate-pulse flex items-center justify-center">
                      <span className="bg-[#A6FF5D] text-gray-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow-lg">
                        Drop {meta.title} Here
                      </span>
                    </div>
                  )}

                  <div
                    id={`section-card-${key}`}
                    onDragOver={(e) => handleCardDragOver(e, key)}
                    onDragLeave={(e) => handleCardDragLeave(e, key)}
                    onDrop={(e) => handleDropSection(e, key)}
                    className={`${cardCls} transition-all duration-200 border ${
                      isBeingDragged
                        ? 'opacity-30 border-dashed border-[#A6FF5D]/60 scale-[0.99]'
                        : isDropTarget
                        ? 'border-[#A6FF5D]/80 ring-2 ring-[#A6FF5D]/30 shadow-[0_0_25px_rgba(166,255,93,0.2)]'
                        : 'border-white/10 hover:border-emerald-500/30'
                    }`}
                  >
                    {/* Reorder Header */}
                    <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 mb-6 gap-3 select-none">
                      <div className="flex items-center gap-3">
                        {/* Dedicated Drag Handle - isolated to avoid text selection conflicts */}
                        <div
                          draggable
                          onDragStart={(e) => handleDragStartSection(e, key)}
                          onDragEnd={handleDragEndSection}
                          className="text-zinc-400 hover:text-white cursor-grab active:cursor-grabbing font-mono text-xs px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-[#A6FF5D]/15 border border-white/10 hover:border-[#A6FF5D]/40 transition-all flex items-center gap-1.5 shadow-sm group/handle"
                          title="Drag this handle to reorder section"
                        >
                          <span className="text-[#A6FF5D] text-sm group-hover/handle:scale-110 transition-transform">⠿</span>
                          <span className="font-sans font-semibold text-zinc-300 group-hover/handle:text-white hidden sm:inline">Drag</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-[#A6FF5D] font-bold">#{index + 1}</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                          <span>{meta.title}</span>
                        </h2>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => toggleCollapseSection(key)}
                          className="text-xs bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-xl border border-white/10 transition cursor-pointer flex items-center gap-1 font-medium"
                          title={collapsedSections[key] ? 'Expand section' : 'Collapse section'}
                        >
                          <span>{collapsedSections[key] ? '▾ Expand' : '▴ Fold'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSectionToExtremity(key, 'top')}
                          disabled={index === 0}
                          className="text-xs bg-white/5 hover:bg-white/15 text-zinc-300 disabled:opacity-20 px-2 py-1.5 rounded-xl border border-white/10 transition cursor-pointer hidden md:inline-flex items-center"
                          title="Move to top of resume"
                        >
                          ⤒
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSection(key, 'up')}
                          disabled={index === 0}
                          className="text-xs bg-white/5 hover:bg-white/15 text-zinc-300 disabled:opacity-20 px-2.5 py-1.5 rounded-xl border border-white/10 transition cursor-pointer flex items-center gap-1"
                          title="Move section up"
                        >
                          ▲ <span className="hidden sm:inline">Up</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSection(key, 'down')}
                          disabled={index === currentOrder.length - 1}
                          className="text-xs bg-white/5 hover:bg-white/15 text-zinc-300 disabled:opacity-20 px-2.5 py-1.5 rounded-xl border border-white/10 transition cursor-pointer flex items-center gap-1"
                          title="Move section down"
                        >
                          ▼ <span className="hidden sm:inline">Down</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => moveSectionToExtremity(key, 'bottom')}
                          disabled={index === currentOrder.length - 1}
                          className="text-xs bg-white/5 hover:bg-white/15 text-zinc-300 disabled:opacity-20 px-2 py-1.5 rounded-xl border border-white/10 transition cursor-pointer hidden md:inline-flex items-center"
                          title="Move to bottom of resume"
                        >
                          ⤓
                        </button>
                      </div>
                    </div>

                    {/* Section Body (Collapsible) */}
                    {collapsedSections[key] ? (
                      <div
                        onClick={() => toggleCollapseSection(key)}
                        className="py-3.5 px-4 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-zinc-400 cursor-pointer hover:bg-white/[0.06] hover:text-white transition flex items-center justify-between group"
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#A6FF5D]" />
                          <span>{meta.title} section is folded — click to expand and edit</span>
                        </span>
                        <span className="text-[#A6FF5D] font-bold group-hover:underline">Expand ▾</span>
                      </div>
                    ) : (
                      <>

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
                            <div className="sm:col-span-2">
                              <label className={labelCls}>Core Coursework (Optional)</label>
                              <input type="text" placeholder="Data Structures, Algorithms, OS, DBMS" value={edu.coursework} onChange={(e) => handleEducationChange(eduIdx, 'coursework', e.target.value)} className={inputCls} />
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
                      <p className="text-xs sm:text-sm text-gray-400 mb-4">Add your certifications as bullet points</p>
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
                        <span>+ Add Certification</span>
                      </button>
                    </div>
                  )}

                  {/* ACHIEVEMENTS CARD */}
                  {key === 'achievements' && (
                    <div>
                      <p className="text-xs sm:text-sm text-gray-400 mb-4">Add your honors, awards, or achievements as bullet points</p>
                      <div className="space-y-3">
                        {(formData.achievements || []).map((ach, achIdx) => (
                          <div key={achIdx} className="flex items-center gap-2">
                            <span className="text-[#A6FF5D] font-bold text-lg select-none">•</span>
                            <input
                              type="text"
                              placeholder="Solved 500+ DSA Problems on LeetCode"
                              value={ach}
                              onChange={(e) => handleAchievementChange(achIdx, e.target.value)}
                              className={inputCls}
                            />
                            {(formData.achievements || []).length > 1 && (
                              <button type="button" onClick={() => removeAchievement(achIdx)} className={removeBtnCls} title="Delete achievement">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={addAchievement} className={addBtnCls}>
                        <span>+ Add Achievement</span>
                      </button>
                    </div>
                  )}
                  </>
                )}
                </div>

                {/* Drop Indicator Below */}
                {isDropTarget && dropPosition === 'below' && (
                  <div className="h-2 w-full bg-gradient-to-r from-transparent via-[#A6FF5D] to-transparent rounded-full shadow-[0_0_14px_#A6FF5D] my-2 animate-pulse flex items-center justify-center">
                    <span className="bg-[#A6FF5D] text-gray-950 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full shadow-lg">
                      Drop {meta.title} Here
                    </span>
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
        <div className={`${mobileViewTab === 'preview' ? 'block' : 'hidden lg:block'} w-full lg:w-[46%] xl:w-[44%] lg:sticky lg:top-24 self-start`}>
          <RightPreviewPane formData={formData} onBackToEditor={() => setMobileViewTab('editor')} />
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

      {/* Mobile Floating Action Button (1-tap Switch between Form & Live Preview) */}
      <button
        type="button"
        onClick={() => {
          if (mobileViewTab === 'editor') {
            setMobileViewTab('preview')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          } else {
            setMobileViewTab('editor')
          }
        }}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-[#A6FF5D] hover:bg-[#b8ff7a] text-gray-950 font-extrabold px-4 sm:px-5 py-3 rounded-full shadow-[0_0_25px_rgba(166,255,93,0.45)] border border-[#A6FF5D] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
        aria-label={mobileViewTab === 'preview' ? 'Back to Form Editor' : 'Open Live Resume Preview'}
      >
        {mobileViewTab === 'preview' ? (
          <>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-xs font-black uppercase tracking-wider">Edit Form</span>
          </>
        ) : (
          <>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-950 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gray-950"></span>
            </span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-xs font-black uppercase tracking-wider">Live Preview</span>
          </>
        )}
      </button>
    </div>
  )
}

export default Builder

