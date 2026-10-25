import { escapeLatex } from './latexEscape.js'
import { buildTemplate as buildJake } from '../templates/jake.tex.js'
import { buildTemplate as buildBlueAccent } from '../templates/blueAccent.tex.js'
import { buildTemplate as buildClassic } from '../templates/classic.tex.js'

/**
 * Pure function: Resume_Data → complete .tex string
 * Applies escapeLatex to every user-supplied string before interpolation.
 * Selects template based on data.templateId ('jake' | 'blueAccent' | 'classic')
 *
 * @param {object} data - Resume_Data object
 * @returns {string} - Complete .tex source
 */
export function templateEngine(data) {
  const templateId = data.templateId || 'jake'
  const sectionOrder = (Array.isArray(data.sectionOrder) && data.sectionOrder.length > 0)
    ? data.sectionOrder
    : ['objective', 'skills', 'experience', 'projects', 'education', 'achievements', 'certifications']

  switch (templateId) {
    case 'blueAccent':
      return buildBlueAccent({
        sectionOrder,
        header: buildBlueHeader(data.header),
        objective: buildBlueObjective(data.objective),
        skills: buildBlueSkills(data.skills),
        experience: buildBlueExperience(data.experience),
        projects: buildBlueProjects(data.projects),
        education: buildBlueEducation(data.education),
        certifications: buildBlueCertifications(data.certifications),
        achievements: buildBlueAchievements(data.achievements),
      })

    case 'classic':
      return buildClassic({
        sectionOrder,
        header: buildJakeHeader(data.header),
        objective: buildJakeObjective(data.objective),
        skills: buildJakeSkills(data.skills),
        experience: buildJakeExperience(data.experience),
        projects: buildJakeProjects(data.projects),
        education: buildJakeEducation(data.education),
        certifications: buildJakeCertifications(data.certifications),
        achievements: buildJakeAchievements(data.achievements),
      })

    case 'jake':
    default:
      return buildJake({
        sectionOrder,
        header: buildJakeHeader(data.header),
        objective: buildJakeObjective(data.objective),
        skills: buildJakeSkills(data.skills),
        experience: buildJakeExperience(data.experience),
        projects: buildJakeProjects(data.projects),
        education: buildJakeEducation(data.education),
        certifications: buildJakeCertifications(data.certifications),
        achievements: buildJakeAchievements(data.achievements),
      })
  }
}

