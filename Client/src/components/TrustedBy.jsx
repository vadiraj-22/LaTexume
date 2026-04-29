import React from 'react'

const TrustedBy = () => {
  const companies = [
    { name: 'Google', color: '#4285F4' },
    { name: 'Microsoft', color: '#00A4EF' },
    { name: 'Amazon', color: '#FF9900' },
    { name: 'Meta', color: '#0668E1' },
    { name: 'Apple', color: '#A6B1B7' }
  ]

  return (
    <div className="flex flex-col items-center justify-center gap-6 mx-auto mt-8 px-4">
      <div className="text-white/50 text-sm font-medium">
        Trusted by professionals at top companies
      </div>
      
      <div className="flex items-center gap-8 md:gap-12 flex-wrap justify-center">
        {companies.map((company, index) => (
          <div
            key={index}
            className="text-white/70 hover:text-white/90 font-semibold text-lg transition-all duration-300 hover:scale-110 cursor-default"
            style={{ textShadow: `0 0 20px ${company.color}40` }}
          >
            {company.name}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrustedBy
