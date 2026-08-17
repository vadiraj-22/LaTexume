import React from 'react'

const ScrollDown = () => {
  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight * 0.85,
      behavior: 'smooth',
    })
  }

  return (
    <div
      className="flex flex-col items-center gap-2 mt-8 cursor-pointer group select-none"
      onClick={handleScroll}
    >
      <div className="w-6 h-10 rounded-full border-2 border-white/30 group-hover:border-[#A6FF5D] flex justify-center pt-2 transition-colors duration-300">
        <div className="w-1.5 h-2.5 rounded-full bg-[#A6FF5D] animate-bounce" />
      </div>
      <p className="text-[11px] text-white/40 group-hover:text-white transition-colors duration-200 uppercase tracking-widest font-semibold">
        Scroll down
      </p>
    </div>
  )
}

export default ScrollDown
