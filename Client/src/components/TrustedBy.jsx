import React from 'react'

const TrustedBy = () => {
  const companyLogos = [
    'slack',
    'framer',
    'netflix',
    'google',
    'linkedin',
    'instagram',
    'facebook',
  ]

  return (
    <>
      <style>{`
        .marquee-inner {
          animation: marqueeScroll 15s linear infinite;
        }

        @keyframes marqueeScroll {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="flex flex-col items-center justify-center gap-6 mx-auto mt-8 px-4 animate-fade-in-up animate-delay-400 w-full">
        <p className="text-white/50 text-sm font-medium text-center">
          Trusted by professionals at top companies, including..
        </p>

        <div className="overflow-hidden w-full relative max-w-5xl mx-auto select-none">
          {/* Left fade */}
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-black to-transparent" />

          {/* Marquee track — duplicated list so it loops seamlessly */}
          <div className="flex marquee-inner will-change-transform">
            {[...companyLogos, ...companyLogos].map((company, index) => (
              <img
                key={index}
                src={`https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/${company}.svg`}
                alt={company}
                className="h-7 w-auto object-contain mx-8 brightness-0 invert opacity-40 hover:opacity-70 transition-opacity duration-300"
                draggable={false}
              />
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
