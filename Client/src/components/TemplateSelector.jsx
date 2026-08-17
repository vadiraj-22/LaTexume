import React from 'react'

const TEMPLATES = [
  {
    id: 'jake',
    name: "Jake's Resume",
    badge: 'FAANG Standard',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    description: 'The industry-standard ATS template used by software engineers at Google, Meta, and Amazon.',
    tag: 'Monochrome • Single Column • Max ATS Score',
    accentColor: '#3b82f6',
  },
  {
    id: 'blueAccent',
    name: 'Blue Accent ATS',
    badge: 'Modern Colored',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    description: 'Vibrant blue header & section accents tailored for high readability and structured ATS parsing.',
    tag: 'Accent Headers • Clean Tables • Modern ATS',
    accentColor: '#4f46e5',
  },
  {
    id: 'classic',
    name: 'Executive Classic',
    badge: 'Traditional Serif',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    description: 'Formal serif typography with classic rule dividers, perfect for senior roles, management, & academia.',
    tag: 'Charter Font • Formal Dividers • Traditional ATS',
    accentColor: '#f59e0b',
  },
]

export default function TemplateSelector({ selectedTemplate, onSelectTemplate }) {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 mb-8 backdrop-blur-sm shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Choose LaTeX ATS Template
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Select an ATS-tested LaTeX layout. All templates guarantee 100% Applicant Tracking System compatibility.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-800/80 px-3 py-1.5 rounded-lg border border-zinc-700/50 self-start md:self-auto">
          <span className="text-xs text-zinc-400 font-medium">Active:</span>
          <span className="text-xs font-semibold text-emerald-400">
            {TEMPLATES.find((t) => t.id === selectedTemplate)?.name || "Jake's Resume"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TEMPLATES.map((tmpl) => {
          const isSelected = selectedTemplate === tmpl.id
          return (
            <button
              key={tmpl.id}
              type="button"
              onClick={() => onSelectTemplate(tmpl.id)}
              className={`relative text-left p-5 rounded-xl border transition-all duration-200 group flex flex-col justify-between ${
                isSelected
                  ? 'bg-zinc-800/90 border-emerald-500/60 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-950/30'
                  : 'bg-zinc-950/40 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${tmpl.badgeColor}`}>
                    {tmpl.badge}
                  </span>
                  {isSelected && (
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-black text-xs font-bold">
                      ✓
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {tmpl.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {tmpl.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500">
                  {tmpl.tag}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
