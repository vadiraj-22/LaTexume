import React from 'react'

const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Document with code brackets */}
        <rect
          x="6"
          y="4"
          width="28"
          height="32"
          rx="2"
          stroke="#A6FF5D"
          strokeWidth="2.5"
          fill="none"
        />
        
        {/* LaTeX-style code brackets */}
        <path
          d="M12 14L15 17L12 20"
          stroke="#A6FF5D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M28 14L25 17L28 20"
          stroke="#A6FF5D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Center slash representing code/LaTeX */}
        <line
          x1="22"
          y1="13"
          x2="18"
          y2="21"
          stroke="#A6FF5D"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Document lines at bottom */}
        <line x1="10" y1="26" x2="30" y2="26" stroke="#A6FF5D" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="10" y1="30" x2="26" y2="30" stroke="#A6FF5D" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* ATS checkmark badge */}
        <circle cx="32" cy="8" r="6" fill="#A6FF5D" />
        <path
          d="M29.5 8L31 9.5L34.5 6"
          stroke="#000"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex flex-col leading-tight">
        <span className="text-xl font-bold text-white">
          La<span className="text-primary">Texume</span>
        </span>
        <span className="text-[10px] text-gray-400 -mt-1">LaTeX-Powered ATS Resume</span>
      </div>
    </div>
  )
}

export default Logo
