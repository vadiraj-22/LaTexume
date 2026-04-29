import { escapeLatex } from './latexEscape.js'
import { buildTemplate } from '../templates/jake.tex.js'

/**
 * Pure function: Resume_Data → complete .tex string
 * Applies escapeLatex to every user-supplied string before interpolation.
 *
 * @param {object} data - Resume_Data object
 * @returns {string} - Complete .tex source
 */
export function templateEngine(data) {
  return buildTemplate({
    header: buildHeader(data.header),
    objective: buildObjective(data.objective),
    skills: buildSkills(data.skills),
    experience: buildExperience(data.experience),
    projects: buildProjects(data.projects),
    education: buildEducation(data.education),
    certifications: buildCertifications(data.certifications),
  })
}

// ---------------------------------------------------------------------------
// Section builders
// ---------------------------------------------------------------------------

function buildHeader(header = {}) {
  const name = escapeLatex(header.name) || 'Your Name'
  const phone = escapeLatex(header.phone)
  const email = escapeLatex(header.email)
  const portfolio = header.portfolio ? `\\href{${header.portfolio}}{\\underline{Portfolio}}` : ''
  const linkedin = header.linkedin ? `\\href{${header.linkedin}}{\\underline{LinkedIn}}` : ''
  const github = header.github ? `\\href{${header.github}}{\\underline{GitHub}}` : ''
  const leetcode = header.leetcode ? `\\href{${header.leetcode}}{\\underline{LeetCode}}` : ''

  const links = [
    phone ? `\\small ${phone}` : '',
    email ? `\\href{mailto:${email}}{\\underline{${email}}}` : '',
    portfolio,
    linkedin,
    github,
    leetcode,
  ].filter(Boolean).join(' $|$ ')

  return `\\begin{center}
  \\textbf{\\Huge \\scshape ${name}} \\\\ \\vspace{1pt}
  ${links}
\\end{center}`
}

function buildObjective(objective = '') {
  if (!objective?.trim()) return ''
  return `%-----------OBJECTIVE-----------
\\section{Objective}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\small{\\item{${escapeLatex(objective)}}}
\\end{itemize}`
}

function buildSkills(skills = []) {
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

function buildExperience(experience = []) {
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

function buildProjects(projects = []) {
  if (!projects?.length) return ''

  const entries = projects.map(proj => {
    const bullets = (proj.bullets || [])
      .filter(b => b?.trim())
      .map(b => `    \\resumeItem{${escapeLatex(b)}}`)
      .join('\n')

    // Add links as the last bullet point if they exist
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

function buildEducation(education = []) {
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

function buildCertifications(certifications = []) {
  if (!certifications?.length) return ''

  const entries = certifications
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
