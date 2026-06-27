import React from 'react'

/**
 * GlassEffect – a frosted-glass container used by the navbar "dynamic island".
 * Renders a translucent, blurred backdrop panel that clips its children.
 * Enhanced with liquid glass morphism effect for a more premium look.
 * When `scrolled` is true the panel transitions to a solid dark opaque look.
 */
export const GlassEffect = ({ children, className = '', style = {}, scrolled = false, ...rest }) => {
  // Check if backdrop-blur-3xl is in className (for expanded state)
  const isExpanded = className.includes('backdrop-blur-3xl')

  // Dark opaque background applied when the user has scrolled away from the top
  const scrolledBg = 'linear-gradient(135deg, rgba(10,10,10,0.92) 0%, rgba(15,15,15,0.95) 50%, rgba(10,10,10,0.92) 100%)'
  const glassBg    = isExpanded
    ? 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.9) 100%)'
    : 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)'

  return (
    <div
      className={`relative ${isExpanded ? 'backdrop-blur-3xl' : 'backdrop-blur-2xl'} border shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] ${className}`}
      style={{
        ...style,
        background: scrolled && !isExpanded ? scrolledBg : glassBg,
        borderColor: scrolled && !isExpanded ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.15)',
        transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
      }}
      {...rest}
    >
      {/* Liquid glass shine overlay — hidden when dark/opaque */}
      {!isExpanded && !scrolled && (
        <div
          className="absolute inset-0 rounded-[inherit] opacity-50 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)',
          }}
        />
      )}
      {/* Content wrapper with z-index to stay above overlay */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default GlassEffect