// ---------------------------------------------------------------------------
// Helper: Extract display URL
// ---------------------------------------------------------------------------
const getDisplayUrl = (url) => {
  if (!url) return ''
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

// ---------------------------------------------------------------------------
// JAKE / CLASSIC SECTION BUILDERS
// ---------------------------------------------------------------------------

function buildJakeHeader(header = {}) {
  const name = escapeLatex(header.name) || 'Your Name'
  const phone = escapeLatex(header.phone)?.replace(/ /g, '~')
  const email = escapeLatex(header.email)
  
  const portfolio = header.portfolio ? `\\href{${header.portfolio}}{${getDisplayUrl(header.portfolio)}}` : ''
  const linkedin = header.linkedin ? `\\href{${header.linkedin}}{${getDisplayUrl(header.linkedin)}}` : ''
  const github = header.github ? `\\href{${header.github}}{${getDisplayUrl(header.github)}}` : ''
  const leetcode = header.leetcode ? `\\href{${header.leetcode}}{${getDisplayUrl(header.leetcode)}}` : ''

  const links = [
    phone || '',
    email ? `\\href{mailto:${email}}{${email}}` : '',
    portfolio,
    linkedin,
    github,
    leetcode,
  ].filter(Boolean).join(' $|$ ')

  return `\\begin{center}
  \\textbf{\\Huge \\scshape ${name}} \\\\ \\vspace{6pt}
  \\normalsize ${links}
\\end{center}`
}

function buildJakeObjective(objective = '') {
  if (!objective?.trim()) return ''
  return `%-----------OBJECTIVE-----------
\\section{Objective}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small{\\item{${escapeLatex(objective)}}}
\\end{itemize}`
}

function buildJakeSkills(skills = []) {
  if (!skills?.length) return ''
  const rows = skills
    .filter(s => s && (s.label?.trim() || s.skills?.trim()))
    .map(s => {
      const label = s.label?.trim() ? `\\textbf{${escapeLatex(s.label)}:}` : ''
      const val = escapeLatex(s.skills) || ''
      return `    ${[label, val].filter(Boolean).join(' ')}`
    })
    .filter(Boolean)
    .join(' \\\\\n')

  if (!rows) return ''

  return `%-----------TECHNICAL SKILLS-----------
\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small{\\item{
${rows}
  }}
\\end{itemize}`
}

function buildJakeExperience(experience = []) {
  if (!experience?.length) return ''

  const validExps = experience.filter(exp => {
    if (!exp) return false
    const hasText = exp.title?.trim() || exp.company?.trim() || exp.location?.trim() || exp.startDate?.trim() || exp.endDate?.trim()
    const hasBullets = (exp.bullets || []).some(b => b?.trim())
    return Boolean(hasText || hasBullets)
  })

  if (!validExps.length) return ''

  const entries = validExps.map(exp => {
    const validBullets = (exp.bullets || []).filter(b => b?.trim())
    const bullets = validBullets
      .map(b => `    \\resumeItem{${escapeLatex(b)}}`)
      .join('\n')

    const dates = [exp.startDate, exp.endDate].filter(Boolean).map(escapeLatex).join(' -- ')
    const bulletsSection = bullets
      ? `\n  \\resumeItemListStart\n${bullets}\n  \\resumeItemListEnd`
      : ''

    return `  \\resumeSubheading
    {${escapeLatex(exp.title)}}{${dates}}
    {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}${bulletsSection}`
  }).join('\n\n')

  if (!entries.trim()) return ''

  return `%-----------EXPERIENCE-----------
\\section{Experience}
\\resumeSubHeadingListStart
${entries}
\\resumeSubHeadingListEnd`
}

const STANDALONE_LINK_REGEX = /^[•\-\*◦▪▫–—\s]*((Live(\s*Site|\s*Demo)?)|GitHub|Demo|Code)(\s*\|\s*((Live(\s*Site|\s*Demo)?)|GitHub|Demo|Code|\s*))*$/i

function cleanProjectBullets(proj) {
  let effectiveTech = (proj.technologies || '').trim()
  const cleanBullets = []

  const rawBullets = (proj.bullets || []).filter(b => b && typeof b === 'string' && b.trim())
  for (const b of rawBullets) {
    const trimmed = b.trim()
    const techMatch = trimmed.match(/^(?:tech|technologies|tech stack)\s*:\s*(.*)$/i)
    if (techMatch) {
      if (!effectiveTech) effectiveTech = techMatch[1].trim()
      continue // Skip rendering as a regular bullet
    }

    if (effectiveTech && trimmed.toLowerCase() === effectiveTech.toLowerCase()) {
      continue // Skip exact duplicate of technologies
    }

    if (/^(?:live|github|demo|repo)\s*:\s*/i.test(trimmed)) {
      continue // Skip redundant links bullet
    }

    if (STANDALONE_LINK_REGEX.test(trimmed)) {
      continue // Skip standalone link headers without URLs
    }

    cleanBullets.push(trimmed)
  }

  return { cleanBullets, effectiveTech }
}

function buildJakeProjects(projects = []) {
  if (!projects?.length) return ''

  const validProjects = projects.filter(proj => {
    if (!proj) return false
    const hasText = proj.name?.trim() || proj.technologies?.trim() || proj.date?.trim() || proj.liveLink?.trim() || proj.githubLink?.trim()
    const hasBullets = (proj.bullets || []).some(b => b?.trim())
    return Boolean(hasText || hasBullets)
  })

  if (!validProjects.length) return ''

  const entries = validProjects.map(proj => {
    const { cleanBullets, effectiveTech } = cleanProjectBullets(proj)

    const bullets = cleanBullets
      .map(b => `    \\resumeItem{${escapeLatex(b)}}`)
      .join('\n')

    const links = []
    if (proj.liveLink) {
      links.push(`\\href{${proj.liveLink}}{\\underline{Live Site}}`)
    }
    if (proj.githubLink) {
      links.push(`\\href{${proj.githubLink}}{\\underline{GitHub}}`)
    }
    
    const linksBullet = links.length > 0 
      ? `    \\resumeItem{${links.join(' $|$ ')}}` 
      : ''

    const allBullets = [bullets, linksBullet].filter(Boolean).join('\n')
    const title = `\\textbf{${escapeLatex(proj.name)}}${effectiveTech ? ` $|$ \\emph{\\small ${escapeLatex(effectiveTech)}}` : ''}`

    const bulletsSection = allBullets
      ? `\n  \\resumeItemListStart\n${allBullets}\n  \\resumeItemListEnd`
      : ''

    return `  \\resumeProjectHeading
    {${title}}{${escapeLatex(proj.date)}}${bulletsSection}`
  }).join('\n\n')

  if (!entries.trim()) return ''

  return `%-----------PROJECTS-----------
\\section{Projects}
\\resumeSubHeadingListStart
${entries}
\\resumeSubHeadingListEnd`
}

function buildJakeEducation(education = []) {
  if (!education?.length) return ''

  const validEducation = education.filter(edu => {
    if (!edu) return false
    return Boolean(edu.institution?.trim() || edu.location?.trim() || edu.degree?.trim() || edu.field?.trim() || edu.coursework?.trim())
  })

  if (!validEducation.length) return ''

  const entries = validEducation.map(edu => {
    const dates = [edu.startDate, edu.endDate].filter(Boolean).map(escapeLatex).join(' -- ')
    const degreeField = [edu.degree, edu.field].filter(Boolean).map(escapeLatex).join(' in ')

    const courseworkBullet = edu.coursework?.trim()
      ? `\n  \\resumeItemListStart\n    \\resumeItem{${escapeLatex(edu.coursework)}}\n  \\resumeItemListEnd`
      : ''

    return `  \\resumeSubheading
    {${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}
    {${degreeField}}{${dates}}${courseworkBullet}`
  }).join('\n\n')

  if (!entries.trim()) return ''

  return `%-----------EDUCATION-----------
\\section{Education}
\\resumeSubHeadingListStart
${entries}
\\resumeSubHeadingListEnd`
}

function buildJakeCertifications(certifications = []) {
  if (!certifications?.length) return ''

  const entries = certifications
    .map(c => {
      if (typeof c === 'string') return c
      if (typeof c === 'object' && c !== null) {
        return [c.name, c.issuer, c.date].filter(Boolean).join(' - ')
      }
      return ''
    })
    .filter(c => c?.trim())
    .map(c => {
      const match = c.match(/^([^:]+):\s*(.*)$/)
      if (match) {
        return `  \\resumeItem{\\textbf{${escapeLatex(match[1])}:} ${escapeLatex(match[2])}}`
      }
      return `  \\resumeItem{${escapeLatex(c)}}`
    })
    .join('\n')

  if (!entries) return ''

  return `%-----------CERTIFICATIONS-----------
\\section{Certifications}
\\resumeItemListStart
${entries}
\\resumeItemListEnd`
}

function buildJakeAchievements(achievements = []) {
  if (!achievements?.length) return ''

  const entries = achievements
    .map(a => {
      if (typeof a === 'string') return a
      if (typeof a === 'object' && a !== null) {
        return [a.name, a.issuer, a.date].filter(Boolean).join(' - ')
      }
      return ''
    })
    .filter(a => a?.trim())
    .map(a => {
      const match = a.match(/^([^:]+):\s*(.*)$/)
      if (match) {
        return `  \\resumeItem{\\textbf{${escapeLatex(match[1])}:} ${escapeLatex(match[2])}}`
      }
      return `  \\resumeItem{${escapeLatex(a)}}`
    })
    .join('\n')

  if (!entries) return ''

  return `%-----------ACHIEVEMENTS-----------
\\section{Achievements}
\\resumeItemListStart
${entries}
\\resumeItemListEnd`
}

// ---------------------------------------------------------------------------
// BLUE ACCENT SECTION BUILDERS
// ---------------------------------------------------------------------------

function buildBlueHeader(header = {}) {
  const name = escapeLatex(header.name) || 'Your Name'
  const email = escapeLatex(header.email)
  const phone = escapeLatex(header.phone)

  const linkedin = header.linkedin ? `\\href{${header.linkedin}}{Linkedin: ${getDisplayUrl(header.linkedin)}}` : ''
  const github = header.github ? `\\href{${header.github}}{Github: ${getDisplayUrl(header.github)}}` : ''
  const portfolio = header.portfolio ? `\\href{${header.portfolio}}{Portfolio: ${getDisplayUrl(header.portfolio)}}` : ''
  const leetcode = header.leetcode ? `\\href{${header.leetcode}}{Leetcode: ${getDisplayUrl(header.leetcode)}}` : ''
  const emailItem = email ? `{Email: \\href{mailto:${email}}{${email}}}` : ''
  const phoneItem = phone ? `{Mobile:~~~${phone}}` : ''

  const leftItems = [linkedin, github, portfolio].filter(Boolean)
  const rightItems = [emailItem, phoneItem, leetcode].filter(Boolean)
  
  const maxRows = Math.max(leftItems.length, rightItems.length)
  let rows = ''
  for (let i = 0; i < maxRows; i++) {
    const left = leftItems[i] || ''
    const right = rightItems[i] || ''
    rows += `  ${left} & ${right}\\\\\n`
  }

  return `\\begin{tabular*}{\\textwidth}{l@{\\extracolsep{\\fill}}r}
  \\textbf{{\\LARGE \\color{Blue} ${name}}}\\\\
${rows}\\end{tabular*}`
}

function buildBlueObjective(objective = '') {
  if (!objective?.trim()) return ''
  return `\\section{\\color{BlueViolet} Objective}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\item\\small{${escapeLatex(objective)}}
\\end{itemize}`
}

function buildBlueSkills(skills = []) {
  if (!skills?.length) return ''
  const rows = skills
    .filter(s => s.label?.trim())
    .map(s => `\\resumeSubItem{\\color{Blue} ${escapeLatex(s.label)}}{${escapeLatex(s.skills)}}`)
    .join('\n')

  if (!rows) return ''

  return `\\section{\\color{BlueViolet} Technical Skills}
\\resumeSubHeadingListStart
${rows}
\\resumeSubHeadingListEnd
\\vspace{-2pt}`
}

function buildBlueEducation(education = []) {
  if (!education?.length) return ''

  const validEducation = education.filter(edu => {
    if (!edu) return false
    return Boolean(edu.institution?.trim() || edu.location?.trim() || edu.degree?.trim() || edu.field?.trim() || edu.coursework?.trim())
  })

  if (!validEducation.length) return ''

  const entries = validEducation.map(edu => {
    const dates = [edu.startDate, edu.endDate].filter(Boolean).map(escapeLatex).join(' -- ')
    const degreeField = [edu.degree, edu.field].filter(Boolean).map(escapeLatex).join(' in ')

    let out = `  \\resumeSubheading
      {\\color{Blue} ${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}
      {${degreeField}}{${dates}}`

    if (edu.coursework?.trim()) {
      const match = edu.coursework.match(/^([^:]+):\s*(.*)$/)
      if (match) {
        out += `\n      {\\scriptsize \\textit{ \\footnotesize{\\newline{}\\textbf{${escapeLatex(match[1])}:} ${escapeLatex(match[2])}}}}`
      } else {
        out += `\n      {\\scriptsize \\textit{ \\footnotesize{\\newline{}${escapeLatex(edu.coursework)}}}}`
      }
    }

    return out
  }).join('\n\n')

  if (!entries.trim()) return ''

  return `\\section{\\color{BlueViolet} Education}
\\resumeSubHeadingListStart
${entries}
\\resumeSubHeadingListEnd
\\vspace{-2pt}`
}

function buildBlueExperience(experience = []) {
  if (!experience?.length) return ''

  const validExps = experience.filter(exp => {
    if (!exp) return false
    const hasText = exp.title?.trim() || exp.company?.trim() || exp.location?.trim() || exp.startDate?.trim() || exp.endDate?.trim()
    const hasBullets = (exp.bullets || []).some(b => b?.trim())
    return Boolean(hasText || hasBullets)
  })

  if (!validExps.length) return ''

  const entries = validExps.map(exp => {
    const validBullets = (exp.bullets || []).filter(b => b?.trim())
    const bullets = validBullets
      .map(b => {
        const match = b.match(/^([^:]+):\s*(.*)$/)
        if (match) {
          return `          \\resumeItem{${escapeLatex(match[1])}}\n          {${escapeLatex(match[2])}}`
        }
        return `          \\resumeItemWithoutTitle{${escapeLatex(b)}}`
      })
      .join('\n')

    const dates = [exp.startDate, exp.endDate].filter(Boolean).map(escapeLatex).join(' -- ')
    const bulletsSection = bullets
      ? `\n    \\resumeItemListStart\n${bullets}\n    \\resumeItemListEnd`
      : ''

    return `  \\resumeSubheading{\\color{Blue} ${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
    {${escapeLatex(exp.title)}}{${dates}}${bulletsSection}`
  }).join('\n\n')

  if (!entries.trim()) return ''

  return `\\section{\\color{BlueViolet} Experience}
\\resumeSubHeadingListStart
${entries}
\\resumeSubHeadingListEnd
\\vspace{-2pt}`
}

function buildBlueProjects(projects = []) {
  if (!projects?.length) return ''

  const validProjects = projects.filter(proj => {
    if (!proj) return false
    const hasText = proj.name?.trim() || proj.technologies?.trim() || proj.date?.trim() || proj.liveLink?.trim() || proj.githubLink?.trim()
    const hasBullets = (proj.bullets || []).some(b => b?.trim())
    return Boolean(hasText || hasBullets)
  })

  if (!validProjects.length) return ''

  const entries = validProjects.map(proj => {
    const { cleanBullets, effectiveTech } = cleanProjectBullets(proj)

    const title = `  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textbf{\\color{Blue} ${escapeLatex(proj.name)}} & ${escapeLatex(proj.date || '')}\\\\
    \\end{tabular*}\\vspace{-5pt}`;

    const bullets = cleanBullets
      .map(b => {
        const match = b.match(/^([^:]+):\s*(.*)$/)
        if (match) {
          return `          \\resumeItem{${escapeLatex(match[1])}}{${escapeLatex(match[2])}}`
        }
        return `          \\resumeItemWithoutTitle{${escapeLatex(b)}}`
      })
      .join('\n');

    let extraBullets = [];
    if (effectiveTech) {
      extraBullets.push(`\\textbf{Tech:} ${escapeLatex(effectiveTech)}`);
    }

    const links = [];
    if (proj.liveLink) {
      links.push(`\\href{${proj.liveLink}}{Live: ${getDisplayUrl(proj.liveLink)}}`);
    }
    if (proj.githubLink) {
      links.push(`\\href{${proj.githubLink}}{GitHub: ${getDisplayUrl(proj.githubLink)}}`);
    }
    if (links.length > 0) {
      extraBullets.push(`\\color{BlueViolet} ${links.join(' $|$ ')}`);
    }

    const extraBulletsStr = extraBullets.map(b => `          \\resumeItemWithoutTitle{${b}}`).join('\n');

    const allBullets = [bullets, extraBulletsStr].filter(Boolean).join('\n');
    const bulletsSection = allBullets
      ? `\n    \\resumeItemListStart\n${allBullets}\n    \\resumeItemListEnd`
      : '';

    return `${title}${bulletsSection}`;
  }).join('\n\n')

  if (!entries.trim()) return ''

  return `\\section{\\color{BlueViolet} Projects}
\\resumeSubHeadingListStart
${entries}
\\resumeSubHeadingListEnd
\\vspace{-2pt}`
}

function buildBlueAchievements(achievements = []) {
  if (!achievements?.length) return ''

  const entries = achievements
    .map(c => {
      if (typeof c === 'string') return c
      if (typeof c === 'object' && c !== null) {
        return [c.name, c.issuer, c.date].filter(Boolean).join(' - ')
      }
      return ''
    })
    .filter(c => c?.trim())
    .map(c => {
      const match = c.match(/^([^:]+):\s*(.*)$/)
      if (match) {
        return `\\resumeSubItem{\\color{Blue} ${escapeLatex(match[1])}}{\\newline ${escapeLatex(match[2])}}`
      }
      return `\\resumeItemWithoutTitle{${escapeLatex(c)}}`
    })
    .join('\n\\vspace{2pt}\n')

  if (!entries) return ''

  return `\\section{\\color{BlueViolet} Achievements}
\\resumeSubHeadingListStart
\\vspace{2pt}
${entries}
\\vspace{2pt}
\\resumeSubHeadingListEnd
\\vspace{-5pt}`
}

function buildBlueCertifications(certifications = []) {
  if (!certifications?.length) return ''

  const entries = certifications
    .map(c => {
      if (typeof c === 'string') return c
      if (typeof c === 'object' && c !== null) {
        return [c.name, c.issuer, c.date].filter(Boolean).join(' - ')
      }
      return ''
    })
    .filter(c => c?.trim())
    .map(c => {
      const match = c.match(/^([^:]+):\s*(.*)$/)
      if (match) {
        return `  \\resumeItem{\\color{Blue} ${escapeLatex(match[1])}}{${escapeLatex(match[2])}}`
      }
      return `  \\resumeItemWithoutTitle{${escapeLatex(c)}}`
    })
    .join('\n')

  if (!entries) return ''

  return `\\section{\\color{BlueViolet} Certifications}
\\resumeItemListStart
${entries}
\\resumeItemListEnd
\\vspace{-2pt}`
}
