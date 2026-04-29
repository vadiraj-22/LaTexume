/**
 * Escapes LaTeX special characters in a user-supplied string.
 * Order matters: backslash must be replaced FIRST to avoid
 * double-escaping the backslashes introduced by later replacements.
 *
 * @param {string|null|undefined} str
 * @returns {string}
 */
export function escapeLatex(str) {
  if (str == null) return ''

  return str
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}')
}
