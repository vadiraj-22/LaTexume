import React from 'react'

const ScrollDown = () => {
  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  return (
    <div
      className="scroll-down flex flex-col items-center gap-4 mt-8 animate-bounce cursor-pointer"
      onClick={handleScroll}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 9A7 7 0 1 0 5 9v6a7 7 0 1 0 14 0zm-7-3v4"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-sm text-white/50">Scroll down</p>
    </div>
  )
}

export default ScrollDown
