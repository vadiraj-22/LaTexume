import dotenv from 'dotenv'
dotenv.config()

import { parseResume } from './lib/resumeParser.js'
import { templateEngine } from './lib/templateEngine.js'
import { compileTex } from './lib/compiler.js'

const RESUME_1 = `Vadiraj Joshi
Linkedin: linkedin.com/in/vadiraj-joshi220504 Email: vadirajjoshi22504@gmail.com
Github: github.com/vadiraj-22 Mobile: +91-7019286205
Portfolio: vadirajjoshiportfolio.in Leetcode: leetcode.com/u/Vadiraj22
Objective
Full Stack Developer experienced in React, Node.js, Express.js, MongoDB, and SQL. Currently building backend automation
solutions using Node.js and Puppeteer. I’ve developed real-world applications involving REST APIs, authentication, real-time
tracking, AI integrations, and cloud deployment, while solving 500+ DSA problems to strengthen my problem-solving skills.
Skills
Languages: Java(Proficient), JavaScript(Proficient), HTML5(Proficient), C(Good)
Frameworks: React(Proficient), Node.js(Proficient), Express.js(Proficient), Puppeteer(Proficient), Next.js(Decent), Tailwind
CSS(Proficient), Bootstrap(Good)
Tools/Platforms: MongoDB(Proficient), OracleSQL(Proficient), PostgreSQL(Good), MySQL(Good),
Git/GitHub(Proficient), Docker(Decent), Postman(Good), Vercel(Good), Render(Good)
Soft Skills: Leadership, Communication, Teamwork, Adaptability, Quick Learner
Experience
InvictoLabs Bengaluru, India
Backend Developer Intern May 2026 – Present
◦ Role Overview : Developed a full-stack web application automating tax certificate generation across 200+ U.S. county
websites using Node.js, Express, and Puppeteer, implementing county-specific scraping logic to handle dynamic forms,
PDF parsing, and extraction of tax values, penalties, and installment status.
◦ Impact : Reduced manual effort by automating repetitive workflows and improving data reliability for non-technical
teams.
◦ AI Title Automation : Automated the title typing workflow using AI, replacing manual review and typing of tax,
deed, mortgage, and other title data with automatically generated typed reports at 90% accuracy, reducing the title
document workflow time by 50%.
Projects
CivicFix – Digitizing Municipal Services for Smart Cities
◦ Engineered a full-stack civic engagement platform using React 19, Node.js, Express.js, and MongoDB, enabling 3-tier
role-based access (Citizens, Volunteers, Admins) with JWT authentication, Cloudinary image handling, and real-time
geolocation-based issue reporting across 4 complaint categories.
◦ Developed RESTful APIs with Multer uploads, community voting/comments, and GeoJSON-indexed spatial queries
(MongoDB 2dsphere) supporting complaint lifecycle tracking; built responsive UI with React Router, Tailwind CSS 4,
Leaflet maps, Google OAuth, dashboard analytics, and jsPDF reports, deployed on Vercel.
◦ Tech: React, Node.js, Express.js, MongoDB, Tailwind CSS, Leaflet, Cloudinary
◦ Live: civicfix-three.vercel.app | GitHub: github.com/vadiraj-22/clean-street
SafePass – Encrypted Vault & Password Security Suite
◦ Architected a full-stack password security platform (React 19, Node.js, Express.js, MongoDB Atlas) with JWT
authentication, bcrypt hashing, and token-based access control; built a cryptographic password generator, a breach
checker using the Have I Been Pwned API via k-anonymity SHA-1 hashing, and an encrypted vault manager with user
data isolation.
◦ Tech: React, Node.js, Express.js, MongoDB Atlas, Tailwind CSS, Framer Motion
◦ Live: safepass-ewqi.onrender.com | GitHub: github.com/vadiraj-22/SafePass
Education
Sri Siddhartha Institute of Technology Tumakuru, Karnataka
Bachelor of Engineering in Information Science 2022 – 2026
Object-Oriented Programming, Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, Blockchain, Software
Engineering, Web Technologies, Problem Solving
Achievements
Solved 500+ DSA Problems on LeetCode :
Using Java and SQL, demonstrating strong problem-solving and algorithmic skills.
Selected for KSCST Funding :
Recognized by the Karnataka State Council for Science and Technology (Government of Karnataka) for innovation in civic
issue management through the Clean Street project.
Certifications
• NPTEL Certification: Completed a 12-week course on Cloud Computing (July – October 2024)`

