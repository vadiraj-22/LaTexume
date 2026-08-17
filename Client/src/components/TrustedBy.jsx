import React from 'react'

const COMPANY_LOGOS = [
  { name: 'Google' },
  { name: 'Meta' },
  { name: 'LinkedIn' },
  { name: 'Microsoft' },
  { name: 'Netflix' },
  { name: 'Slack' },
  { name: 'Framer' },
  { name: 'Amazon' },
]

const TrustedBy = () => {
  return (
    <>
      <style>{`
        .marquee-inner {
          animation: marqueeScroll 20s linear infinite;
        }

        @keyframes marqueeScroll {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="flex flex-col items-center justify-center gap-6 mx-auto mt-8 px-4 animate-fade-in-up animate-delay-400 w-full">
        <p className="text-white/50 text-xs sm:text-sm font-medium text-center uppercase tracking-wider">
          Trusted by professionals at top companies, including..
        </p>

        <div className="overflow-hidden w-full relative max-w-5xl mx-auto select-none py-2">
          {/* Left fade */}
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-black to-transparent" />

          {/* Marquee track */}
          <div className="flex items-center gap-12 marquee-inner will-change-transform">
            {[...COMPANY_LOGOS, ...COMPANY_LOGOS, ...COMPANY_LOGOS].map((company, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 text-zinc-400 hover:text-white font-extrabold text-base tracking-tight transition-all duration-300 whitespace-nowrap opacity-60 hover:opacity-100"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#A6FF5D]" />
                <span>{company.name}</span>
              </div>
            ))}
          </div>

          {/* Right fade */}
          <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-black to-transparent" />
        </div>
      </div>
    </>
  )
}

export default TrustedBy
