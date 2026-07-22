import { parseResume } from './lib/resumeParser.js'

const testInput = `Vadiraj Joshi
Linkedin: vadiraj-joshi220504 Email: vadirajjoshi22504@gmail.com
Github: github.com/vadiraj-22 Mobile: +91-7019286205
Skills Summary
• Languages: Java(Proficient), JavaScript(Proficient), HTML5(Proficient), C(Good)
• Frameworks: React(Proficient), Node.js(Proficient), Express.js(Proficient), Puppeteer(Proficient), Next.js(Decent),
Tailwind CSS(Proficient), Bootstrap(Good)
• Tools/Platforms: MongoDB(Proficient), OracleSQL(Proficient), PostgreSQL(Good), MySQL(Good),
Git/GitHub(Proficient), Docker(Decent), Postman(Good), Vercel(Good), Render(Good)
• Soft Skills: Leadership, Communication, Teamwork, Adaptability, Quick Learner
Education
• Sri Siddhartha Institute of Technology Tumakuru, Karnataka
Bachelor of Engineering - Information Science; CGPA: 8.58 2022 - 2026
Core Coursework: Object-Oriented Programming, Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks,
Blockchain, Software Engineering, Web Technologies, Problem Solving
Experience
• InvictoLabs Bengaluru, India
Backend Developer Intern May 2026 – Present
◦ Role Overview: Developed a full-stack web application automating tax certificate generation across 200+ U.S. county
websites using Node.js, Express, and Puppeteer, implementing county-specific scraping logic to handle dynamic forms,
PDF parsing, and extraction of tax values, penalties, and installment status.
◦ Impact: Reduced manual effort by automating repetitive workflows and improving data reliability for non-technical
teams.
• Infosys Springboard Virtual Internship 6.0
Full Stack Developer Intern September 2025 – November 2025
◦ Role Overview: Led frontend development of CivicFix (formerly Clean Street) in a team of 6 during an 8-week Agile
SDLC cycle, taking ownership of UI architecture and coordinating tasks across team members. Built responsive
dashboards using React and Tailwind CSS for 25+ active users and 50+ registered civic complaints.
◦ Collaboration: Collaborated within a cross-functional team in sprint-based delivery, integrating REST APIs and
Leaflet.js maps to enable real-time complaint tracking; received an Internship Completion Certificate.
Projects
• CivicFix – Digitizing Municipal Services for Smart Cities: Engineered a full-stack civic engagement platform using
React 19, Node.js, Express.js, and MongoDB, enabling 3-tier role-based access (Citizens, Volunteers, Admins) with JWT
authentication, Cloudinary image handling, and real-time geolocation-based issue reporting across 4 complaint categories.
Developed RESTful APIs with Multer uploads, community voting/comments, and GeoJSON-indexed spatial queries
(MongoDB 2dsphere) supporting complaint lifecycle tracking; built responsive UI with React Router, Tailwind CSS 4, Leaflet
maps, Google OAuth, dashboard analytics, and jsPDF reports, deployed on Vercel.
Tech: React, Node.js, Express.js, MongoDB, Tailwind CSS, Leaflet, Cloudinary
Live: civicfix-three.vercel.app, GitHub: github.com/vadiraj-22/clean-street
• SafePass – Encrypted Vault & Password Security Suite: Architected a full-stack password security platform (React 19,
Node.js, Express.js, MongoDB Atlas) with JWT authentication, bcrypt hashing, and token-based access control; built a
cryptographic password generator, a breach checker using the Have I Been Pwned API via k-anonymity SHA-1 hashing, and an
encrypted vault manager with user data isolation.
Tech: React, Node.js, Express.js, MongoDB Atlas, Tailwind CSS, Framer Motion
Live: safepass-ewqi.onrender.com , GitHub: github.com/vadiraj-22/SafePass
• QuickAI – AI SaaS Web Application: Built and deployed a full-stack AI SaaS platform (React, Node.js, Express.js,
PostgreSQL) integrating Gemini and ClipDrop APIs for content generation, image creation, and resume analysis, with Clerk
authentication and usage-based access control for free and premium users.
Tech: React, Node.js, Express.js, PostgreSQL, Clerk
Live: quick-ai-gray.vercel.app, GitHub: github.com/vadiraj-22/QuickAI
Achievements
• Solved 500+ DSA Problems on LeetCode:
Using Java and SQL, demonstrating strong problem-solving and algorithmic skills.
• Selected for KSCST Funding:
Recognized by the Karnataka State Council for Science and Technology (Government of Karnataka) for innovation in civic
issue management through the Clean Street project.
Certifications
• NPTEL Certification: Completed a 12-week course on Cloud Computing (July – October 2024).`

console.log('Testing refined parser...')
