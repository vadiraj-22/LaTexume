/**
 * Blue Accent ATS Resume Template
 * Uses ATS-optimized layout with vibrant colored section titles (\color{BlueViolet})
 * and colored header details (\color{Blue}).
 */

export const PREAMBLE = `\\documentclass[a4paper,10pt]{article}

\\usepackage[hidelinks]{hyperref}
\\usepackage{lipsum}

\\pdfstringdefDisableCommands{%
  \\def\\color#1{}%
}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}
\\pagestyle{empty}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}

\\urlstyle{rm}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-10pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-6pt}]

% Custom commands
\\newcommand{\\resumeItem}[2]{
  \\item\\small{
    \\textbf{#1}{: #2 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeItemWithoutTitle}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-1pt}\\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{#3} & \\textit{#4} \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\newcommand{\\resumeSubItem}[2]{\\resumeItem{#1}{#2}\\vspace{-3pt}}

\\renewcommand{\\labelitemii}{$\\circ$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}
`

export function buildTemplate({ header, sectionOrder, ...sectionMap }) {
  const defaultOrder = ['skills', 'education', 'experience', 'projects', 'achievements', 'certifications', 'objective']
  const order = Array.isArray(sectionOrder) && sectionOrder.length > 0 ? sectionOrder : defaultOrder

  const bodyContent = order
    .map((key) => sectionMap[key])
    .filter(Boolean)
    .join('\n\n')

  return `${PREAMBLE}
% -----------------------------
%%%%% CV STARTS HERE  %%%%%%

\\begin{document}

${header}

${bodyContent}

\\end{document}
`
}
