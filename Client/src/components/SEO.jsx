import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE_URL = 'https://latexume.vercel.app'
const DEFAULT_TITLE = "LaTexume - Free LaTeX ATS Resume Builder | Jake's Resume Template"
const DEFAULT_DESC = "Build 100% ATS-friendly software engineer resumes using Jake's Resume LaTeX template. Free online LaTeX resume generator with instant PDF export."

export default function SEO({ title, description, keywords, canonicalPath, ogImage }) {
  const location = useLocation()

  useEffect(() => {
    const currentTitle = title ? `${title} | LaTexume` : DEFAULT_TITLE
    const currentDesc = description || DEFAULT_DESC
    const currentCanonical = `${SITE_URL}${canonicalPath || location.pathname}`
    const currentOgImage = ogImage || `${SITE_URL}/Home.png`

    // Update document title
    document.title = currentTitle

    // Helper function to update or create meta tags
    const setMetaTag = (selector, attributeName, attributeValue, content) => {
      let element = document.querySelector(selector)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attributeName, attributeValue)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    // Update primary meta tags
    setMetaTag('meta[name="description"]', 'name', 'description', currentDesc)
    setMetaTag('meta[name="title"]', 'name', 'title', currentTitle)
    if (keywords) {
      setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords)
    }

    // Update Open Graph tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', currentTitle)
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', currentDesc)
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentCanonical)
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', currentOgImage)

    // Update Twitter tags
    setMetaTag('meta[property="twitter:title"]', 'property', 'twitter:title', currentTitle)
    setMetaTag('meta[property="twitter:description"]', 'property', 'twitter:description', currentDesc)
    setMetaTag('meta[property="twitter:url"]', 'property', 'twitter:url', currentCanonical)
    setMetaTag('meta[property="twitter:image"]', 'property', 'twitter:image', currentOgImage)

    // Update Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]')
    if (!canonicalLink) {
      canonicalLink = document.createElement('link')
      canonicalLink.setAttribute('rel', 'canonical')
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute('href', currentCanonical)
  }, [title, description, keywords, canonicalPath, ogImage, location.pathname])

  return null
}
