import React from 'react'

/**
 * GlassEffect – a frosted-glass container used by the navbar "dynamic island".
 * Renders a translucent, blurred backdrop panel that clips its children.
 * Enhanced with liquid glass morphism effect for a more premium look.
 * When `scrolled` is true the panel transitions to a solid dark opaque look.
 */
export const GlassEffect = ({ children, className = '', style = {}, scrolled = false, ...rest }) => {
  // Check if backdrop-blur-3xl is in className (for full-width or expanded state)
  const isFullWidth = className.includes('backdrop-blur-3xl')
  const isRoundedFull = className.includes('rounded-full')

  // Define backgrounds based on state - enhanced translucency
  const scrolledIslandBg = 'linear-gradient(135deg, rgba(15,15,15,0.75) 0%, rgba(20,20,20,0.8) 50%, rgba(15,15,15,0.75) 100%)'
  const fullWidthGlassBg = 'linear-gradient(135deg, rgba(10,10,10,0.65) 0%, rgba(15,15,15,0.7) 50%, rgba(10,10,10,0.65) 100%)'
  const compactGlassBg = 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.03) 100%)'

  // Determine which background to use
  const background = scrolled && isRoundedFull 
    ? scrolledIslandBg 
    : isFullWidth && !scrolled
    ? fullWidthGlassBg
    : compactGlassBg

  // Determine border styling - more visible borders
  const borderColor = scrolled && isRoundedFull 
    ? 'rgba(255,255,255,0.15)' 
    : isFullWidth && !scrolled
    ? 'rgba(255,255,255,0.18)'
    : 'rgba(255,255,255,0.15)'

  // Shadow styling
  const shadowStyle = isFullWidth && !scrolled
    ? 'shadow-[0_4px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]'
    : 'shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)]'

  return (
    <div
      className={`relative border ${shadowStyle} ${className}`}
      style={{
        ...style,
        background,
        borderColor,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      {...rest}
    >
      {/* Enhanced liquid glass shine overlay - always visible */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300"
        style={{
          background: isFullWidth && !scrolled
            ? 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.12) 30%, transparent 70%)'
            : scrolled && isRoundedFull
            ? 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 40%, transparent 60%)'
            : 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)',
          opacity: 0.8,
        }}
      />
      
      {/* Additional frosted glass texture overlay - enhanced visibility */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300"
        style={{
          backgroundImage: isFullWidth && !scrolled
            ? `
              radial-gradient(circle at 20% 50%, rgba(166,255,93,0.12) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 50%),
              linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%)
            `
            : scrolled && isRoundedFull
            ? `
              radial-gradient(circle at 25% 40%, rgba(166,255,93,0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 60%, rgba(255,255,255,0.06) 0%, transparent 50%)
            `
            : 'none',
          opacity: 0.6,
        }}
      />
      
      {/* Subtle noise texture for glass effect */}
      <div
        className="absolute inset-0 rounded-[inherit] opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Content wrapper with z-index to stay above overlays */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default GlassEffect
