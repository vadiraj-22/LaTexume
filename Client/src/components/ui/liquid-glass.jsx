import React from 'react'

/**
 * GlassEffect – a frosted-glass container used by the navbar "dynamic island".
 * Renders a translucent, blurred backdrop panel that clips its children.
 * Enhanced with liquid glass morphism effect for a more premium look.
 */
export const GlassEffect = ({ children, className = '', style = {}, ...rest }) => {
  // Check if backdrop-blur-3xl is in className (for expanded state)
  const isExpanded = className.includes('backdrop-blur-3xl')
  
  return (
    <div
      className={`relative bg-gradient-to-br from-white/[0.12] via-white/[0.08] to-white/[0.04] ${isExpanded ? 'backdrop-blur-3xl' : 'backdrop-blur-2xl'} border border-white/[0.15] shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] ${className}`}
      style={{
        ...style,
        // Add liquid glass effect with subtle animations
        background: isExpanded 
          ? 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.9) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)',
      }}
      {...rest}
    >
      {/* Liquid glass shine overlay */}
      {!isExpanded && (
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