const RESUME_2 = `VADIRAJ JOSHI
+91-7019286205 | vadirajjoshi22504@gmail.com | vadirajjoshiportfolio.in | linkedin.com/in/vadiraj-joshi220504 |
github.com/vadiraj-22 | leetcode.com/u/Vadiraj 2 2
OBJECTIVE
Full Stack Developer experienced in React, Node.js, Express.js, MongoDB, and SQL. Currently building backend automation solutions
using Node.js and Puppeteer. I’ve developed real-world applications involving REST APIs, authentication, real-time tracking, AI
integrations, and cloud deployment, while solving 500+ DSA problems to strengthen my problem-solving skills.
TECHNICAL SKILLS
Languages: Java (Proficient), JavaScript (Proficient), C (Good)
Frameworks: React (Proficient), Node.js (Proficient), Express.js (Proficient), Puppeteer (Proficient), Next.js (Decent), Tailwind CSS
(Proficient), Bootstrap (Good),HTML5 (Proficient),
Tools/Platforms: MongoDB (Proficient), OracleSQL (Proficient), PostgreSQL (Good), MySQL (Good), Git/GitHub (Proficient), Docker
(Decent), Postman (Good), Vercel (Good), Render (Good)
Soft Skills: Leadership, Communication, Teamwork, Adaptability, Quick Learner
EDUCATION
Sri Siddhartha Institute of Technology Tumakuru, Karnataka
Bachelor of Engineering in Information Science 2022 – 2026
EXPERIENCE
Backend Developer Intern May 2026 – Present
InvictoLabs Bengaluru, India
– Built TitleFlow AI using Python, FastAPI, React, TypeScript, SQLite, Electron, and Gemini API.
– Automated PDF/Word reports from deed, mortgage, lien, and judgment data with AI quality checks, achieving 90% accuracy and
50% time savings.
– Automated tax data extraction across 200+ U.S. county websites using Node.js, Express, and Puppeteer.
PROJECTS
CivicFix – Digitizing Municipal Services for Smart Cities | React, Node.js, Express.js, MongoDB, Tailwind CSS, Leaflet, Cloudinary
– Engineered a full-stack civic engagement platform using React 19, Node.js, Express.js, and MongoDB, enabling 3-tier role-based
access (Citizens, Volunteers, Admins) with JWT authentication, Cloudinary image handling, and real-time geolocation-based issue
reporting across 4 complaint categories.
– Developed RESTful APIs with Multer uploads, community voting/comments, and GeoJSON-indexed spatial queries (MongoDB
2dsphere) supporting complaint lifecycle tracking; built responsive UI with React Router, Tailwind CSS 4, Leaflet maps, Google
OAuth, dashboard analytics, and jsPDF reports, deployed on Vercel.
– Tech: React, Node.js, Express.js, MongoDB, Tailwind CSS, Leaflet, Cloudinary
– Live Site | GitHub
Latexume | Open-Source LaTeX Resume Builder & ATS Optimizer — React, Node.js, Express.js, MongoDB, pdflatex, Tailwind CSS, Groq
– Engineered a full-stack LaTeX resume platform using React, Node.js, Express.js, and MongoDB, integrating server-side pdflatex
compilation to generate 100% ATS-compliant single-column resumes across 3 styles (Jake’s Clean, Blue Accent, Classic) with
sub-second (¡0.4s) PDF rendering
– Developed RESTful APIs with PDF parsing (pdf-parse) for resume importing, JWT auth, and a hybrid ATS matcher combining local
NLP taxonomy extraction with Google Gemini/Groq AI failover for real-time skill scoring; built responsive UI with PDF.js preview,
live ATS gauges, and dynamic section ordering.
– Live Site | GitHub
ACHIEVEMENTS
• Solved 500+ DSA Problems on LeetCode: Using Java and SQL, demonstrating strong problem-solving and algorithmic skills.
• Selected for KSCST Funding: Recognized by the Karnataka State Council for Science and Technology (Government of Karnataka) for
innovation in civic issue management through the Clean Street project.
CERTIFICATIONS
• NPTEL Certification: Completed a 12-week course on Cloud Computing (July – October 2024)
• NPTEL Certification: Completed a 12-week course on Privacy and Security in Social Media (January – April 2025)`

