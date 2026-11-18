import { useEffect, useRef } from 'react'

// Fade-in on scroll (no animation library)
export function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return el?.classList.add('in')
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in'); io.disconnect() } }, { threshold: 0.12 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

// Per-page <title> + description + canonical + OG tags (SPA-friendly)
export function useSEO(title, description, canonical, ogImage = '/logo.png', noindex = false) {
  useEffect(() => {
    document.title = title ? `${title} | Techive Academy` : 'Techive Academy: learn, build, get certified'
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)

    // Indexing control
    let robotsMeta = document.querySelector('meta[name="robots"]')
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta')
      robotsMeta.setAttribute('name', 'robots')
      document.head.appendChild(robotsMeta)
    }
    robotsMeta.setAttribute('content', noindex ? 'noindex,nofollow' : 'index,follow')

    // Canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.appendChild(link)
      }
      link.href = canonical
    }

    // Open Graph tags
    const ogTags = {
      'og:title': title ? `${title} | Techive Academy` : 'Techive Academy: learn, build, get certified',
      'og:description': description || 'Free certified courses in website development with AI and Python programming, plus live Computer Packages classes.',
      'og:image': ogImage,
      'og:url': canonical || window.location.href,
      'og:type': 'website',
    }

    Object.entries(ogTags).forEach(([property, content]) => {
      let meta = document.querySelector(`meta[property="${property}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    })

    // Twitter Card tags
    const twitterTags = {
      'twitter:card': 'summary_large_image',
      'twitter:title': ogTags['og:title'],
      'twitter:description': ogTags['og:description'],
      'twitter:image': ogTags['og:image'],
    }

    Object.entries(twitterTags).forEach(([name, content]) => {
      let meta = document.querySelector(`meta[name="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    })

    window.scrollTo(0, 0)
  }, [title, description, canonical, ogImage, noindex])
}

// Round profile picture; falls back to the first letter of the name/email.
export function Avatar({ user, size = 36, className = '' }) {
  const letter = (user?.first_name || user?.email || '?')[0].toUpperCase()
  return user?.avatar_url ? (
    <img src={user.avatar_url} alt="" referrerPolicy="no-referrer" width={size} height={size} style={{ width: size, height: size }} className={`rounded-full object-cover ${className}`} />
  ) : (
    <span style={{ width: size, height: size }} className={`flex items-center justify-center rounded-full bg-brand-grad font-bold text-white ${className}`}>{letter}</span>
  )
}
