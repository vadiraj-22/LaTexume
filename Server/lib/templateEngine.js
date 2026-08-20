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
  const sectionOrder = data.sectionOrder || []

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
    .filter(s => s.label?.trim())
    .map(s => `    \\textbf{${escapeLatex(s.label)}:} ${escapeLatex(s.skills)}`)
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

  const entries = experience.map(exp => {
    const bullets = (exp.bullets || [])
      .filter(b => b?.trim())
      .map(b => `    \\resumeItem{${escapeLatex(b)}}`)
      .join('\n')

    const dates = [exp.startDate, exp.endDate].filter(Boolean).map(escapeLatex).join(' -- ')

    return `  \\resumeSubheading
    {${escapeLatex(exp.title)}}{${dates}}
    {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
  \\resumeItemListStart
${bullets}
  \\resumeItemListEnd`
  }).join('\n\n')

  return `%-----------EXPERIENCE-----------
\\section{Experience}
\\resumeSubHeadingListStart
${entries}
\\resumeSubHeadingListEnd`
}

function buildJakeProjects(projects = []) {
  if (!projects?.length) return ''

  const entries = projects.map(proj => {
    const bullets = (proj.bullets || [])
      .filter(b => b?.trim())
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

    const allBullets = linksBullet ? `${bullets}\n${linksBullet}` : bullets
    const title = `\\textbf{${escapeLatex(proj.name)}}${proj.technologies ? ` $|$ \\emph{\\small ${escapeLatex(proj.technologies)}}` : ''}`

    return `  \\resumeProjectHeading
    {${title}}{${escapeLatex(proj.date)}}
  \\resumeItemListStart
${allBullets}
  \\resumeItemListEnd`
  }).join('\n\n')

  return `%-----------PROJECTS-----------
\\section{Projects}
\\resumeSubHeadingListStart
${entries}
\\resumeSubHeadingListEnd`
}

function buildJakeEducation(education = []) {
  if (!education?.length) return ''

  const entries = education.map(edu => {
    const dates = [edu.startDate, edu.endDate].filter(Boolean).map(escapeLatex).join(' -- ')
    const degreeField = [edu.degree, edu.field].filter(Boolean).map(escapeLatex).join(' in ')

    return `  \\resumeSubheading
    {${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}
    {${degreeField}}{${dates}}`
  }).join('\n\n')

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
    .map(c => `  \\resumeItem{${escapeLatex(c)}}`)
    .join('\n')

  if (!entries) return ''

  return `%-----------CERTIFICATIONS-----------
\\section{Certifications and Achievements}
\\resumeSubHeadingListStart
${entries}
\\resumeSubHeadingListEnd`
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

  return `\\section{\\color{BlueViolet} Skills}
\\resumeSubHeadingListStart
${rows}
\\resumeSubHeadingListEnd
\\vspace{-2pt}`
}

function buildBlueEducation(education = []) {
  if (!education?.length) return ''

  const entries = education.map(edu => {
    const dates = [edu.startDate, edu.endDate].filter(Boolean).map(escapeLatex).join(' -- ')
    const degreeField = [edu.degree, edu.field].filter(Boolean).map(escapeLatex).join(' in ')

    let out = `  \\resumeSubheading
      {\\color{Blue} ${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}
      {${degreeField}}{${dates}}`

    if (edu.coursework) {
      const match = edu.coursework.match(/^([^:]+):\s*(.*)$/)
      if (match) {
        out += `\n      {\\scriptsize \\textit{ \\footnotesize{\\newline{}\\textbf{${escapeLatex(match[1])}:} ${escapeLatex(match[2])}}}}`
      } else {
        out += `\n      {\\scriptsize \\textit{ \\footnotesize{\\newline{}${escapeLatex(edu.coursework)}}}}`
      }
    }

    return out
  }).join('\n\n')

  return `\\section{\\color{BlueViolet} Education}
\\resumeSubHeadingListStart
${entries}
\\resumeSubHeadingListEnd
\\vspace{-2pt}`
}

function buildBlueExperience(experience = []) {
  if (!experience?.length) return ''

  const entries = experience.map(exp => {
    const bullets = (exp.bullets || [])
      .filter(b => b?.trim())
      .map(b => {
        const match = b.match(/^([^:]+):\s*(.*)$/)
        if (match) {
          return `          \\resumeItem{${escapeLatex(match[1])}}\n          {${escapeLatex(match[2])}}`
        }
        return `          \\resumeItemWithoutTitle{${escapeLatex(b)}}`
      })
      .join('\n')

    const dates = [exp.startDate, exp.endDate].filter(Boolean).map(escapeLatex).join(' -- ')

    return `  \\resumeSubheading{\\color{Blue} ${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
    {${escapeLatex(exp.title)}}{${dates}}
    \\resumeItemListStart
${bullets}
    \\resumeItemListEnd`
  }).join('\n\n')

  return `\\section{\\color{BlueViolet} Experience}
\\resumeSubHeadingListStart
${entries}
\\resumeSubHeadingListEnd
\\vspace{-2pt}`
}

function buildBlueProjects(projects = []) {
  if (!projects?.length) return ''

  const entries = projects.map(proj => {
    const bulletsText = (proj.bullets || []).filter(b => b?.trim()).map(escapeLatex).join('\\newline ')
    const techText = proj.technologies ? `\\newline Tech: ${escapeLatex(proj.technologies)}` : ''

    const links = []
    if (proj.liveLink) {
      links.push(`Live: \\href{${proj.liveLink}}{${getDisplayUrl(proj.liveLink)}}`)
    }
    if (proj.githubLink) {
      links.push(`GitHub: \\href{${proj.githubLink}}{${getDisplayUrl(proj.githubLink)}}`)
    }

    const linksText = links.length > 0 ? `\\newline \\color{BlueViolet} ${links.join(', \\hspace{7pt} ')}` : ''
    const content = `${bulletsText}${techText}${linksText}`

    return `\\resumeSubItem{\\color{Blue} ${escapeLatex(proj.name)}}{${content}}`
  }).join('\n\\vspace{2pt}\n')

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
    .map(c => `\\item {${escapeLatex(c)}}`)
    .join('\n')

  if (!entries) return ''

  return `\\section{\\color{BlueViolet} Certifications}
\\begin{description}[font=$\\bullet$]
${entries}
\\vspace{-5pt}
\\end{description}`
}