const RESUME_3 = `Vadiraj Joshi
7019286205 vadirajjoshi22504@gmail.com LinkedIn GitHub
Professional Summary
Proficient Full Stack Developer experienced in building responsive and reliable web applications using React,
Express, MongoDB and Node.js. Skilled in data structures and algorithms using Java, focused on delivering clean
and scalable solutions.
Education
Sri Siddhartha Institute of Technology 2022 – 2026
Bachelor of Engineering in Information Science Tumakuru, Karnataka
Sri Guru PU College 2020 – 2022
Pre-University Course (PUC) Hosapete, Karnataka
Work Experience
Full Stack Developer Intern September 2025 – Present
Infosys Springboard Virtual Internship 6.0 Remote
– Developed “Clean Street,” a full-stack MERN application enabling real-time street-cleanliness reporting, geo-tagged
complaint submission, location-based volunteer assignment, and a full admin analytics panel using React, Vite, Node.js,
Express, MongoDB, Tailwind CSS, and Leaflet Maps, over an 8-week period while following Agile methodology throughout
the SDLC.
Live Site: clean-street.vercel.app
Projects
QuickAI – AI SaaS Platform (Full Stack) | React, Node.js, Express, PostgreSQL (Neon), Cloudinary, Clerk 2025
– Developed an AI-powered SaaS platform with features such as Image Generation, Background Removal, Single
Object Removal, Blog Title Creation, Article Generation, and Resume Analysis using integrated Gemini and
ClipDrop APIs.
– Built secure, scalable backend services with Node.js, Express, RESTful APIs, and Clerk-based authentication with
social/email login and role management.
Live Site: https://quick-ai-gray.vercel.app/
Clean Street – Civic Engagement Platform (Full Stack) | React, Node.js, Express, MongoDB, Cloudinary 2025
– Developed a full-stack civic engagement platform enabling citizens to report cleanliness issues with geo-tagged
photos, track complaint status, and coordinate with volunteers, featuring interactive Leaflet maps, real-time
comments, and admin analytics dashboards with graphs and pie charts .
– Implemented secure backend functionality using Express and MongoDB with role-based access control, Cloudinary
uploads, cookie sessions, and a CORS-enabled architecture, and developed a responsive React frontend with TailwindCSS
and Vite featuring multi-role dashboards and streamlined complaint workflows.
Live Site: clean-street.vercel.app
Skills
Programming: Java, C, Python
Frontend: React, HTML, CSS, Tailwind CSS, Bootstrap
Databases: SQL, PostgreSQL, MongoDB
Backend: JavaScript, Node.js, Express.js
Tools: Git, GitHub, VS Code, Postman
Soft Skills: Problem-Solving, Teamwork, Communication
Certifications & Training
Google Cybersecurity Specialization
Google AI Essentials
The Complete Full-Stack Web Development Bootcamp (Angela Yu)
Developed multiple full-stack applications using React, Node.js, Express, and MongoDB.
NPTEL Cloud Computing Certification
Completed a 12-week Cloud Computing course (Jul–Oct 2024).
AI Virtual Internship – Edunet Foundation (Microsoft & AICTE)
Built a machine learning model using Logistic Regression achieving 85% accuracy.`

async function testAll() {
  const resumes = [
    { name: 'Resume 1 (InvictoLabs & CivicFix/SafePass)', text: RESUME_1 },
    { name: 'Resume 2 (InvictoLabs & CivicFix/Latexume)', text: RESUME_2 },
    { name: 'Resume 3 (2-page Infosys & QuickAI/Clean Street)', text: RESUME_3 },
  ]

  for (const r of resumes) {
    console.log(`\n======================================================`)
    console.log(`TESTING: ${r.name}`)
    console.log(`======================================================`)

    const parseResult = await parseResume({ resumeText: r.text })
    if (parseResult.error) {
      console.error('PARSE FAILED:', parseResult.error)
      continue
    }

    const data = parseResult.data
    console.log('✓ PARSE SUCCESS')
    console.log('Header Name:', data.header?.name)
    console.log('Header Email:', data.header?.email)
    console.log('Header Phone:', data.header?.phone)
    console.log('Header Links:', {
      linkedin: data.header?.linkedin,
      github: data.header?.github,
      portfolio: data.header?.portfolio,
      leetcode: data.header?.leetcode,
    })
    console.log('Objective length:', data.objective?.length)
    console.log('Skills Categories:', data.skills?.map(s => s.label))
    console.log('Experience Count:', data.experience?.length)
    data.experience?.forEach((e, idx) => {
      console.log(`  Exp #${idx + 1}: ${e.title} at ${e.company} (${e.location}) [${e.startDate} - ${e.endDate}], bullets: ${e.bullets?.length}`)
    })
    console.log('Projects Count:', data.projects?.length)
    data.projects?.forEach((p, idx) => {
      console.log(`  Proj #${idx + 1}: ${p.name} | Tech: ${p.technologies} | Date: ${p.date} | bullets: ${p.bullets?.length}`)
      console.log(`    bullets sample:`, p.bullets)
      console.log(`    links: live=${p.liveLink}, github=${p.githubLink}`)
    })
    console.log('Education Count:', data.education?.length)
    data.education?.forEach((ed, idx) => {
      console.log(`  Edu #${idx + 1}: ${ed.degree} from ${ed.institution} (${ed.startDate} - ${ed.endDate}) Coursework: ${ed.coursework ? 'Yes' : 'No'}`)
    })
    console.log('Certifications Count:', data.certifications?.length)
    console.log('Achievements Count:', data.achievements?.length)

    // Now test compile across all 3 templates: jake, blueAccent, classic
    for (const tId of ['jake', 'blueAccent', 'classic']) {
      try {
        const tex = templateEngine({ templateId: tId, ...data })
        const pdfBuffer = await compileTex(tex)
        const isPdf = pdfBuffer.slice(0, 4).toString() === '%PDF'
        console.log(`  -> Template [${tId}] compiled successfully: ${isPdf ? 'VALID PDF (' + pdfBuffer.length + ' bytes)' : 'FAIL'}`)
      } catch (err) {
        console.error(`  -> Template [${tId}] FAILED TO COMPILE:`, err.message)
      }
    }
  }
}

testAll().catch(console.error)
